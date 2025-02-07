// import {  useContext} from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { Outlet } from 'react-router-dom';
// import { UserContext } from './context/userProvider';
// import './App.css'

function App() {
  // const { user, setUser } = useContext(UserContext);

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
