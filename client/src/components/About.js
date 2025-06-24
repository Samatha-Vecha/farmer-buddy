import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import fertilizerImg from "../assets/images/Fertilizer_name_prediction.png";
import cropNameImg from "../assets/images/Crop_Name_Prediction.png";
import carousel1 from "../assets/images/crop-image2.jpg"; // example images
import carousel2 from "../assets/images/cropname.jpg";
import carousel3 from "../assets/images/Farm-1.webp";
import "../assets/About.css";

const About = () => {
  const [titles, setTitles] = useState({
    cropName: "",
    fertilizer: "",
  });

  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    const sections = document.querySelectorAll(".about-container");

    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const typeText = (text, key) => {
      let i = 0;
      const interval = setInterval(() => {
        setTitles((prev) => ({
          ...prev,
          [key]: text.substring(0, i + 1),
        }));
        i++;
        if (i === text.length) clearInterval(interval);
      }, 100);
    };

    typeText("Crop Name Prediction", "cropName");
    setTimeout(() => typeText("Crop Name Prediction", "cropName"), 1500);
    setTimeout(() => typeText("Fertilizer Prediction", "fertilizer"), 3000);
  }, []);

  const handleImageClick = (image) => {
    setActiveImage(image === activeImage ? null : image); // Toggle active image
  };

  return (
    <div>
      <div className="container responsive-margin">
        {/* Title */}
        <div className="about-section">Empowering Agriculture with Farmer Buddy</div>

        {/* Carousel */}
        <div id="aboutCarousel" className="carousel slide mb-5" data-bs-ride="carousel">
          <div className="carousel-inner">
            <div className={`carousel-item active`} onClick={() => handleImageClick('carousel1')}>
              <img src={carousel1} className="d-block w-100 carousel-img" alt="Slide 1" />
              <div className="carousel-content">
                <div className="carousel-content-border">
                  <p><strong>Fertilizer Recommendation</strong><br/>➡ Optimizes fertilizer usage for better crop yield.<br/> ➡ Based on soil composition and weather patterns.<br/> ➡ Improves soil health and minimizes waste.

</p>
                </div>
              </div>
            </div>
            <div className="carousel-item" onClick={() => handleImageClick('carousel2')}>
              <img src={carousel2} className="d-block w-100 carousel-img" alt="Slide 2" />
              <div className="carousel-content">
                <div className="carousel-content-border">
                  <p><strong>Crop Name Prediction</strong><br/>➡ Predicts the best crop for a specific environment. <br/>➡ Uses historical and real-time data for accuracy. <br/>➡ Helps farmers make informed planting decisions.</p>
                </div>
              </div>
            </div>
            <div className="carousel-item" onClick={() => handleImageClick('carousel3')}>
              <img src={carousel3} className="d-block w-100 carousel-img" alt="Slide 3" />
              <div className="carousel-content">
                <div className="carousel-content-border">
                  <p><strong>Sustainable Farming</strong><br/>➡ Promotes eco-friendly farming practices. <br/>➡ Reduces environmental impact with precise recommendations.<br/>➡ Encourages resource efficiency and long-term soil health.</p>
                </div>
              </div>
            </div>
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#aboutCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#aboutCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>

        {/* Crop Yield Prediction */}
        <div className="about-container reverse">
          <img
            src={cropNameImg}
            alt="Crop Yield Prediction"
            className="about-image"
            loading="lazy"
          />
          <div className="about-text">
            <h2 className="title-style">{titles.cropName}</h2>
            <p>
              <strong>Crop Name Prediction</strong> utilizes historical and real-time
              <strong> weather</strong>, <strong>soil</strong>, and <strong>crop growth data</strong>
              to estimate the expected Crop Name. This AI-powered model helps farmers make
              <strong> informed decisions</strong> on harvesting, storage, and market sales.
            </p>
          </div>
        </div>

        {/* Fertilizer Prediction */}
        <div className="about-container">
          <img
            src={fertilizerImg}
            alt="Fertilizer Prediction"
            className="about-image"
            loading="lazy"
          />
          <div className="about-text">
            <h2 className="title-style">{titles.fertilizer}</h2>
            <p>
              <strong>Fertilizer Prediction</strong> helps farmers choose the right
              <strong> nutrient mix</strong> based on <strong>soil composition</strong>,
              <strong> crop type</strong>, and <strong>weather patterns</strong>. Our AI-driven
              system recommends the most <strong>efficient fertilizers</strong>, ensuring
              <strong> optimal crop growth</strong> while maintaining <strong>soil health</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
