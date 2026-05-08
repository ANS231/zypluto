import React from "react";
import ReactDOM from "react-dom/client";
import AppRoutes from "./routes";
import { AuthProvider } from "./context/AuthContext";

import { HelmetProvider } from "react-helmet-async";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </HelmetProvider>
);