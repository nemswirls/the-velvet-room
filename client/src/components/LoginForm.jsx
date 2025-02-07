import { useContext } from "react";
import { UserContext } from '../context/userProvider';
import axios from "axios";
import { useFormik } from 'formik';
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import './LoginForm.css'; 

const LoginForm = () => {
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();
  const validationSchema = Yup.object({
    username: Yup.string()
      .required("Username is required")
      .min(3, "Username must be at least 3 characters long"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters long")
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
        const response = await axios.post("http://127.0.0.1:5555/api/login", values, { withCredentials: true })
        console.log("Login successful:", response.data);
        setUser(response.data);
        navigate("/home"); // Redirect to home after successful login
    } catch (error) {
        console.error("Login failed:", error);
        alert("Login failed. Please check your username and password.");
    }
}
  });

  return (
    <form onSubmit={formik.handleSubmit} className="login-form">
      <h1>Login</h1>

      <div className="form-field">
        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.username}
        />
        {formik.touched.username && formik.errors.username && (
          <div className="error">{formik.errors.username}</div>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
        />
        {formik.touched.password && formik.errors.password && (
          <div className="error">{formik.errors.password}</div>
        )}
      </div>

      <button type="submit" disabled={formik.isSubmitting}>
        Login
      </button>
    </form>
  );
}

export default LoginForm;