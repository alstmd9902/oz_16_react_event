import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Main from "../components/Main";
import usePosts from "../hooks/usePosts";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import PostCreate from "../pages/post/PostCreate";
import PostDetail from "../pages/post/PostDetail";
import Layout from "./Layout";

function Routers() {
  const postsState = usePosts();
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Main posts={postsState.posts} /> },
        {
          path: "post/create",
          element: <PostCreate addPost={postsState.addPost} />
        }, // 게시글 생성
        { path: "post/:id", element: <PostDetail posts={postsState.posts} /> } // 게시글 상세
      ]
    },
    { path: "login", element: <Login /> },
    { path: "signup", element: <Signup /> }
  ]);

  return <RouterProvider router={router} />;
}

export default Routers;
