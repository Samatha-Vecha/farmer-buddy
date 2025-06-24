import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import "bootstrap/dist/css/bootstrap.min.css";
import { Dropdown } from "bootstrap";

const Navbar = ({ setIsAuthenticated }) => {
  const [userName, setUserName] = useState("");
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        setUserName(user?.name || "");
      }
    } catch (err) {
      console.error("Failed to parse user from localStorage", err);
      setUserName("");
    }

    const dropdownElements = document.querySelectorAll('.dropdown-toggle');
    dropdownElements.forEach((element) => {
      new Dropdown(element);
    });
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      setIsAuthenticated(false);
      navigate("/login");
    } catch (error) {
      console.error("❌ Logout Error:", error);
    }
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .trim()
      .split(" ")
      .map(part => part?.[0]?.toUpperCase() || "")
      .join("");
  };

  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };

  const closeNavbar = () => {
    setIsNavbarOpen(false);
  };

  const closeDropdown = (dropdownId) => {
    const dropdownElement = document.getElementById(dropdownId);
    if (dropdownElement) {
      const dropdownInstance = Dropdown.getInstance(dropdownElement);
      if (dropdownInstance) {
        dropdownInstance.hide();
      }
    }
  };

  return (
    <>
      <style>
        {`
          .dropdown-menu {
            background: #f4f9fd;
            border-radius: 10px;
            box-shadow: 0 8px 16px rgba(0,0,0,0.1);
            padding: 10px 15px;
            position: relative;
            opacity: 0;
            transform: scale(0.95);
            transition: all 0.3s ease;
            border: 2px solid transparent;
            overflow: hidden;
          }

          .dropdown-menu.show {
            opacity: 1;
            transform: scale(1);
            border-color: #4ea5ce;
          }

          .dropdown-menu::before,
          .dropdown-menu::after {
            content: "";
            position: absolute;
            left: 0;
            right: 0;
            height: 2px;
            background-color: #4ea5ce;
          }

          .dropdown-menu::before {
            top: 0;
            animation: topBorder 2s linear infinite alternate;
          }

          .dropdown-menu::after {
            bottom: 0;
            animation: bottomBorder 2s linear infinite alternate;
          }

          @keyframes topBorder {
            0% { left: 0; right: 100%; }
            100% { left: 100%; right: 0; }
          }

          @keyframes bottomBorder {
            0% { left: 100%; right: 0; }
            100% { left: 0; right: 100%; }
          }

          .close-dropdown {
            position: absolute;
            top: 6px;
            right: 10px;
            font-size: 20px;
            color: #888;
            cursor: pointer;
            font-weight: 900;
            transition: color 0.2s ease;
          }

          .close-dropdown:hover {
            color: #dc3545;
          }

          .dropdown-item {
            font-weight: bold;
            transition: background-color 0.3s ease, transform 0.2s ease, padding-left 0.3s ease;
          }

          .dropdown-item:hover {
            background-color: #d1e7f7;
            transform: scale(1.05);
            padding-left: 10px;
          }

          .dropdown-item:focus {
            background-color: #c9daf8;
            transform: scale(1.05);
          }

          .dropdown-item:active {
            background-color: #b0d6f4;
          }

          .dropdown-menu.show {
            background-color: rgba(255, 255, 255, 0.9);
            box-shadow: 0 8px 20px rgba(0,0,0,0.2);
          }

          .dropdown-item-text {
            color: #333;
            font-weight: bold;
          }

          .navbar-toggler-icon {
            color: #fff;
          }

          .navbar-nav .nav-link {
            position: relative;
            padding-bottom: 5px;
            transition: all 0.3s ease;
          }

          .navbar-nav .nav-link:hover {
            border-bottom: 2px solid rgb(229, 184, 19);
          }
        `}
      </style>

      <nav className="navbar navbar-expand-lg navbar-dark" style={{
        background: "linear-gradient(135deg, #db6889, #4ea5ce)",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        position: "fixed",
        top: 0,
        width: "100%",
        zIndex: 997,
        padding: "10px 0"
      }}>
        <div className="container">
          <Link className="navbar-brand fw-bold fs-4" to="/" style={{ color: "#fff", fontFamily: "'Playfair Display', serif" }} onClick={closeNavbar}>
            Farmer Buddy 🌾
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            onClick={toggleNavbar}
            aria-label="Toggle navigation"
          >
            {isNavbarOpen ? (
              <span style={{ fontSize: "24px", color: "white" }}>✖</span>
            ) : (
              <span className="navbar-toggler-icon"></span>
            )}
          </button>

          <div className={`collapse navbar-collapse ${isNavbarOpen ? "show" : ""}`} id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center">
              <li className="nav-item">
                <Link className="nav-link text-dark fw-bold" to="/" onClick={closeNavbar}>Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-dark fw-bold" to="/about" onClick={closeNavbar}>About</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-dark fw-bold" to="/contact" onClick={closeNavbar}>Contact</Link>
              </li>

              {/* Prediction Dropdown */}
              <li className="nav-item dropdown">
                <button className="nav-link dropdown-toggle text-dark fw-bold" id="predictionDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                  Prediction
                </button>
                <ul className="dropdown-menu" aria-labelledby="predictionDropdown" style={{ minWidth: "220px" }}>
                  <span className="close-dropdown" onClick={() => closeDropdown('predictionDropdown')}>×</span>
                  <li><Link className="dropdown-item" to="/fertilizer-prediction" onClick={closeNavbar}>Fertilizer Prediction</Link></li>
                  <li><Link className="dropdown-item" to="/crop-yield-prediction" onClick={closeNavbar}>Crop Prediction</Link></li>
                </ul>
              </li>

              {/* Profile Dropdown */}
              <li className="nav-item dropdown">
                <button className="nav-link dropdown-toggle d-flex align-items-center text-dark fw-bold" id="profileDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                  <div style={{
                    width: "35px", height: "35px", backgroundColor: "#ffbb00",
                    color: "white", borderRadius: "50%", display: "flex",
                    justifyContent: "center", alignItems: "center", fontWeight: "bold", marginRight: "6px"
                  }}>
                    {getInitials(userName)}
                  </div>
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
                  <span className="close-dropdown" onClick={() => closeDropdown('profileDropdown')}>×</span>
                  <li><span className="dropdown-item-text fw-bold">Hi👋 {userName}</span></li>
                  <li><Link className="dropdown-item" to="/edit-profile" onClick={closeNavbar}>Edit Profile</Link></li>
                  <li><Link className="dropdown-item" to="/history" onClick={closeNavbar}>History of Predictions</Link></li>
                  <li><button className="dropdown-item text-danger fw-bold" onClick={() => { handleLogout(); closeNavbar(); }}>Logout ➡️</button></li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
