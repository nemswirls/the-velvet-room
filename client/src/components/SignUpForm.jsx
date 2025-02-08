import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Message } from 'semantic-ui-react';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { api } from '../api';

const SignUpForm = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, 'Username must be at least 3 characters')
      .required('Username is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[0-9]/, 'Password must contain at least one number')
      .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
      .required('Password is required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    setError('');
    setSuccess(false);
  
    try {
      const response = await api.post('/signup', values);
  
      if (!response.ok) {
        throw new Error(response.data.error || 'Signup failed');
      }
  
      setSuccess(true);
      setTimeout(() => navigate('/choose-wildcard'), 1000);
    } catch (error) {
      console.error('Signup failed', error);
      setError(error.response?.data?.error || error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container>
      <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <FormikForm>
            <div className="field">
              <label>Username</label>
              <Field name="username" placeholder="Enter your username" />
              <ErrorMessage name="username" component="div" className="ui red message" />
            </div>
            <div className="field">
              <label>Password</label>
              <Field name="password" type="password" placeholder="Enter your password" />
              <ErrorMessage name="password" component="div" className="ui red message" />
            </div>
            <Button type="submit" primary disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Sign Up'}
            </Button>
          </FormikForm>
        )}
      </Formik>

      {error && <Message negative>{error}</Message>}
      {success && <Message positive>Signup successful! Redirecting...</Message>}
    </Container>
  );
};

export default SignUpForm;