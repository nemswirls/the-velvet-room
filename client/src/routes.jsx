import App from "./App";
import Home from "./pages/Home";
import ErrorPage from "./pages/ErrorPage";
import Login from './pages/Login';
import Profile from './pages/Profile';
import Summon from './pages/Summon'
import Stock from './pages/Stock';
import Fusion from './pages/Fusion';
import Compendium from './pages/Compendium'
import WildcardSelection from './pages/WildcardSelection'
const routes = [
 {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "summon",
        element: <Summon />,
      },
      {
        path: "stock",
        element: <Stock />,
      },
      {
        path: "fusion",
        element: <Fusion />,
      },
      {
        path: "compendium",
        element: <Compendium />,
      },
      {
        path: "/choose-wildcard",
        element: <WildcardSelection />,
      }
    ],
   },
]


export default routes;