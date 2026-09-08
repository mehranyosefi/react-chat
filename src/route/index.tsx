import { createBrowserRouter } from "react-router";
import AppLayout from "../layouts/AppLayout";
import Error from "../pages/Error";
import Index from "../pages/Index";
import Test from "../pages/Test";
const LazyLogin = async () => {
  return { Component: (await import("../pages/Login")).default }
}
const LazySignUp = async () => {
  return { Component: (await import("../pages/SignUp")).default }
}

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      {
        path: "",
        element: <div />,
        errorElement: <Error />,
      },
      {
        path: "/:username",
        element: <Index />,
      },
    ],
  },
  {
    path: '/login',
    lazy: LazyLogin,
  },
  {
    path: '/signup',
    lazy: LazySignUp,
  },

  /* only for test */
  {
    path: "/test",
    element: <Test />,
  },
]);

export default router;
