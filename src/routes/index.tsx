import { createBrowserRouter } from "react-router-dom"

import MainLayout from "@/layouts/MainLayout"
import Home from "@/pages/Home"

export const router: ReturnType<typeof createBrowserRouter> = createBrowserRouter(
  [
    {
      path: "/",
      element: <MainLayout />,
      children: [
        { index: true, element: <Home /> },
        { path: "*", element: <h1>404 (router)</h1> }
      ]
    }
  ],
  {
    basename: import.meta.env.BASE_URL
  }
)