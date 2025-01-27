import { createBrowserRouter } from "react-router";
import AppLayout, { loader as layoutLoader } from "../layouts/AppLayout";
import Error from "../pages/Error";
import Index from "../pages/Index";
const LazyLogin = async () => {
  return { Component: (await import("../pages/Login")).default }
}

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    loader: layoutLoader,
    errorElement: <Error />,
    children: [
      {
        path: "",
        element: <div />,
        errorElement: <Error />,
      },
      {
        path: "/:id",
        element: <Index />,
      }
    ],
  },
  {
    path: '/login',
    lazy: LazyLogin,
  }
]);

export default router;
