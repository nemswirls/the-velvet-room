import  { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';  // Check this path

import { Form, Button, Container } from 'semantic-ui-react';


const LoginForm = () => {
   const [username, setusername] = useState('');
   const [password, setPassword] = useState('');
   const auth = useContext(AuthContext);

  if (!auth) {
      console.error("AuthContext is undefined. Make sure AuthProvider wraps the app");
      return <p>Error: AuthContext is not available.</p>
      }
      const {login} = auth;
      const navigate = useNavigate();
      
      const handleSumbit = async (e) => {
      e.preventDefault();
      try {
        await login(username, password);
        navigate('/');
      } catch (error) {
        console.error("Login failed", error);
      }
      }
return (
   <Container>
     
      <Form onSubmit={handleSumbit}>
        <Form.Input placeholder='Username' value={username} onChange={(e) => setusername(e.target.value)} />
        <Form.Input placeholder='Password' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button type='submit'>Login</Button>
      </Form>
     </Container>
)
   
}

export default LoginForm;