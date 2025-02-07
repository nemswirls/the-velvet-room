// import { useContext } from "react";
import axios from "axios";
import styled from "styled-components";
// import { UserContext } from '../context/userProvider';
import { useFormik } from 'formik';
import * as Yup from "yup";

const FormField = styled.div`
  &:not(:last-child) {
    margin-bottom: 12px;
  }
`;

const LoginForm = () => {
// const { setUser } = useContext(UserContext);

const validationSchema = Yup.object({
    username: Yup.string()
      .required("Username is required") // Username must be provided
      .min(3, "Username must be at least 3 characters long"), // Minimum 3 characters
    password: Yup.string()
      .required("Password is required") // Password must be provided
      .min(8, "Password must be at least 8 characters long") // Minimum 8 characters
      .matches(/[A-Z]/, "Password must include at least one uppercase letter.")
      .matches(/[a-z]/, "Password must include at least one lowercase letter.")
      .matches(/\d/, "Password must include at least one number.")
      .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must include at least one special character.")
  });
  const formik = useFormik({
    initialValues: {
      username: "",
      password: ""
    },
    validationSchema, 
    onSubmit: async (values) => {
      try {
        const response = await axios.post("http://127.0.0.1:5555/api/login", values);
        // Handle successful login (e.g., storing token, redirecting)
        console.log("Login successful:", response.data);
      } catch (error) {
        console.error("Login failed:", error);
      
      }
    }
  });

return (
    <form onSubmit={formik.handleSubmit}>
        <h1>Login</h1>
      <FormField>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur} // Handle blur for validation
          value={formik.values.username}
        />
        {formik.touched.username && formik.errors.username && (
          <div style={{ color: "red" }}>{formik.errors.username}</div>
        )}
      </FormField>

      <FormField>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur} // Handle blur for validation
          value={formik.values.password}
        />
        {formik.touched.password && formik.errors.password && (
          <div style={{ color: "red" }}>{formik.errors.password}</div>
        )}
      </FormField>

      <button type="submit" disabled={formik.isSubmitting}>
        Login
      </button>
    </form>
  );

}



export default LoginForm;