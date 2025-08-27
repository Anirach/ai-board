import prisma from '../config/database.js';

// Get all boards for a user
export const getBoards = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {
      OR: [
        { userId: req.user.id }, // User's own boards
        { isPublic: true }       // Public boards
      ]
    };

    if (search) {
      where.AND = [
        where.OR ? { OR: where.OR } : {},
        {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } }
          ]
        }
      ];
      delete where.OR;
    }

    const [boards, total] = await Promise.all([
      prisma.board.findMany({
        where,
        skip,
        take: parseInt(limit),
        include: {
          user: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatar: true
            }
          },
          boardPersonas: {
            include: {
              persona: {
                select: {
                  id: true,
                  name: true,
                  role: true,
                  avatar: true
                }
              }
            }
          },
          _count: {
            select: {
              conversations: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.board.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        boards: boards.map(board => ({
          ...board,
          personas: board.boardPersonas.map(bp => bp.persona),
          conversationCount: board._count.conversations
        })),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get boards error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching boards',
      error: error.message
    });
  }
};

// Get a single board by ID
export const getBoard = async (req, res) => {
  try {
    const { id } = req.params;

    const board = await prisma.board.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        },
        boardPersonas: {
          include: {
            persona: true
          }
        },
        conversations: {
          take: 5,
          orderBy: { updatedAt: 'desc' },
          select: {
            id: true,
            title: true,
            context: true,
            createdAt: true,
            updatedAt: true,
            _count: {
              select: { messages: true }
            }
          }
        },
        _count: {
          select: {
            conversations: true
          }
        }
      }
    });

    if (!board) {
      return res.status(404).json({
        success: false,
        message: 'Board not found'
      });
    }

    // Check if user has access to this board
    if (!board.isPublic && board.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this board'
      });
    }

    res.json({
      success: true,
      data: {
        board: {
          ...board,
          personas: board.boardPersonas.map(bp => bp.persona),
          recentConversations: board.conversations,
          conversationCount: board._count.conversations
        }
      }
    });
  } catch (error) {
    console.error('Get board error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching board',
      error: error.message
    });
  }
};

// Create a new board
export const createBoard = async (req, res) => {
  try {
    const { name, description, isPublic = false, personaIds = [] } = req.body;

    // Validate personas exist
    if (personaIds.length > 0) {
      const existingPersonas = await prisma.persona.findMany({
        where: { id: { in: personaIds } },
        select: { id: true }
      });

      if (existingPersonas.length !== personaIds.length) {
        return res.status(400).json({
          success: false,
          message: 'Some personas were not found'
        });
      }
    }

    const board = await prisma.board.create({
      data: {
        name,
        description,
        isPublic,
        userId: req.user.id,
        boardPersonas: {
          create: personaIds.map(personaId => ({
            personaId
          }))
        }
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        },
        boardPersonas: {
          include: {
            persona: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Board created successfully',
      data: {
        board: {
          ...board,
          personas: board.boardPersonas.map(bp => bp.persona)
        }
      }
    });
  } catch (error) {
    console.error('Create board error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating board',
      error: error.message
    });
  }
};

// Update a board
export const updateBoard = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, isPublic, personaIds } = req.body;

    // Check if board exists and user owns it
    const existingBoard = await prisma.board.findUnique({
      where: { id },
      select: { userId: true }
    });

    if (!existingBoard) {
      return res.status(404).json({
        success: false,
        message: 'Board not found'
      });
    }

    if (existingBoard.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied - you can only update your own boards'
      });
    }

    // Prepare update data
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (isPublic !== undefined) updateData.isPublic = isPublic;

    // Update personas if provided
    if (personaIds !== undefined) {
      // Validate personas exist
      if (personaIds.length > 0) {
        const existingPersonas = await prisma.persona.findMany({
          where: { id: { in: personaIds } },
          select: { id: true }
        });

        if (existingPersonas.length !== personaIds.length) {
          return res.status(400).json({
            success: false,
            message: 'Some personas were not found'
          });
        }
      }

      // Remove existing associations and add new ones
      await prisma.boardPersona.deleteMany({
        where: { boardId: id }
      });

      if (personaIds.length > 0) {
        await prisma.boardPersona.createMany({
          data: personaIds.map(personaId => ({
            boardId: id,
            personaId
          }))
        });
      }
    }

    const board = await prisma.board.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        },
        boardPersonas: {
          include: {
            persona: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Board updated successfully',
      data: {
        board: {
          ...board,
          personas: board.boardPersonas.map(bp => bp.persona)
        }
      }
    });
  } catch (error) {
    console.error('Update board error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating board',
      error: error.message
    });
  }
};

// Delete a board
export const deleteBoard = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if board exists and user owns it
    const existingBoard = await prisma.board.findUnique({
      where: { id },
      select: { userId: true }
    });

    if (!existingBoard) {
      return res.status(404).json({
        success: false,
        message: 'Board not found'
      });
    }

    if (existingBoard.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied - you can only delete your own boards'
      });
    }

    // Delete board (cascade will handle related records)
    await prisma.board.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Board deleted successfully'
    });
  } catch (error) {
    console.error('Delete board error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting board',
      error: error.message
    });
  }
};

// Add persona to board
export const addPersonaToBoard = async (req, res) => {
  try {
    const { id } = req.params; // board id
    const { personaId } = req.body;

    // Check if board exists and user owns it
    const board = await prisma.board.findUnique({
      where: { id },
      select: { userId: true }
    });

    if (!board) {
      return res.status(404).json({
        success: false,
        message: 'Board not found'
      });
    }

    if (board.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied - you can only modify your own boards'
      });
    }

    // Check if persona exists
    const persona = await prisma.persona.findUnique({
      where: { id: personaId }
    });

    if (!persona) {
      return res.status(404).json({
        success: false,
        message: 'Persona not found'
      });
    }

    // Add persona to board (will ignore if already exists due to unique constraint)
    await prisma.boardPersona.create({
      data: {
        boardId: id,
        personaId
      }
    });

    res.json({
      success: true,
      message: 'Persona added to board successfully'
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({
        success: false,
        message: 'Persona is already added to this board'
      });
    }

    console.error('Add persona to board error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding persona to board',
      error: error.message
    });
  }
};

// Remove persona from board
export const removePersonaFromBoard = async (req, res) => {
  try {
    const { id, personaId } = req.params; // board id and persona id

    // Check if board exists and user owns it
    const board = await prisma.board.findUnique({
      where: { id },
      select: { userId: true }
    });

    if (!board) {
      return res.status(404).json({
        success: false,
        message: 'Board not found'
      });
    }

    if (board.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied - you can only modify your own boards'
      });
    }

    // Remove persona from board
    const deleted = await prisma.boardPersona.deleteMany({
      where: {
        boardId: id,
        personaId
      }
    });

    if (deleted.count === 0) {
      return res.status(404).json({
        success: false,
        message: 'Persona not found on this board'
      });
    }

    res.json({
      success: true,
      message: 'Persona removed from board successfully'
    });
  } catch (error) {
    console.error('Remove persona from board error:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing persona from board',
      error: error.message
    });
  }
};