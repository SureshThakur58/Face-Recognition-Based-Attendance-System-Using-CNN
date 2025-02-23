import { Box, Paper, Tab, Tabs } from "@mui/material";
import React, { useState } from "react";
import Login from "../components/Login";
import Signup from "../components/Signup";

function TabPanel({ children, value, index, ...other }) {
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </Box>
  );
}

export default function SignInOutContainer() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        position: "relative",
        background: "linear-gradient(90deg, rgb(74, 8, 118), #49a09d)",
        backgroundSize: "200% 200%",
        animation: "gradientAnimation 9s ease infinite",
        zIndex: 0,
      }}
    >
      <Paper
        sx={{
          padding: "20px",
          maxWidth: 400,
          zIndex: 1,
          boxShadow: "0 9px 9px rgb(0, 0, 0)",
          backgroundColor: "transparent",
          borderRadius: 5,
        }}
      >
        <Tabs value={value} onChange={handleChange} aria-label="Sign-in/out tabs" centered>
          <Tab label="SIGNIN" sx={{ fontWeight: "bold" }} />
          <Tab label="SIGNUP" sx={{ fontWeight: "bold" }} />
        </Tabs>
        <TabPanel value={value} index={0}>
          <Login />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Signup setValue={setValue} /> {/* Pass setValue to Signup */}
        </TabPanel>
      </Paper>
      <style>
        {`
          @keyframes gradientAnimation {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
        `}
      </style>
    </Box>
  );
}
