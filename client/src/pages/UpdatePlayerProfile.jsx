import  { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components';
import {api} from '../api'
import { useNavigate } from'react-router-dom';

const Container = styled.div`
display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: url('/images/lavenza.png') no-repeat right center;
  background-size: contain;
  background-color: #243c84;
  
`;
const FormContainer = styled.div`
  background-color: #ffffff;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1;
  max-width: 400px;
  width: 100%;
  text-align: center;
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  margin-bottom: 15px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;

  &:focus {
    border-color: #151da6;
    outline: none;
  }
`;

const Button = styled.button`
  padding: 10px;
  background-color: #151da6;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  

  &:hover {
    background-color: #6d9ac7;
    text-decoration: none;
  }
`;



const UpdatePlayerProfile = () => {
const { user, loading} = useAuth(); // Access the logged-in user
const [username, setUsername] = useState(user?.username || ''); 
const [password, setPassword] = useState('');
const [error, setError] = useState('');
const navigate = useNavigate();

useEffect(() => {
    if (loading) {
      console.log("Loading user data...");
    }

    if (!user && !loading) {
      console.log("No user found, redirecting to login...");
      navigate('/login'); // If no user is logged in, redirect to login page
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!password) {
      setError("Password is required");
      return;
    }
  
    try {
      const response = await api.patch('/update-player-profile', { username, password });
      console.log("Update response:", response); // Log the response
      if (response.status === 200) {
        navigate('/'); // Successfully updated, redirect to home
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError("Failed to update profile");
    }
  };
  if (loading) {
    return <div>Loading...</div>; // Show loading state while fetching user data
  }
  return (
    <Container>
     <FormContainer>
      <h2 className='text'>Update Profile</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="New Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit">Update</Button>
      </Form>
      </FormContainer>
    </Container>
  );
};


export default UpdatePlayerProfile;