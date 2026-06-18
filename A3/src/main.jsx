import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { RouterProvider } from "react-router";
import { routes } from "./routes/routes.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ThemeProvider } from "../components/theme-provider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <RouterProvider router={routes} />
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>,
);
