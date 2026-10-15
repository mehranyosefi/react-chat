import { createBrowserRouter } from "react-router";
import AppLayout, { loader as layoutLoader } from "../layouts/AppLayout";
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
    loader: layoutLoader,
    shouldRevalidate: ({ currentUrl, nextUrl,  defaultShouldRevalidate})=>{
      //Prevent from rerendering of AppLayout
      if(currentUrl.pathname.startsWith('/') && nextUrl.pathname.startsWith('/')) return false
      return defaultShouldRevalidate
    },
    errorElement: <Error />,
    children: [
      {
        path: "",
        element: <div />,
        errorElement: <Error />,
      },
      {
        path: "/:contactId",
        element: <Index />,
      }
    ],
  },
  {
    path: '/login',
    lazy: LazyLogin,
    // action
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
