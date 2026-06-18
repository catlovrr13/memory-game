import { createBrowserRouter } from "react-router";
import App from "../App";
import Register from "../pages/Register";
import Login from "../pages/Login";
import MemoryGame from "../pages/MemoryGame";

export const routes = createBrowserRouter([
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <MemoryGame />,
        index: true,
      },
    ],
  },
]);
