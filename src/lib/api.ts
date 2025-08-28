// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://3001-ibkskguc3ers5m0pqjc82-6532622b.e2b.dev/api';

// Types
export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  isAdmin?: boolean;
  createdAt: string;
}

export interface Persona {
  id: string;
  name: string;
  role: string;
  expertise: string[];
  mindset: string;
  personality: string;
  description: string;
  avatar?: string;
  isPreset: boolean;
  userId?: string | null;
  createdAt: string;
}

export interface Board {
  id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  user: User;
  personas: Persona[];
  conversationCount?: number;
  recentConversations?: Conversation[];
}

export interface Conversation {
  id: string;
  title: string;
  context?: string;
  createdAt: string;
  updatedAt: string;
  board: Board;
  user: User;
  messages?: Message[];
  messageCount?: number;
  lastMessage?: Message;
}

export interface Message {
  id: string;
  content: string;
  type: 'USER' | 'PERSONA' | 'SYSTEM';
  personaId?: string;
  createdAt: string;
  updatedAt: string;
}

// Server-returned message shape (used when fetching conversation messages)
export interface ServerMessage {
  id: string;
  content: string;
  type: 'USER' | 'PERSONA' | 'SYSTEM';
  persona?: {
    id: string;
    name: string;
    avatar?: string;
  } | null;
  createdAt: string;
}

export interface ConversationSummary {
  conversationId: string;
  conversationTitle: string;
  boardName: string;
  date: string;
  participants: string[];
  messageCount: number;
  summary: string;
  format: 'detailed' | 'executive';
  generatedAt: string;
  usedBoardFallback?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: unknown[];
}

// API Client Class
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('auth_token');
  }

  private getHeaders(): Headers {
    const headers = new Headers({
      'Content-Type': 'application/json',
    });

    if (this.token) {
      headers.set('Authorization', `Bearer ${this.token}`);
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data: ApiResponse<T> = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  // Auth endpoints
  async register(data: {
    email: string;
    username: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) {
    const response = await this.request<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async login(data: { email: string; password: string }) {
    const response = await this.request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async getProfile() {
    return this.request<{ user: User }>('/auth/profile');
  }

  async updateProfile(data: {
    firstName?: string;
    lastName?: string;
    avatar?: string;
  }) {
    return this.request<{ user: User }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  logout() {
    this.setToken(null);
  }

  // Persona endpoints
  async getPersonas() {
    return this.request<{ personas: Persona[] }>('/personas');
  }

  async getPersona(id: string) {
    return this.request<{ persona: Persona }>(`/personas/${id}`);
  }

  async createPersona(data: {
    name: string;
    role: string;
    expertise: string[];
    mindset: string;
    personality: string;
    description: string;
    avatar?: string;
  }) {
    return this.request<{ persona: Persona }>('/personas', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePersona(id: string, data: Partial<{
    name: string;
    role: string;
    expertise: string[];
    mindset: string;
    personality: string;
    description: string;
    avatar?: string;
  }>) {
    return this.request<{ persona: Persona }>(`/personas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePersona(id: string) {
    return this.request(`/personas/${id}`, {
      method: 'DELETE',
    });
  }

  // Board endpoints
  async getBoards(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.search) searchParams.set('search', params.search);

    const query = searchParams.toString();
    const endpoint = query ? `/boards?${query}` : '/boards';
    
    return this.request<{
      boards: Board[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    }>(endpoint);
  }

  async getBoard(id: string) {
    return this.request<{ board: Board }>(`/boards/${id}`);
  }

  async createBoard(data: {
    name: string;
    description?: string;
    isPublic?: boolean;
    personaIds?: string[];
  }) {
    return this.request<{ board: Board }>('/boards', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBoard(id: string, data: Partial<{
    name: string;
    description?: string;
    isPublic: boolean;
    personaIds?: string[];
  }>) {
    return this.request<{ board: Board }>(`/boards/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteBoard(id: string) {
    return this.request(`/boards/${id}`, {
      method: 'DELETE',
    });
  }

  async addPersonaToBoard(boardId: string, personaId: string) {
    return this.request(`/boards/${boardId}/personas`, {
      method: 'POST',
      body: JSON.stringify({ personaId }),
    });
  }

  async removePersonaFromBoard(boardId: string, personaId: string) {
    return this.request(`/boards/${boardId}/personas/${personaId}`, {
      method: 'DELETE',
    });
  }

  // Conversation endpoints
  async getConversations(params?: {
    page?: number;
    limit?: number;
    boardId?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.boardId) searchParams.set('boardId', params.boardId);

    const query = searchParams.toString();
    const endpoint = query ? `/conversations?${query}` : '/conversations';
    
    return this.request<{
      conversations: Conversation[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    }>(endpoint);
  }

  async getConversation(id: string, params?: {
    messageLimit?: number;
    messageOffset?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.messageLimit) searchParams.set('messageLimit', params.messageLimit.toString());
    if (params?.messageOffset) searchParams.set('messageOffset', params.messageOffset.toString());

    const query = searchParams.toString();
    const endpoint = query ? `/conversations/${id}?${query}` : `/conversations/${id}`;
    
    return this.request<{ conversation: Conversation }>(endpoint);
  }

  async createConversation(data: {
    title: string;
    context?: string;
    boardId: string;
  }) {
    return this.request<{ conversation: Conversation }>('/conversations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateConversation(id: string, data: Partial<{
    title: string;
    context?: string;
  }>) {
    return this.request<{ conversation: Conversation }>(`/conversations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteConversation(id: string) {
    return this.request(`/conversations/${id}`, {
      method: 'DELETE',
    });
  }

  // Message endpoints
  async getMessages(conversationId: string, params?: {
    limit?: number;
    offset?: number;
    before?: string;
    after?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.offset) searchParams.set('offset', params.offset.toString());
    if (params?.before) searchParams.set('before', params.before);
    if (params?.after) searchParams.set('after', params.after);

    const query = searchParams.toString();
    const endpoint = query ? `/conversations/${conversationId}/messages?${query}` : `/conversations/${conversationId}/messages`;
    
    return this.request<{
      messages: Message[];
      pagination: {
        offset: number;
        limit: number;
        total: number;
        hasMore: boolean;
      };
    }>(endpoint);
  }

  async addMessage(conversationId: string, data: {
    content: string;
    type?: 'USER' | 'PERSONA' | 'SYSTEM';
    personaId?: string;
  }) {
    return this.request<{ message: Message }>(`/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteMessage(conversationId: string, messageId: string) {
    return this.request(`/conversations/${conversationId}/messages/${messageId}`, {
      method: 'DELETE',
    });
  }

  // Generate AI response
  async generateAIResponse(boardId: string, data: {
    message: string;
    conversationId?: string;
    selectedPersonaIds?: string[];
  }) {
    return this.request<{
      responses: Array<{
        personaId: string;
        personaName: string;
        response: string;
      }>;
      conversationId?: string;
    }>(`/conversations/board/${boardId}/ai-response`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Generate conversation summary
  async generateConversationSummary(conversationId: string, format: 'detailed' | 'executive' = 'detailed') {
    return this.request<{ data: ConversationSummary }>(`/conversations/${conversationId}/summary`, {
      method: 'POST',
      body: JSON.stringify({ format }),
    });
  }

  // Generate board summary
  async generateBoardSummary(boardId: string, format: 'detailed' | 'executive' = 'detailed') {
    return this.request<{ data: ConversationSummary }>(`/conversations/board/${boardId}/summary`, {
      method: 'POST',
      body: JSON.stringify({ format }),
    });
  }

  // Health check
  async healthCheck() {
    return this.request<{ success: boolean; message?: string }>('/health');
  }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL);

// Convenience functions
export const auth = {
  register: (data: Parameters<typeof apiClient.register>[0]) => apiClient.register(data),
  login: (data: Parameters<typeof apiClient.login>[0]) => apiClient.login(data),
  logout: () => apiClient.logout(),
  getProfile: () => apiClient.getProfile(),
  updateProfile: (data: Parameters<typeof apiClient.updateProfile>[0]) => apiClient.updateProfile(data),
  setToken: (token: string | null) => apiClient.setToken(token),
};

export const personas = {
  getAll: () => apiClient.getPersonas(),
  get: (id: string) => apiClient.getPersona(id),
  create: (data: Parameters<typeof apiClient.createPersona>[0]) => apiClient.createPersona(data),
  update: (id: string, data: Parameters<typeof apiClient.updatePersona>[1]) => apiClient.updatePersona(id, data),
  delete: (id: string) => apiClient.deletePersona(id),
};

export const boards = {
  getAll: (params?: Parameters<typeof apiClient.getBoards>[0]) => apiClient.getBoards(params),
  get: (id: string) => apiClient.getBoard(id),
  create: (data: Parameters<typeof apiClient.createBoard>[0]) => apiClient.createBoard(data),
  update: (id: string, data: Parameters<typeof apiClient.updateBoard>[1]) => apiClient.updateBoard(id, data),
  delete: (id: string) => apiClient.deleteBoard(id),
  addPersona: (boardId: string, personaId: string) => apiClient.addPersonaToBoard(boardId, personaId),
  removePersona: (boardId: string, personaId: string) => apiClient.removePersonaFromBoard(boardId, personaId),
};

export const conversations = {
  getAll: (params?: Parameters<typeof apiClient.getConversations>[0]) => apiClient.getConversations(params),
  get: (id: string, params?: Parameters<typeof apiClient.getConversation>[1]) => apiClient.getConversation(id, params),
  create: (data: Parameters<typeof apiClient.createConversation>[0]) => apiClient.createConversation(data),
  update: (id: string, data: Parameters<typeof apiClient.updateConversation>[1]) => apiClient.updateConversation(id, data),
  delete: (id: string) => apiClient.deleteConversation(id),
};

export const messages = {
  getAll: (conversationId: string, params?: Parameters<typeof apiClient.getMessages>[1]) => 
    apiClient.getMessages(conversationId, params),
  add: (conversationId: string, data: Parameters<typeof apiClient.addMessage>[1]) => 
    apiClient.addMessage(conversationId, data),
  delete: (conversationId: string, messageId: string) => 
    apiClient.deleteMessage(conversationId, messageId),
};

export const ai = {
  generateResponse: (boardId: string, data: Parameters<typeof apiClient.generateAIResponse>[1]) =>
    apiClient.generateAIResponse(boardId, data),
  generateSummary: (conversationId: string, format?: 'detailed' | 'executive') =>
    apiClient.generateConversationSummary(conversationId, format),
  generateBoardSummary: (boardId: string, format?: 'detailed' | 'executive') =>
    apiClient.generateBoardSummary(boardId, format),
};