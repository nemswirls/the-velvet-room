import  { useState } from 'react';
import LoginForm from '../components/LoginForm'
import SignUpForm from '../components/SignUpForm'
import '../styles/Login.css';

const Login = () => {
    const [showSignUp, setShowSignUp] = useState(false);  // State to toggle between forms
  
    const toggleForm = () => {
      setShowSignUp(!showSignUp);  // Toggle form view
    };
  
    return (
      <div className="login">
        <h1>Welcome to The Velvet Room</h1>
        {showSignUp ? (
          <div className="form-container">
            <h2>Sign Up</h2>
            <SignUpForm />
            <p>
              Already have an account? <button onClick={toggleForm}>Login</button>
            </p>
          </div>
        ) : (
          <div className="form-container">
            <h2>Login</h2>
            <LoginForm />
            <p>
              Don&apos;t have an account? <button onClick={toggleForm}>Sign Up</button>
            </p>
          </div>
        )}
      </div>
    );
  };
  
export default Login;