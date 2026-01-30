import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "./Layout";
import Main from "../components/Main";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";

function Routers() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [{ index: true, element: <Main /> }]
    },
    { path: "login", element: <Login /> },
    { path: "signup", element: <Signup /> }
  ]);

  return <RouterProvider router={router} />;
}

export default Routers;
