import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import EditProfile from "./components/EditProfile";
import About from "./components/About";
import FertilizerPrediction from "./components/FertilizerPrediction";
import Navbar from "./components/Navbar";
import CropRecommendation from "./components/CropRecommendation";
import History from "./components/History";
import Contact from "./components/Contact";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// --------------------- Private Route ---------------------
const PrivateRoute = ({ isAuthenticated, children }) => {
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// --------------------- Main App Content ---------------------
const AppContent = ({ isAuthenticated, setIsAuthenticated, uid, userName, setUserName }) => {
  const location = useLocation();
  const authPages = ["/login", "/register"];
  const showNavbar = !authPages.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar userName={userName} setUserName={setUserName} setIsAuthenticated={setIsAuthenticated} />}
      <div className="mt-60">
        <Routes>
          <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login setAuth={setIsAuthenticated} />} />
          <Route path="/register" element={<Register setUserName={setUserName} />} />
          <Route path="/about" element={<About />} />
          <Route path="/fertilizer-prediction" element={<FertilizerPrediction />} />
          <Route path="/crop-yield-prediction" element={<CropRecommendation />} />
          <Route path="/contact" element={<Contact />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <Dashboard key={uid} setAuth={setIsAuthenticated} />
              </PrivateRoute>
            }
          />
          <Route
            path="/edit-profile"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <EditProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/history"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <History uid={uid} />
              </PrivateRoute>
            }
          />

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    </>
  );
};

// --------------------- App Wrapper ---------------------
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [uid, setUid] = useState(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        setUid(user.uid);
        setUserName(user.displayName || "User");
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userName", user.displayName || "User");
      } else {
        setIsAuthenticated(false);
        setUid(null);
        setUserName("");
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("userName");
      }
    });

    return () => unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    return <div className="text-center mt-5">🔄 Checking authentication...</div>;
  }

  return (
    <Router>
      <AuthBackground />
      <AppContent
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
        uid={uid}
        userName={userName}
        setUserName={setUserName}
      />
    </Router>
  );
};

// --------------------- Optional Background ---------------------
const AuthBackground = () => {
  const location = useLocation();

  useEffect(() => {
    const authPages = ["/login", "/register"];
    if (authPages.includes(location.pathname)) {
      document.body.classList.add("bg-light");
    } else {
      document.body.classList.remove("bg-light");
    }
  }, [location.pathname]);

  return null;
};

export default App;
