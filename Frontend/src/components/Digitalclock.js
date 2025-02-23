import React, { useState, useEffect } from "react";

export default function Digitalclock() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", { hour12: true });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.clock}>{formatTime(currentTime)}</div>
      <div style={styles.date}>{formatDate(currentTime)}</div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
    marginTop: "50px",
    color: "#333",
  },
  clock: {
    fontSize: "48px",
    fontWeight: "bold",
  },
  date: {
    fontSize: "24px",
    marginTop: "10px",
  },
};
