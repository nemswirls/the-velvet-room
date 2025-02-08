import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Form, Button, Container } from 'semantic-ui-react';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const LoginForm = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  if (!auth) {
    console.error('AuthContext is undefined. Make sure AuthProvider wraps the app');
    return <p>Error: AuthContext is not available.</p>;
  }

  const { login } = auth;


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

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      await login(values.username, values.password);
      navigate('/');
    } catch (error) {
      setFieldError('general', 'Login failed. Please check your credentials.');
      console.error('Login failed', error);
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
        {({ isSubmitting, errors }) => (
          <FormikForm>
            <Form.Field>
              <label>Username</label>
              <Field name="username" placeholder="Username" className="ui input" />
              <ErrorMessage name="username" component="div" className="ui pointing red basic label" />
            </Form.Field>

            <Form.Field>
              <label>Password</label>
              <Field name="password" type="password" placeholder="Password" className="ui input" />
              <ErrorMessage name="password" component="div" className="ui pointing red basic label" />
            </Form.Field>

            {errors.general && <div className="ui pointing red basic label">{errors.general}</div>}

            <Button type="submit" primary disabled={isSubmitting}>
              {isSubmitting ? 'Logging in...' : 'Login'}
            </Button>
          </FormikForm>
        )}
      </Formik>
    </Container>
  );
};

export default LoginForm;