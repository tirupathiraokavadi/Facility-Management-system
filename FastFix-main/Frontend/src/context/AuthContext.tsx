import axios from 'axios';
import { useState, useEffect, useContext, createContext, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  phone: string;
  skills?: string[];
  experience?: string;
  hourlyRate?: number;
  responseTime?: string;
}

interface AuthContextType {
  user: User | null;
  registerWorker: (
    email: string,
    password: string,
    name: string,
    phone: string,
    skills: string[],
    experience: string,
    responseTime: string,
    hourlyRate: number
  ) => Promise<void>;
  registerCustomer: (
    email: string,
    password: string,
    name: string,
    phone: string
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => Promise<void>;
  getUserProfile: () => Promise<User | null>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  registerWorker: async () => {},
  registerCustomer: async () => {},
  login: async () => {},
  logout: () => {},
  updateUser: async () => {},
  getUserProfile: async () => null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      const normalizedUser = {
        ...parsedUser,
        id: parsedUser._id || parsedUser.id,
      };
      setUser(normalizedUser);
    }
  }, []);

  const persistSession = (userData: any, token: string) => {
    const normalizedUser: User = {
      ...userData,
      id: userData._id || userData.id,
    };
    setUser(normalizedUser);
    sessionStorage.setItem('user', JSON.stringify(normalizedUser));
    sessionStorage.setItem('token', token);
  };

  const registerWorker = async (
    email: string,
    password: string,
    name: string,
    phone: string,
    skills: string[],
    experience: string,
    responseTime: string,
    hourlyRate: number
  ) => {
    try {
      const res = await axios.post('https://fastfix-0sal.onrender.com/api/auth/register/worker', {
        email, password, name, phone, skills, experience, responseTime, hourlyRate
      });
      persistSession(res.data.user, res.data.token);
    } catch (error) {
      console.error('Worker registration failed', error);
      throw new Error('Worker registration failed. Please try again.');
    }
  };

  const registerCustomer = async (
    email: string,
    password: string,
    name: string,
    phone: string
  ) => {
    try {
      const res = await axios.post('https://fastfix-0sal.onrender.com/api/auth/register', {
        email, password, name, phone
      });
      persistSession(res.data.user, res.data.token);
    } catch (error) {
      console.error('Customer registration failed', error);
      throw new Error('Customer registration failed. Please try again.');
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post('https://fastfix-0sal.onrender.com/api/auth/login', { email, password });
      persistSession(res.data.user, res.data.token);
    } catch (error) {
      console.error('Login failed', error);
      throw new Error('Login failed. Please try again.');
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.clear();
  };

  const updateUser = async (data: Partial<User>) => {
    try {
      if (!user?.id) throw new Error('No user ID available.');

      const res = await axios.put('https://fastfix-0sal.onrender.com/api/auth/update', {
        id: user.id,
        ...data,
      });

      const updatedUser = {
        ...res.data,
        id: res.data._id || res.data.id,
      };

      setUser(updatedUser);
      sessionStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Failed to update user:', error);
      throw new Error('Failed to update profile.');
    }
  };

  const getUserProfile = async () => {
    try {
      const storedUser = sessionStorage.getItem('user');
      if (!storedUser) return null;

      const parsedUser = JSON.parse(storedUser);
      const res = await axios.get(`https://fastfix-0sal.onrender.com/api/users/profile/${parsedUser.id}`);

      const updatedUser = {
        ...res.data,
        id: res.data._id || res.data.id,
      };

      setUser(updatedUser);
      sessionStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      return null;
    }
  };
  return (
    <AuthContext.Provider value={{ user, registerWorker, registerCustomer, login, logout, updateUser, getUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
