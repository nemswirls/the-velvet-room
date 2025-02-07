import { useEffect, useContext} from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { Outlet } from 'react-router-dom';
import { UserContext } from './context/userProvider';
import axios from 'axios';
// import './App.css'

function App() {
  const { user, setUser } = useContext(UserContext);


  useEffect(() => {
    // Auto-login with Axios
    axios
      .get('/check_session', { withCredentials: true })
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error('Session check failed:', error);
      });
  }, []);
  return (
    <>
    <Header/>
      <Outlet
          context={{
           
          }}
        />
    <Footer />
  </>
);
}

export default App
