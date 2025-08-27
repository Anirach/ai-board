import prisma from '../config/database.js';

export const getAllPersonas = async (req, res) => {
  try {
    const personas = await prisma.persona.findMany({
      where: { isPreset: true },
      select: {
        id: true,
        name: true,
        role: true,
        expertise: true,
        mindset: true,
        personality: true,
        description: true,
        avatar: true,
        isPreset: true,
        createdAt: true
      },
      orderBy: { name: 'asc' }
    });

    // Parse expertise JSON string to array
    const formattedPersonas = personas.map(persona => ({
      ...persona,
      expertise: JSON.parse(persona.expertise)
    }));

    res.json({
      success: true,
      data: { personas: formattedPersonas }
    });
  } catch (error) {
    console.error('Get personas error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

export const getPersonaById = async (req, res) => {
  try {
    const { id } = req.params;

    const persona = await prisma.persona.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        role: true,
        expertise: true,
        mindset: true,
        personality: true,
        description: true,
        avatar: true,
        isPreset: true,
        createdAt: true
      }
    });

    if (!persona) {
      return res.status(404).json({
        success: false,
        message: 'Persona not found'
      });
    }

    // Parse expertise JSON string to array
    const formattedPersona = {
      ...persona,
      expertise: JSON.parse(persona.expertise)
    };

    res.json({
      success: true,
      data: { persona: formattedPersona }
    });
  } catch (error) {
    console.error('Get persona error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

export const createPersona = async (req, res) => {
  try {
    const { name, role, expertise, mindset, personality, description, avatar } = req.body;

    // Check if persona name already exists
    const existingPersona = await prisma.persona.findUnique({
      where: { name }
    });

    if (existingPersona) {
      return res.status(400).json({
        success: false,
        message: 'A persona with this name already exists'
      });
    }

    const persona = await prisma.persona.create({
      data: {
        name,
        role,
        expertise: JSON.stringify(expertise),
        mindset,
        personality,
        description,
        avatar: avatar || null,
        isPreset: false // Custom personas are not presets
      },
      select: {
        id: true,
        name: true,
        role: true,
        expertise: true,
        mindset: true,
        personality: true,
        description: true,
        avatar: true,
        isPreset: true,
        createdAt: true
      }
    });

    // Parse expertise JSON string to array
    const formattedPersona = {
      ...persona,
      expertise: JSON.parse(persona.expertise)
    };

    res.status(201).json({
      success: true,
      message: 'Persona created successfully',
      data: { persona: formattedPersona }
    });
  } catch (error) {
    console.error('Create persona error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

export const updatePersona = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, expertise, mindset, personality, description, avatar } = req.body;

    // Check if persona exists
    const existingPersona = await prisma.persona.findUnique({
      where: { id }
    });

    if (!existingPersona) {
      return res.status(404).json({
        success: false,
        message: 'Persona not found'
      });
    }

    // Only admins can update preset personas
    if (existingPersona.isPreset && !(req.user && req.user.isAdmin)) {
      return res.status(403).json({
        success: false,
        message: 'Cannot modify preset personas'
      });
    }

    // Check if new name conflicts with existing persona (excluding current one)
    if (name && name !== existingPersona.name) {
      const nameConflict = await prisma.persona.findFirst({
        where: {
          name,
          id: { not: id }
        }
      });

      if (nameConflict) {
        return res.status(400).json({
          success: false,
          message: 'A persona with this name already exists'
        });
      }
    }

    const persona = await prisma.persona.update({
      where: { id },
      data: {
        name: name || existingPersona.name,
        role: role || existingPersona.role,
        expertise: expertise ? JSON.stringify(expertise) : existingPersona.expertise,
        mindset: mindset || existingPersona.mindset,
        personality: personality || existingPersona.personality,
        description: description || existingPersona.description,
        avatar: avatar !== undefined ? avatar : existingPersona.avatar,
      },
      select: {
        id: true,
        name: true,
        role: true,
        expertise: true,
        mindset: true,
        personality: true,
        description: true,
        avatar: true,
        isPreset: true,
        updatedAt: true
      }
    });

    // Parse expertise JSON string to array
    const formattedPersona = {
      ...persona,
      expertise: JSON.parse(persona.expertise)
    };

    res.json({
      success: true,
      message: 'Persona updated successfully',
      data: { persona: formattedPersona }
    });
  } catch (error) {
    console.error('Update persona error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

export const deletePersona = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if persona exists
    const existingPersona = await prisma.persona.findUnique({
      where: { id }
    });

    if (!existingPersona) {
      return res.status(404).json({
        success: false,
        message: 'Persona not found'
      });
    }

    // Don't allow deleting preset personas
    if (existingPersona.isPreset) {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete preset personas'
      });
    }

    await prisma.persona.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Persona deleted successfully'
    });
  } catch (error) {
    console.error('Delete persona error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};