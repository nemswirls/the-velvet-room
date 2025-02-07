import { useContext } from "react";
import { UserContext } from '../context/userProvider';
import { useFormik } from 'formik';
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './SignUpForm.css'; 

const SignUpForm = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(3, "Username must be at least 3 characters long.")
        .required("Username is required."),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters long.")
        .matches(/[A-Z]/, "Password must include at least one uppercase letter.")
        .matches(/[a-z]/, "Password must include at least one lowercase letter.")
        .matches(/\d/, "Password must include at least one number.")
        .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must include at least one special character.")
        .required("Password is required."),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match.")
        .required("Confirm password is required."),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const response = await axios.post("/api/signup", {
          username: values.username,
          password: values.password,
        });
        console.log("Signup successful:", response.data);
        setUser(response.data);
        resetForm();
        navigate("/choose-wildcard"); 
      } catch (error) {
        console.error("Signup error:", error.response ? error.response.data : error.message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="signup-form">
      <h1>Sign Up</h1>

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

      <div className="form-field">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.confirmPassword}
        />
        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
          <div className="error">{formik.errors.confirmPassword}</div>
        )}
      </div>

      <button type="submit" disabled={formik.isSubmitting}>
        {formik.isSubmitting ? "Signing Up..." : "Sign Up"}
      </button>
    </form>
  );
};

export default SignUpForm;