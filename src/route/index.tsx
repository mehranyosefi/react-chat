import { createBrowserRouter } from "react-router";
import AppLayout, { loader as layoutLoader } from "../layouts/AppLayout";
import Error from "../pages/Error";
import Index from "../pages/Index";
import Test from "../pages/Test";
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
      },
    ],
  },
  {
    path: '/login',
    lazy: LazyLogin,
  },

  /* only for test */
  {
    path: "/test",
    element: <Test />,
  },
]);

export default router;
