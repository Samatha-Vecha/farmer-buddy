import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/Navbar.css";
import "../assets/Dashboard.css";


const Dashboard = ({ setAuth }) => {
  return (
    <div className="dashboard-container">
      {/* Content Wrapper */}
      <div className="content-wrapper">
        {/* Background Overlay */}
        <div className="bg-overlay"></div>

        <div className="welcome-card">
          <h2>Welcome to Farmer Buddy</h2>
          <p
            style={{
              textAlign: "center",
              maxWidth: "800px",
              margin: "20px auto",
              lineHeight: "1.6",
              fontSize: "18px",
              color: "black",
            }}
          >
            Empowering farmers with AI-driven insights.
            A smart agricultural assistant designed to support farmers with data-driven insights and predictions.
            By leveraging advanced machine learning techniques, the system helps optimize farming practices through features like fertilizer recommendations and crop name predictions.
            With an intuitive and user-friendly interface, users can easily access essential agricultural information, improving productivity and sustainability.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
