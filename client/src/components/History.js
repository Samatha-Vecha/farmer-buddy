import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import bgImage from "../assets/images/historyimg.jpg";
import "../assets/History.css";

const History = ({ uid: propUid }) => {
  const [history, setHistory] = useState({ fertilizer_history: [], crop_history: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uid, setUid] = useState(propUid || null);

  const fertilizerRef = useRef(null);
  const cropRef = useRef(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
      } else {
        setError("User ID is missing! Please log in again.");
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!uid) return;
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/history/${uid}`);
        setHistory(response.data || { fertilizer_history: [], crop_history: [] });
      } catch (err) {
        console.error("Error fetching history:", err);
        setError("Failed to fetch history. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    if (uid) fetchHistory();
  }, [uid]);

  const deletePrediction = async (collection, docId) => {
    if (!uid) {
      alert("User ID is missing! Cannot delete.");
      return;
    }
    try {
      const apiCollection = collection === "fertilizer_history" ? "fertilizer_predictions" : "crop_name";
      const response = await axios.delete(`http://localhost:5000/delete/${apiCollection}/${docId}`);
      if (response.status === 200) {
        setHistory((prev) => ({
          ...prev,
          [collection]: prev[collection].filter((item) => item.id !== docId),
        }));
        alert("Prediction deleted successfully!");
      } else {
        alert("Failed to delete prediction. Try again.");
      }
    } catch (err) {
      console.error("Error deleting prediction:", err);
      alert("Failed to delete prediction. Try again.");
    }
  };

  const scroll = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = 300;
      ref.current.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        height: "100%",
        opacity: 0.9,
        overflowY: "auto",
        padding: "20px",
      }}
    >
      <div className="history-container">
        <h2 style={{ marginTop: "90px", color: "black", fontFamily: 'Playfair Display, serif',fontWeight:'bold' }}>
          Prediction History
        </h2>

        {!uid && <p className="error">User ID is missing. Please log in.</p>}
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <>
            <h3 style = {{color: "black", fontFamily: 'Playfair Display, serif',fontWeight:'bold'}}>Fertilizer Predictions</h3>
            <div className="scroll-container">
              <button className="scroll-btn left" onClick={() => scroll(fertilizerRef, "left")}>{"<"}</button>
              <div className="history-list" ref={fertilizerRef}>
                {history.fertilizer_history.length > 0 ? (
                  history.fertilizer_history.map((item) => (
                    <div key={item.id} className="history-card">
                      <h4>Input Details:</h4>
                      {item.input &&
                        Object.entries(item.input).map(([key, value]) => (
                          <p key={key}><strong>{key.replace(/_/g, " ")}:</strong> {value || "N/A"}</p>
                        ))}
                      <p><strong>Recommended Fertilizer:</strong> {item.prediction || "N/A"}</p>
                      <button className="delete-btn" onClick={() => deletePrediction("fertilizer_history", item.id)}>Delete</button>
                    </div>
                  ))
                ) : (
                  <p style={{ color: "white" }}>No fertilizer history found.</p>
                )}
              </div>
              <button className="scroll-btn right" onClick={() => scroll(fertilizerRef, "right")}>{">"}</button>
            </div>

            <h3 style = {{color: "black", fontFamily: 'Playfair Display, serif',fontWeight:'bold'}}>Crop Predictions</h3>
            <div className="scroll-container">
              <button className="scroll-btn left" onClick={() => scroll(cropRef, "left")}>{"<"}</button>
              <div className="history-list" ref={cropRef}>
                {history.crop_history.length > 0 ? (
                  history.crop_history.map((item) => (
                    <div key={item.id} className="history-card">
                      <h4>Input Details:</h4>
                      {item.input &&
                        Object.entries(item.input).map(([key, value]) => (
                          <p key={key}><strong>{key.replace(/_/g, " ")}:</strong> {value || "N/A"}</p>
                        ))}
                      <p><strong>Predicted Crop:</strong> {item.predicted_crop || "N/A"}</p>
                      <button className="delete-btn" onClick={() => deletePrediction("crop_history", item.id)}>Delete</button>
                    </div>
                  ))
                ) : (
                  <p style={{ color: "white" }}>No crop history found.</p>
                )}
              </div>
              <button className="scroll-btn right" onClick={() => scroll(cropRef, "right")}>{">"}</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default History;
