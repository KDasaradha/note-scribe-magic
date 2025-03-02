
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock authentication function (would be replaced with real auth in a production app)
const mockAuth = {
  login: async (email: string, password: string): Promise<User> => {
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this would validate credentials against a backend
    if (email && password && email.includes("@")) {
      const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
      const user = storedUsers.find((u: any) => u.email === email);
      
      if (user && user.password === password) {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }
      throw new Error("Invalid credentials");
    }
    throw new Error("Invalid email or password");
  },
  
  signup: async (email: string, password: string, name: string): Promise<User> => {
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Validate input
    if (!email || !password || !name) {
      throw new Error("All fields are required");
    }
    
    if (!email.includes("@")) {
      throw new Error("Invalid email format");
    }
    
    // In a real app, this would create a user in a database
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    
    // Check if user already exists
    if (storedUsers.some((user: any) => user.email === email)) {
      throw new Error("User already exists");
    }
    
    // Create new user
    const newUser = {
      id: `user-${Date.now()}`,
      email,
      password, // In a real app, this would be hashed
      name,
    };
    
    // Save to localStorage (in a real app, this would be in a database)
    localStorage.setItem("users", JSON.stringify([...storedUsers, newUser]));
    
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },
  
  getCurrentUser: (): User | null => {
    const userJSON = localStorage.getItem("currentUser");
    return userJSON ? JSON.parse(userJSON) : null;
  },
  
  saveCurrentUser: (user: User) => {
    localStorage.setItem("currentUser", JSON.stringify(user));
  },
  
  removeCurrentUser: () => {
    localStorage.removeItem("currentUser");
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is already logged in
    const initAuth = async () => {
      try {
        const currentUser = mockAuth.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error("Authentication initialization failed:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initAuth();
  }, []);
  
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const authenticatedUser = await mockAuth.login(email, password);
      setUser(authenticatedUser);
      mockAuth.saveCurrentUser(authenticatedUser);
      toast.success("Logged in successfully");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(error instanceof Error ? error.message : "Login failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const newUser = await mockAuth.signup(email, password, name);
      setUser(newUser);
      mockAuth.saveCurrentUser(newUser);
      toast.success("Account created successfully");
    } catch (error) {
      console.error("Signup failed:", error);
      toast.error(error instanceof Error ? error.message : "Signup failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    setUser(null);
    mockAuth.removeCurrentUser();
    toast.success("Logged out successfully");
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
