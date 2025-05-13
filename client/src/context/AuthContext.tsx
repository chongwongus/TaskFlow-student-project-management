import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Define types
interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
});

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is logged in when component mounts
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const token = localStorage.getItem('authToken');
      
      if (token) {
        try {
          // In a real app, you would verify this token with your backend
          // For now, we'll simulate by parsing the JWT token
          // In production, NEVER rely on client-side validation alone
          const parseJwt = (token: string) => {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            return JSON.parse(window.atob(base64));
          };
          
          const userData = parseJwt(token);
          
          // Set user data from token
          setUser({
            id: userData.sub,
            name: userData.name,
            email: userData.email,
            picture: userData.picture,
          });
        } catch (err) {
          console.error('Error parsing token:', err);
          localStorage.removeItem('authToken');
          setError('Session expired. Please login again.');
        }
      }
      
      setLoading(false);
    };
    
    checkUserLoggedIn();
  }, []);

  // Login function
  const login = async (token: string) => {
    try {
      localStorage.setItem('authToken', token);
      
      // In a real app, you would verify this token with your backend
      // and get user data from there
      const parseJwt = (token: string) => {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(window.atob(base64));
      };
      
      const userData = parseJwt(token);
      
      setUser({
        id: userData.sub,
        name: userData.name,
        email: userData.email,
        picture: userData.picture,
      });
      
      setError(null);
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to login. Please try again.');
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;