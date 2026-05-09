import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import React from "react";

type UserRole = "personal" | "company";

interface Props {
  children: React.ReactNode;
  role?: UserRole | UserRole[];
}

export default function ProtectedRoute({ children, role }: Props) {
  const { role: userRole } = useAuth();

  // Not logged in
  if (!userRole) {
    return <Navigate to="/login" replace />;
  }

  // If role restriction exists
  if (role) {
    const typedUserRole = userRole as UserRole;

    if (Array.isArray(role)) {
      if (!role.includes(typedUserRole)) {
        return <Navigate to="/" replace />;
      }
    } else {
      if (typedUserRole !== role) {
        return <Navigate to="/" replace />;
      }
    }
  }

  return <>{children}</>;
}