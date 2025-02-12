import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

export const AuthContext = createContext();
export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);  // For error feedback
    const navigate = useNavigate();

    useEffect(() => {
        // Try to load the user from localStorage on app load
        setLoading(true)
            api.get('/check_session')
                .then(response => {
                    if (response.status === 200 && response.data) {
                        setUser(response.data); // Set user from API
                      
                        
                    } else {
                        setUser(null); // No valid session
                    }
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error checking session:', error);
                    setLoading(false);
                    setUser(null);
                    setError('Failed to check session');
                });
        }
     ,[]);

    const login = async (username, password) => {
        setLoading(true);  // Show loading during login
        try {
            const response = await api.post('/login', { username, password });
            setUser(response.data);
            navigate('/');
        } catch (error) {
            console.error("Login failed", error);
            setError('Invalid username or password');
        } finally {
            setLoading(false);  // Hide loading after login attempt
        }
    };

    const logout = () => {
        api.delete('/logout').then(() => {
            setUser(null);
            navigate('/login');
        }).catch((error) => {
            console.error("Logout failed", error);
            setError('Failed to log out');
        });
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, error, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};