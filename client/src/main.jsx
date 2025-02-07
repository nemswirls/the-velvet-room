import  { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { UserProvider } from './context/userProvider';
import 'bootstrap/dist/css/bootstrap.min.css';
import { createHashRouter, RouterProvider } from 'react-router-dom'; // Import HashRouter
import routes from './routes'; 
import { WindowWidthProvider } from './context/windowSize';

// Create the hash-based router
const router = createHashRouter(routes);

// Create the root and render the app with the router
ReactDOM.createRoot(document.getElementById('root')).render(

  <StrictMode>
    <WindowWidthProvider>
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
    </WindowWidthProvider>
  </StrictMode>
);