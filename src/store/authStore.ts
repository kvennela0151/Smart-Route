import { create } from 'zustand';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL:', supabaseUrl);
  console.error('Supabase Anon Key:', supabaseAnonKey);
  throw new Error(
    'Missing Supabase environment variables. Please connect to Supabase using the "Connect to Supabase" button in the top right.'
  );
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      set({ 
        isAuthenticated: true, 
        user: data.user, 
        loading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message, 
        loading: false 
      });
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      await supabase.auth.signOut();
      set({ 
        isAuthenticated: false, 
        user: null, 
        loading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message, 
        loading: false 
      });
    }
  },

  signup: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      set({ 
        isAuthenticated: true, 
        user: data.user, 
        loading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message, 
        loading: false 
      });
    }
  },
}));