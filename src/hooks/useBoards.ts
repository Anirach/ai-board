import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { boards, Board } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

// Query hook for fetching all boards
export const useBoards = (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: ['boards', params],
    queryFn: async () => {
      const response = await boards.getAll(params);
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch boards');
      }
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Query hook for fetching a single board
export const useBoard = (id: string) => {
  return useQuery({
    queryKey: ['boards', id],
    queryFn: async () => {
      const response = await boards.get(id);
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch board');
      }
      return response.data.board;
    },
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });
};

// Mutation hook for creating a board
export const useCreateBoard = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      description?: string;
      isPublic?: boolean;
      personaIds?: string[];
    }) => {
      const response = await boards.create(data);
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to create board');
      }
      return response.data.board;
    },
    onSuccess: (board) => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
      toast({
        title: "Board Created",
        description: `${board.name} has been created successfully`,
      });
    },
    onError: (error) => {
      console.error('Create board error:', error);
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create board",
        variant: "destructive",
      });
    },
  });
};

// Mutation hook for updating a board
export const useUpdateBoard = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: {
      id: string;
      data: Partial<{
        name: string;
        description?: string;
        isPublic: boolean;
        personaIds?: string[];
      }>;
    }) => {
      const response = await boards.update(id, data);
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to update board');
      }
      return response.data.board;
    },
    onSuccess: (board) => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
      queryClient.invalidateQueries({ queryKey: ['boards', board.id] });
      toast({
        title: "Board Updated",
        description: `${board.name} has been updated successfully`,
      });
    },
    onError: (error) => {
      console.error('Update board error:', error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update board",
        variant: "destructive",
      });
    },
  });
};

// Mutation hook for deleting a board
export const useDeleteBoard = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await boards.delete(id);
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete board');
      }
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
      toast({
        title: "Board Deleted",
        description: "The board has been deleted successfully",
      });
    },
    onError: (error) => {
      console.error('Delete board error:', error);
      toast({
        title: "Deletion Failed",
        description: error.message || "Failed to delete board",
        variant: "destructive",
      });
    },
  });
};

// Mutation hook for adding persona to board
export const useAddPersonaToBoard = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ boardId, personaId }: {
      boardId: string;
      personaId: string;
    }) => {
      const response = await boards.addPersona(boardId, personaId);
      if (!response.success) {
        throw new Error(response.message || 'Failed to add persona to board');
      }
      return { boardId, personaId };
    },
    onSuccess: ({ boardId }) => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
      queryClient.invalidateQueries({ queryKey: ['boards', boardId] });
      toast({
        title: "Persona Added",
        description: "The persona has been added to the board successfully",
      });
    },
    onError: (error) => {
      console.error('Add persona to board error:', error);
      toast({
        title: "Addition Failed",
        description: error.message || "Failed to add persona to board",
        variant: "destructive",
      });
    },
  });
};

// Mutation hook for removing persona from board
export const useRemovePersonaFromBoard = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ boardId, personaId }: {
      boardId: string;
      personaId: string;
    }) => {
      const response = await boards.removePersona(boardId, personaId);
      if (!response.success) {
        throw new Error(response.message || 'Failed to remove persona from board');
      }
      return { boardId, personaId };
    },
    onSuccess: ({ boardId }) => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
      queryClient.invalidateQueries({ queryKey: ['boards', boardId] });
      toast({
        title: "Persona Removed",
        description: "The persona has been removed from the board successfully",
      });
    },
    onError: (error) => {
      console.error('Remove persona from board error:', error);
      toast({
        title: "Removal Failed",
        description: error.message || "Failed to remove persona from board",
        variant: "destructive",
      });
    },
  });
};