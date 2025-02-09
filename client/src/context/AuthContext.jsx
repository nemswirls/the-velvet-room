import  { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

 export const AuthContext = createContext();
export const useAuth = () => {
    return useContext(AuthContext);
}
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Try to load the user from localStorage on app load
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser)); // Restore user session
        } else {
            // If no user data in localStorage, check session via API
            api.get('/check_session')
                .then(response => {
                    if (response.status === 200 && response.data) {
                        setUser(response.data); // Set user from API
                        // Optionally store it in localStorage
                        localStorage.setItem('user', JSON.stringify(response.data));
                    } else {
                        setUser(null); // No valid session
                    }
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error checking session:', error);
                    setLoading(false);
                    setUser(null);
                });
        }
    }, []);


    const login = async (username, password) => {
        try {
            const response = await api.post('/login', { username, password });
            setUser(response.data);
            // Save the user data to localStorage to persist the session
            localStorage.setItem('user', JSON.stringify(response.data));
            navigate('/');
        } catch (error) {
            console.error("Login failed", error);
        }
    };

    const logout = () => {
        api.delete('/logout').then(() => {
            setUser(null);
            // Remove user data from localStorage on logout
            localStorage.removeItem('user');
            navigate('/login');
        });
    };
    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};