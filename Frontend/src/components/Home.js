// import { display, margin, width } from "@mui/system";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Collectdata from "./Collectdata"; 
import axios from 'axios';
import ViewAttendance from "./Viewattendance";
import Exportresult from "./Exportresult";
// import "./Home.css";




export default function Home() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate(); // Hook for navigation
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isAttendanceVisible, setIsAttendanceVisible] = useState(false);
  const [isExportVisible, setIsExportVisible] = useState(false);

  // Digital clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) =>
    date.toLocaleTimeString("en-US", { hour12: true });
  const formatDate = (date) =>
    date.toLocaleDateString("en-US", { weekday: "long" });

  // Changing modes
  const [mystyle, setmystyle] = useState({
    color: "black",
    backgroundColor: "#708090",
  });

  const [btntext, setBtnText] = useState("Dark Mode");

  const togglestyle = () => {
    const isDarkMode = mystyle.color === "white";
    setmystyle({
      color: isDarkMode ? "black" : "white",
      backgroundColor: isDarkMode ? "#708090" : "#102A43 ",
      transition: "all 0.9s ease-in-out",
    });
    setBtnText(isDarkMode ? "Dark Mode" : "Light Mode");
  };
// handle logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear authentication token
    console.log("Logged out successfully!");
    navigate("/"); // Navigate to the login page
  };
  

  //handlecollect data

  const handleCollectData = () => {
    setIsFormVisible(true); // Show the Collectdata form
    
  };

  const closeForm = () => {
    setIsFormVisible(false); // Hide the form
  };

  const handleTrainData = async () => {
    try {
      // Make a POST request to the backend to trigger model training
      const response = await axios.post('http://localhost:5000/api/train');  // Ensure the backend is running at this endpoint

      console.log(response.data.message);
      alert('Model training initiated successfully!');
    } catch (error) {
      console.error('Error during model training:', error);
      alert('Failed to initiate model training!');
    }
  };

  const handleTakeAttendance = async () => {
    try {
        const response = await fetch("http://localhost:5000/api/recognize", {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        });

        const data = await response.json();

        if (response.ok) {
            alert(`Attendance recorded for ${data.recognizedPerson}`);

            // 🔹 Close the camera after recognition
            let stream = document.querySelector('video')?.srcObject;
            if (stream) {
                stream.getTracks().forEach(track => track.stop()); // Stop camera
            }
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Failed to take attendance.");
    }
};



 const handleViewAttendance = () => {
    console.log("View Attendance button clicked!");
    setIsAttendanceVisible(true);
  };

  const closeAttendanceModal = () => {
    setIsAttendanceVisible(false);
  };


  const handleExportResult = () => setIsExportVisible(true);
  const closeExportModal = () => setIsExportVisible(false);

  // CSS styles
  const mainBodyStyle = {
    height: "100vh",
    margin: "0",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(90deg, #5f2c82, #49a09d)",
    backgroundSize: "200% 200%", // Reduce size for better visibility
    animation: "gradientAnimation 9s ease infinite", // Slow down the animation
    zIndex: 0, // Background layer
    ...mystyle,
  };

  const navbarStyle = {
    position: "sticky",
    padding: "2vw",
    borderRadius: "10px",
    top: "0",
    zIndex: "1000",
    width: "100%",
    display: "flex",
    alignItems: "center",
    boxShadow: "0 4px 8px rgb(69, 248, 4)",
    ...mystyle,
  };

  const navbarItemStyle = {
    flex: 1,
    textAlign: "center",
    fontSize: "18px",
    fontFamily: "Roboto, sans-serif",

    ...mystyle,
  };

  const clockStyle = {
    ...navbarItemStyle,
    fontSize: "20px",
  };
  const dashboardStyle = {
    width: "80%",
    height: "85vh",
    padding: "0",
    borderRadius: "50px",
    boxShadow: "0 8px 8px rgb(255, 215, 0)",

    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    
    ...mystyle,
  };

  const buttonStyle = {
    ...navbarItemStyle,
    fontSize: "18px",
    border: "none",
  };

  const buttonContainerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
    flexWrap: "wrap",
    marginTop: "25vh",
  };

  const btnStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: 2,
  };

  const baseButtonStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "22vh",
    width: "14vw",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
  };

  const btn1style = {
    ...baseButtonStyle,
    backgroundImage: "url('./f4.png')",
  };

  const btn2style = {
    ...baseButtonStyle,
    backgroundImage: "url('./f1.png')",
  };

  const btn3style = {
    ...baseButtonStyle,
    backgroundImage: "url('./f2.png')",
  };

  const btn4style = {
    ...baseButtonStyle,
    backgroundImage: "url('./f3.png')",
  };
  const btn5style = {
    ...baseButtonStyle,
    backgroundImage: "url('./f5.png')",
  };
  const responsiveStyles = `
  @media (max-width: 1224px) {
    .body {
      flex-wrap: nowrap;
       flex-direction: row !important; /* No wrapping for smaller screens */
      justify-content: space-between; /* Evenly space out buttons */
      gap: 10px;
       overflow-x: auto;
    }
        .btn1, .btn2, .btn3, .btn4, .btn5 {
        flex-shrink: 0; /* Prevent shrinking */
        width: 18vw; /* Adjust width for smaller screens */
        height: 24vh;
      }
  }

  @media (max-width: 1424px) {
    .body {
      flex-direction: row; /* Stack buttons vertically for smaller devices */
      align-items: center;
    }
  }
`;

  return (
    <>
      <div className="mainbodypage" style={mainBodyStyle}>
        <div className="dashboardpage" style={dashboardStyle}>
          {/* Navbar */}
          <nav className="navbar" style={navbarStyle}>
            <a className="navbar-brand" href="#" style={navbarItemStyle}>
            <marquee>WELCOME TO FACE RECOGNITION ATTENDANCE SYSTEM</marquee>
            </a>
            <div style={clockStyle}>
              {formatDate(currentTime)}, {formatTime(currentTime)}
            </div>
            <button
              type="button"
              className="btn btn-success"
              onClick={handleLogout}
            >
              Admin Logout
            </button>
            <button
              type="button"
              onClick={togglestyle}
              className="btn btn-info"
              style={buttonStyle}
            >
              {btntext}
            </button>
          </nav>

          {/* Buttons */}
          <div className="body" style={buttonContainerStyle}>
            <div className="btn1" style={btnStyle}>
              <div className="btn1pic" style={btn1style}></div>
              <button
                type="button"
                className="btn btn-primary"
                style={{ marginTop: "10px" }}onClick={handleCollectData}
              >
                COLLECT DATA
              </button>
            </div>

            <div className="btn2" style={btnStyle}>
              <div className="btn2pic" style={btn2style}></div>
              <button
                type="button"
                className="btn btn-primary"
                style={{ marginTop: "10px" }}onClick={handleTrainData}
              >
                TRAIN DATA
              </button>
            </div>

            <div className="btn3" style={btnStyle}>
              <div className="btn3pic" style={btn3style}></div>
              <button
                type="button"
                className="btn btn-primary"
                style={{ marginTop: "10px" }}onClick={handleTakeAttendance}
              >
                TAKE ATTENDANCE
              </button>
            </div>

            <div className="btn4" style={btnStyle}>
              <div className="btn4pic" style={btn4style}></div>
              <button
                type="button"
                className="btn btn-primary"
                style={{ marginTop: "10px" }}onClick={handleViewAttendance}
              >
                VIEW ATTENDANCE
              </button>
            </div>

            <div className="btn5" style={btnStyle}>
              <div className="btn5pic" style={btn5style}></div>
              <button
                type="button"
                className="btn btn-primary"
                style={{ marginTop: "10px" }}onClick={handleExportResult}
              >
                EXPORT RESULT
              </button>
            </div>
          </div>
        </div>
          {/* Show Collectdata form */}
          {isFormVisible && (
          <div
            style={{
             
              position: "absolute",
              top: "52%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 1000,
              backgroundColor: "white",
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "20px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
              ...mystyle
              
            }}
          >
            <button
              onClick={closeForm}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                backgroundColor: "red",
                color: "white",
                border: "none",
                borderRadius: "5px",
                padding: "5px 10px",
                cursor: "pointer",
                ...mystyle
              }}
            >
              X
            </button>
            
            <Collectdata mystyle={mystyle} />
          </div>
        )}

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
             ${responsiveStyles} 
        `}
        </style>
        {isAttendanceVisible && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    }}
  >
    <ViewAttendance mystyle={mystyle} onClose={closeAttendanceModal} />
  </div>
)}
  {isExportVisible && (
          <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
            <Exportresult mystyle={mystyle} onClose={closeExportModal} />
          </div>
        )}
      </div>
    </>
  );
}
