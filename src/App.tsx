import { Provider } from 'react-redux';
import { RouterProvider } from "react-router";
import router from "./route";
import { store } from "./store";

function App() {
  return <Provider store={store}>
    <RouterProvider router={router}></RouterProvider>
  </Provider>
}

export default App;