import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Stock from './pages/Stock';
import Fusion from './pages/Fusion';
import Summon from './pages/Summon';
import Compendium from './pages/Compendium';
import WildcardSelection from './pages/WildcardSelection';
import UpdatePlayerProfile from './pages/UpdatePlayerProfile';
import Footer from './components/Footer';
import Header from './components/Header';
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

function AppRoutes() {
  const location = useLocation();

  // Check if the current page is not Login or WildcardSelection
  const showHeaderFooter = !['/login', '/choose-wildcard'].includes(location.pathname);

  return (
    <>
      {/* Conditionally render Header */}
      {showHeaderFooter && <Header />}
      
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/choose-wildcard" element={<WildcardSelection />} />
        
        {/* Protected routes */}
        <Route path="/" element={<ProtectedRoute element={<Home />} />} />
        <Route path="/stock" element={<ProtectedRoute element={<Stock />} />} />
        <Route path="/fusion" element={<ProtectedRoute element={<Fusion />} />} />
        <Route path="/summon" element={<ProtectedRoute element={<Summon />} />} />
        <Route path="/compendium" element={<ProtectedRoute element={<Compendium />} />} />
        <Route path="/update-profile" element={<ProtectedRoute element={<UpdatePlayerProfile />} />} />
      </Routes>

      {/* Conditionally render Footer */}
      {showHeaderFooter && <Footer />}
    </>
  );
}

export default App;