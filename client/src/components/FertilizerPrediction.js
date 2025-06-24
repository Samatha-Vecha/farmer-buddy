import React, { useState, useEffect } from "react";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "../assets/FertlizerPrediction.css";
import bgImage from "../assets/images/Prediction-bg.jpg";


const FertilizerPrediction = () => {
  const [uid, setUid] = useState(null);
  const [formData, setFormData] = useState({
    Soil_color: "",
    Nitrogen: "",
    Phosphorus: "",
    Potassium: "",
    pH: "",
    Rainfall: "",
    Temperature: "",
    Crop: "",
  });

  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.body.style.backgroundImage = `url(${bgImage})`; 
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundAttachment = "fixed";

    return () => {
      document.body.style.backgroundImage = ""; // Reset on unmount
    };
  }, []);

  // Fetch User UID from Firebase Auth
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
      } else {
        setUid(null);
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  const soilColors = ["Black", "Red", "Medium Brown", "Dark Brown", "Light Brown", "Reddish Brown"];
  const crops = ["Sugarcane", "Jowar", "Cotton", "Rice", "Wheat", "Groundnut", "Maize", "Tur", "Urad", "Moong",
                 "Gram", "Masoor", "Soybean", "Ginger", "Turmeric", "Grapes"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setPrediction(null);

    if (!uid) {
      setError("User ID is missing. Please log in.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/predict_fertilizer", {
        uid,  // Include UID
        input: formData,  // Wrap input data inside "input"
      });

      setPrediction(response.data.fertilizer);
    } catch (err) {
      setError("Error in prediction. Please try again.");
      console.error("Prediction Error:", err);
    }
  };

  return (
    <div>
      <div className="prediction-container">
        <div className="prediction-card">
          <h2>Fertilizer Prediction</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Soil Color</label>
                <select name="Soil_color" value={formData.Soil_color} onChange={handleChange} required className="styled-dropdown">
                  <option value="" disabled>Select Soil Color</option>
                  {soilColors.map((color, index) => (
                    <option key={index} value={color}>{color}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Nitrogen (mg/kg)</label>
                <input type="number" name="Nitrogen" value={formData.Nitrogen} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Phosphorus (mg/kg)</label>
                <input type="number" name="Phosphorus" value={formData.Phosphorus} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Potassium (mg/kg)</label>
                <input type="number" name="Potassium" value={formData.Potassium} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>pH Level</label>
                <input type="number" step="0.1" name="pH" value={formData.pH} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Rainfall (mm)</label>
                <input type="number" name="Rainfall" value={formData.Rainfall} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Temperature (°C)</label>
                <input type="number" step="0.1" name="Temperature" value={formData.Temperature} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Crop</label>
                <select name="Crop" value={formData.Crop} onChange={handleChange} required className="styled-dropdown">
                  <option value="" disabled>Select Crop</option>
                  {crops.map((crop, index) => (
                    <option key={index} value={crop}>{crop}</option>
                  ))}
                </select>
              </div>
            </div>

            <button type="submit" className="predict-btn" style={{ width: '150px' }}>Predict</button>
          </form>

          {prediction && <div className="result">Recommended Fertilizer: <strong>{prediction}</strong></div>}
          {error && <div className="error">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default FertilizerPrediction;
