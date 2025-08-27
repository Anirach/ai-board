import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { personas, Persona } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

// Query hook for fetching all personas
export const usePersonas = () => {
  return useQuery({
    queryKey: ['personas'],
    queryFn: async () => {
      const response = await personas.getAll();
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch personas');
      }
      return response.data.personas;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Query hook for fetching a single persona
export const usePersona = (id: string) => {
  return useQuery({
    queryKey: ['personas', id],
    queryFn: async () => {
      const response = await personas.get(id);
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch persona');
      }
      return response.data.persona;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Mutation hook for creating a persona
export const useCreatePersona = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      role: string;
      expertise: string[];
      mindset: string;
      personality: string;
      description: string;
      avatar?: string;
    }) => {
      const response = await personas.create(data);
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to create persona');
      }
      return response.data.persona;
    },
    onSuccess: (persona) => {
      queryClient.invalidateQueries({ queryKey: ['personas'] });
      toast({
        title: "Persona Created",
        description: `${persona.name} has been created successfully`,
      });
    },
    onError: (error) => {
      console.error('Create persona error:', error);
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create persona",
        variant: "destructive",
      });
    },
  });
};

// Mutation hook for updating a persona
export const useUpdatePersona = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: {
      id: string;
      data: Partial<{
        name: string;
        role: string;
        expertise: string[];
        mindset: string;
        personality: string;
        description: string;
        avatar?: string;
      }>;
    }) => {
      const response = await personas.update(id, data);
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to update persona');
      }
      return response.data.persona;
    },
    onSuccess: (persona) => {
      queryClient.invalidateQueries({ queryKey: ['personas'] });
      queryClient.invalidateQueries({ queryKey: ['personas', persona.id] });
      toast({
        title: "Persona Updated",
        description: `${persona.name} has been updated successfully`,
      });
    },
    onError: (error) => {
      console.error('Update persona error:', error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update persona",
        variant: "destructive",
      });
    },
  });
};

// Mutation hook for deleting a persona
export const useDeletePersona = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await personas.delete(id);
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete persona');
      }
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personas'] });
      toast({
        title: "Persona Deleted",
        description: "The persona has been deleted successfully",
      });
    },
    onError: (error) => {
      console.error('Delete persona error:', error);
      toast({
        title: "Deletion Failed",
        description: error.message || "Failed to delete persona",
        variant: "destructive",
      });
    },
  });
};

// Custom hook for managing persona selection state
export const usePersonaSelection = (maxSelections: number = 8) => {
  const [selectedPersonaIds, setSelectedPersonaIds] = useState<string[]>([]);

  const togglePersona = (personaId: string) => {
    setSelectedPersonaIds(prev => {
      if (prev.includes(personaId)) {
        return prev.filter(id => id !== personaId);
      } else if (prev.length < maxSelections) {
        return [...prev, personaId];
      } else {
        return prev; // Don't add if at max
      }
    });
  };

  const removePersona = (personaId: string) => {
    setSelectedPersonaIds(prev => prev.filter(id => id !== personaId));
  };

  const clearSelection = () => {
    setSelectedPersonaIds([]);
  };

  const isSelected = (personaId: string) => selectedPersonaIds.includes(personaId);
  const canAddMore = selectedPersonaIds.length < maxSelections;
  const selectionCount = selectedPersonaIds.length;

  return {
    selectedPersonaIds,
    togglePersona,
    removePersona,
    clearSelection,
    isSelected,
    canAddMore,
    selectionCount,
    maxSelections,
  };
};