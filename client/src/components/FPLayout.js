import React from "react";
import { Outlet } from "react-router-dom";

const styles = {
  container: {
    textAlign: "center",
    paddingTop: "160px", // Default padding
  },
  responsivePadding: {
    '@media (max-width: 768px)': {
      paddingTop: "120px", // Tablets
    },
    '@media (max-width: 480px)': {
      paddingTop: "200px", // Mobile screens
    },
  }
};

const FPLayout = () => {
  return (
    <div className="FP-page-layout">
      <h1 style={{ ...styles.container }}> {/* Merging styles */}
      </h1>
      <Outlet /> {/* This renders the About component */}
    </div>
  );
};

export default FPLayout;
