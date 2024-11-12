import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Cart from "./pages/Cart";
import FoodItems from "./pages/FoodItems";
import RootLayout from "./pages/RootLayout";
import FoodItem,{loader as foodLoader} from "./pages/FoodItem";
import ErrorPage from './pages/ErrorPage';
import '../src/styles.css';
function App() {
  const foodRoutes = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      errorElement:<ErrorPage />,
      children: [
        {
          path: "",
          element: <FoodItems />,
        },
        {
          path: ":itemId",
          element: <FoodItem />,
          loader:foodLoader
        },
        { path: "cart", element: <Cart /> },
      ],
    },
  ]);
  return <RouterProvider router={foodRoutes} />;
}

export default App;
