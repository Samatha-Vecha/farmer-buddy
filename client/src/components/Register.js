import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import "../assets/Auth.css";
import bgImage from "../assets/images/crop.png";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!email || !password || !name || !phone || !location) {
      setError("All fields are required.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log("User Registered:", user);

      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        phone,
        location,
        uid: user.uid,
        createdAt: new Date().toISOString(),
      });

      console.log("User data successfully stored in Firestore!");

      // Store user details in localStorage
      localStorage.setItem("user", JSON.stringify({ name, email, phone, location, uid: user.uid }));

      // Log the user details to verify
      console.log("Stored user in localStorage:", localStorage.getItem("user"));

      navigate("/dashboard");

      // Force a full page reload to ensure fresh data load
      window.location.reload();

    } catch (err) {
      console.error("Error Registering:", err.code, err.message);
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already in use. Please use a different email.");
      } else if (err.code === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      } else {
        setError("Error: " + err.message);
      }
    }
  };

  return (
    <div className="auth-wrapper" style={{
      backgroundImage: `url(${bgImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <div className="bg-overlay"></div>
      
      <div className="auth-container">
        <h1>Register</h1>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
          <button type="submit">Register</button>
        </form>
        <p>
          Already have an account?{" "}
          <span
            className="link"
            onClick={() => navigate("/login")}
            style={{ cursor: "pointer", color: "#007bff", textDecoration: "underline" }}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
