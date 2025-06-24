import { useState } from "react";
import { auth } from "./firebase"; // Firebase config
import axios from "axios";
import { createUserWithEmailAndPassword } from "firebase/auth";

const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phone, setPhone] = useState(""); // New field
    const [location, setLocation] = useState(""); // New field
    const [isRegister, setIsRegister] = useState(true);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isRegister && password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            if (isRegister) {
                // Register in Firebase
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const uid = userCredential.user.uid;

                // Send additional data to Flask backend (if necessary)
                const response = await axios.post("http://127.0.0.1:5000/register", {
                    uid,
                    email,
                    name,
                    phone,
                    location
                });

                alert(response.data.message || "Registered Successfully");
            }
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="auth-container">
            <h2>{isRegister ? "Register" : "Login"}</h2>
            <form onSubmit={handleSubmit}>
                {isRegister && (
                    <>
                        <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
                        <input type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                        <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} required />
                    </>
                )}
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                {isRegister && (
                    <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                )}
                <button type="submit">{isRegister ? "Register" : "Login"}</button>
            </form>
            <p onClick={() => setIsRegister(!isRegister)}>
                {isRegister ? "Already have an account? Login" : "Don't have an account? Register"}
            </p>
        </div>
    );
};

export default Auth;
