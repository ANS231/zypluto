import { createContext, useContext, useState } from "react";

interface User {
  username: string;
  profile_image: string;
}

interface AuthContextType {
  token: string | null;
  role: string | null;
  status: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (
    token: string | null,
    role: string,
    status: string,
    user?: User
  ) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: any) => {

  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const [role, setRole] = useState<string | null>(
    localStorage.getItem("role")
  );

  const [status, setStatus] = useState<string | null>(
    localStorage.getItem("status")
  );

  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (
    token: string | null,
    role: string,
    status: string,
    user?: User
  ) => {

    if (token) {
      localStorage.setItem("token", token);
      setToken(token);
    }

    localStorage.setItem("role", role);
    localStorage.setItem("status", status);

    setRole(role);
    setStatus(status);

    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
    }
  };

  const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("status");
    localStorage.removeItem("user");

    setToken(null);
    setRole(null);
    setStatus(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        status,
        user,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);