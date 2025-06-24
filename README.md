# 🌾 Fertilizer And Crop Recommendation System

A web application that recommends the most suitable fertilizer based on soil and environmental conditions using machine learning. It uses a **React frontend**, a **Flask backend**, and multiple ML models like **Random Forest**, **Gaussian Naive Bayes**, and **Decision Tree**.

---

## 📸 Demo 

🎥 **Demo Video:** [Watch Here](https://drive.google.com/file/d/1zUTg_sezr69i0dw0GlQXDJGE2OcQAdmh/view?usp=sharing)  

---

## ✅ Features

- 🚜 Fertilizer prediction based on:
  - Nitrogen, Phosphorus, Potassium (NPK)
  - pH, Rainfall, Temperature
  - Soil Color, Crop
- 🌽 Crop prediction based on:
  - Nitrogen, Phosphorus, Potassium (NPK)
  - pH, Temperature, Humidity, Rainfall
- 🤖 Models: Random Forest, Gaussian NB, Decision Tree
- 🔐 Admin authentication with Firebase

---

## 🛠 Tech Stack

| Layer      | Tools Used                              |
|------------|------------------------------------------|
| Frontend   | React.js, Axios, HTML, CSS               |
| Backend    | Flask, Flask-CORS                        |
| ML Models  | Random Forest, Naive Bayes, Decision Tree|
| Auth       | Firebase Admin SDK                       |

---

## 🧪 ML Models Used

- **Random Forest** — ensemble accuracy
- **Gaussian Naive Bayes** — fast predictions
- **Decision Tree** — interpretable rules

Trained using `scikit-learn`, saved using `joblib`.

---

## 🔧 Local Setup

### 🚀 1. Clone the Repo

```bash
git clone https://github.com/Samatha-Vecha/farmer-buddy.git
cd farmer-buddy
```
# Backend Setup

cd backend
python -m venv venv
## Activate virtual environment
## On Windows:
venv\Scripts\activate
## On Linux/Mac:
source venv/bin/activate
pip install -r requirements.txt

## Start the Flask server
python app.py

# Frontend Setup
cd ../client
npm install
npm start
