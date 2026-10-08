import { RouterProvider } from "react-router";
import router from "./route";
import { useSocket } from './features/socket/useSocket';

function App() {
  useSocket()
  return <RouterProvider router={router} />;
}

export default App;