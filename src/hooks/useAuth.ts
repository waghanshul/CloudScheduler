import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  user: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  login: async (email: string, password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Simple validation - in production, use proper authentication
    if (email && password.length >= 6) {
      set({ isAuthenticated: true, user: email });
    } else {
      throw new Error('Invalid credentials');
    }
  },
  logout: () => set({ isAuthenticated: false, user: null }),
}));
