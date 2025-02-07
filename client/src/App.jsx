import { useEffect, useContext } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { Outlet } from 'react-router-dom';
import { UserContext } from './context/userProvider';
import axios from 'axios';
import './App.css';

function App() {
  const {  setUser } = useContext(UserContext);

  // Example effect to check user session
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('/api/check-session', {
          withCredentials: true, // Include credentials
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user session:', error);
      }
    };

    fetchUser();
  }, [setUser]);

  return (
    <>
      <Header />
      <main>
      <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default App;