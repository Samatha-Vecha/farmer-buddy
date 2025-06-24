import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth, updateEmail, sendEmailVerification } from "firebase/auth";
import farmBg from "../assets/images/crop.png";
import Chatbot from "./Chatbot";

const EditProfile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.backgroundImage = `url(${farmBg})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.minHeight = "100vh";

    return () => {
      document.body.style.backgroundImage = "";
    };
  }, []);

  const fetchUserData = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      const parsedUser = JSON.parse(storedUser);

      if (parsedUser && parsedUser.uid) {
        const userRef = doc(db, "users", parsedUser.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setName(userData.name);
          setEmail(userData.email);

          // Update localStorage with full data
          const updatedUserObject = {
            uid: parsedUser.uid,
            name: userData.name,
            email: userData.email
          };
          localStorage.setItem("user", JSON.stringify(updatedUserObject));
        } else {
          setError("User data not found.");
        }
      } else {
        setError("No user found.");
      }
    } catch (error) {
      console.error("Error fetching user data: ", error);
      setError("Failed to load user data.");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      const userAuth = auth.currentUser;

      if (!userAuth) {
        setError("No authenticated user found.");
        return;
      }

      const userRef = doc(db, "users", userAuth.uid);

      if (email !== userAuth.email) {
        await sendEmailVerification(userAuth);
        alert("A verification email has been sent. Please verify and then update your details.");
        return;
      }

      if (userAuth.emailVerified) {
        await updateEmail(userAuth, email);
        await updateDoc(userRef, {
          name: name,
          email: email
        });

        const updatedUserObject = {
          uid: userAuth.uid,
          name: name,
          email: email
        };

        localStorage.setItem("user", JSON.stringify(updatedUserObject));
        window.dispatchEvent(new Event("storage"));

        alert("Profile updated successfully!");
        navigate("/dashboard");
      } else {
        alert("Please verify your email before updating details.");
      }
    } catch (error) {
      setError("Failed to update profile.");
      console.error("Error updating profile: ", error);
    }
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "100vh", width: '800px' }}>
      <div className="card p-4 shadow-lg" style={{
        opacity: 0.95,
        borderRadius: "15px",
        width: "90%",
        maxWidth: "500px",
        background: "rgba(255, 255, 255, 0.7)",
        marginTop: '90px'
      }}>
        <h2 className="text-center mb-4" style={{ color: 'black' }}>Edit Profile</h2>
        {error && <p className="text-danger text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label" style={{ color: 'black' }}>Name</label>
            <input
              type="text"
              id="name"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label" style={{ color: 'black' }}>Email</label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="d-flex justify-content-center">
            <button type="submit" className="btn btn-success" style={{ width: '200px' }}>Save Changes</button>
          </div>
        </form>
      </div>
      <Chatbot />
    </div>
  );
};

export default EditProfile;
