import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, auth, ApiResponse } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: UpdateProfileData) => Promise<boolean>;
  refreshProfile: () => Promise<void>;
}

interface RegisterData {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const isAuthenticated = !!user;

  // Check for existing token and fetch user profile on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          auth.setToken(token);
          const response = await auth.getProfile();
          if (response.success && response.data) {
            setUser(response.data.user);
          } else {
            // Invalid token, clear it
            auth.logout();
          }
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          auth.logout();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await auth.login({ email, password });
      
      if (response.success && response.data) {
        setUser(response.data.user);
        toast({
          title: "Login Successful",
          description: `Welcome back, ${response.data.user.username}!`,
        });
        return true;
      } else {
        toast({
          title: "Login Failed",
          description: response.message || "Invalid credentials",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Error",
        description: "An error occurred during login. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await auth.register(data);
      
      if (response.success && response.data) {
        setUser(response.data.user);
        toast({
          title: "Registration Successful",
          description: `Welcome to AI Boardroom, ${response.data.user.username}!`,
        });
        return true;
      } else {
        toast({
          title: "Registration Failed",
          description: response.message || "Failed to create account",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Error",
        description: "An error occurred during registration. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    auth.logout();
    setUser(null);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const updateProfile = async (data: UpdateProfileData): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await auth.updateProfile(data);
      
      if (response.success && response.data) {
        setUser(response.data.user);
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully.",
        });
        return true;
      } else {
        toast({
          title: "Update Failed",
          description: response.message || "Failed to update profile",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        title: "Update Error",
        description: "An error occurred while updating your profile.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProfile = async () => {
    try {
      const response = await auth.getProfile();
      if (response.success && response.data) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Failed to refresh profile:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};