import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth, db } from "../firebase";
import "../assets/Auth.css";
import { doc, getDoc } from "firebase/firestore";

const Login = ({ setAuth }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const navigate = useNavigate();

  // Validation Regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/;


  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // Added Validations
    if (!emailRegex.test(email)) {
      setError("⚠️ Please enter a valid email address.");
      return;
    }

    if (!passwordRegex.test(password)) {
      setError("⚠️ Password must have at least 6 characters, include uppercase, lowercase, number, and special character.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userUID = user.uid;

      const userRef = doc(db, "users", userUID);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        await auth.signOut();
        setError("⚠️ No user record found. Please register first.");
        return;
      }

      const userData = userDoc.data();

      if (email !== userData.email) {
        await auth.signOut();
        setError("⚠️ Email mismatch. Please try again.");
        return;
      }

      console.log("✅ User Logged In:", userData);
      setAuth(true);

      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("userName", userData.name);

      navigate("/dashboard", { replace: true });
      window.location.reload();

    } catch (error) {
      console.error("❌ Login Error:", error);
      if (error.code === "auth/user-not-found") {
        setError("⚠️ No user found with this email. Please register first.");
      } else {
        setError("⚠️ Invalid email or password. Please try again.");
      }
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (!resetEmail) {
      setError("⚠️ Please enter your email address.");
      return;
    }

    if (!emailRegex.test(resetEmail)) {
      setError("⚠️ Please enter a valid email address.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setError("✅ A password reset email has been sent.");
      setIsResetting(false);
    } catch (error) {
      console.error("❌ Reset Password Error:", error);
      setError("⚠️ Error sending reset email. Please try again.");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="bg-overlay"></div>
      <h1 className="auth-title">Farmer Buddy 🌾</h1>

      <div className="auth-container">
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}

        {isResetting ? (
          <div>
            <h3>Reset Password</h3>
            <form onSubmit={handleResetPassword}>
              <input
                type="email"
                placeholder="Enter your email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />
              <button type="submit">Send Reset Link</button>
            </form>
            <p>
              Remembered your password?{" "}
              <span className="link" onClick={() => setIsResetting(false)} style={{ cursor: "pointer" }}>
                Back to Login
              </span>
            </p>
          </div>
        ) : (
          <div>
            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit">Login</button>
            </form>

            <p>
              Forgot your password?{" "}
              <span className="link" onClick={() => setIsResetting(true)} style={{ cursor: "pointer" }}>
                Reset it
              </span>
            </p>

            <p>
              Don't have an account?{" "}
              <span className="link" onClick={() => navigate("/register")} style={{ cursor: "pointer" }}>
                Register here
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
