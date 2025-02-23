import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { Link as RouterLink } from "react-router-dom";
import {
  Avatar,
  Box,
  Paper,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Typography,
  Link,
  CircularProgress
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import * as Yup from "yup";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/home"); // Redirect if already logged in
    }
  }, [navigate]);

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const onSubmit = async (values, { resetForm }) => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/login", values);
      
      console.log("Login Success:", response.data);
      localStorage.setItem("token", response.data.token);
      
      resetForm();
      navigate("/home"); // Navigate to home page
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Paper elevation={20} style={{
        padding: 20,
        height: "auto",
        width: 300,
        margin: "20px auto",
        borderRadius: 50,
        backgroundColor: "transparent",
        boxShadow: "0 9px 9px rgb(251, 255, 0)",
      }}>
        <Box align="center">
          <Avatar style={{ backgroundColor: "#4CAF50" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography variant="h5">Sign In</Typography>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <Field as={TextField} id="loginemail" name="email" label="Email" placeholder="Enter Email" type="email" fullWidth style={{ margin: "9px", backgroundColor: "transparent" }} />
                <ErrorMessage name="email" component="div" style={{ color: "red", fontSize: "0.8em" }} />

                <Field as={TextField} id="outlined-password-input" name="password" label="Password" type="password" placeholder="Enter Password" autoComplete="current-password" fullWidth style={{ margin: "9px", backgroundColor: "transparent" }} />
                <ErrorMessage name="password" component="div" style={{ color: "red", fontSize: "0.8em" }} />

                <Box display="flex" alignItems="center" justifyContent="space-between" mt={2}>
                  <FormControlLabel control={<Checkbox name="rememberMe" color="primary" />} label="Remember me" />
                  <Link component={RouterLink} to="/forgot-password" style={{ marginLeft: "auto", fontSize: "0.8em", color: "black" }}>
                    Forgot Password?
                  </Link>
                </Box>

                <Button type="submit" variant="contained" color="success" fullWidth style={{ marginTop: "20px" }} disabled={isSubmitting || loading}>
                  {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
      </Paper>
    </Box>
  );
}
