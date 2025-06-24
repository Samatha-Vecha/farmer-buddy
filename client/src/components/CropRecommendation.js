import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Card, Form, Row, Col, Button, Alert } from "react-bootstrap";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "bootstrap/dist/css/bootstrap.min.css";
import bgImage from "../assets/images/Prediction-bg.jpg";


const CropRecommendation = () => {
  const [uid, setUid] = useState(null);
  const [formData, setFormData] = useState({
    N: "",
    P: "",
    K: "",
    temperature: "",
    humidity: "",
    ph: "",
    rainfall: ""
  });

  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.body.style.background = `url(${bgImage})`;
    document.body.style.backgroundSize = "cover";
    return () => {
      document.body.style.background = "";
    };
  }, []);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
      } else {
        setUid(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!uid) {
      setError("User not logged in. Please login first!");
      return;
    }

    const requestData = {
      uid: uid,
      input: {
        N: parseInt(formData.N) || 0,
        P: parseInt(formData.P) || 0,
        K: parseInt(formData.K) || 0,
        temperature: parseFloat(formData.temperature) || 0,
        humidity: parseFloat(formData.humidity) || 0,
        ph: parseFloat(formData.ph) || 0,
        rainfall: parseFloat(formData.rainfall) || 0
      }
    };

    try {
      console.log("📤 Sending request to /predict_crop:", requestData);
      const response = await axios.post("http://localhost:5000/predict_crop", requestData);
      setPrediction(response.data.predicted_crop);
      setError(null);
    } catch (err) {
      console.error("❌ Error:", err.response?.data || err.message);
      setError("Error in prediction. Please try again.");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="mx-auto p-4 bg-light bg-opacity-50 mt-3 mt-md-4 mt-lg-5">
        <Card.Body>
          <Card.Title className="text-center mb-4">Crop Recommendation</Card.Title>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>N (Nitrogen)</Form.Label>
                  <Form.Control type="number" name="N" value={formData.N} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>P (Phosphorus)</Form.Label>
                  <Form.Control type="number" name="P" value={formData.P} onChange={handleChange} required />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>K (Potassium)</Form.Label>
                  <Form.Control type="number" name="K" value={formData.K} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Temperature (°C)</Form.Label>
                  <Form.Control type="number" step="0.1" name="temperature" value={formData.temperature} onChange={handleChange} required />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Humidity (%)</Form.Label>
                  <Form.Control type="number" step="0.1" name="humidity" value={formData.humidity} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>pH Level</Form.Label>
                  <Form.Control type="number" step="0.1" name="ph" value={formData.ph} onChange={handleChange} required />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Rainfall (mm)</Form.Label>
              <Form.Control type="number" step="0.1" name="rainfall" value={formData.rainfall} onChange={handleChange} required />
            </Form.Group>

            <div className="text-center">
              <Button type="submit" variant="success" className="px-4">Predict</Button>
            </div>
          </Form>

          {prediction && <Alert className="mt-3 text-center" variant="success">Recommended Crop: <strong>{prediction}</strong></Alert>}
          {error && <Alert className="mt-3 text-center" variant="danger">{error}</Alert>}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CropRecommendation;
