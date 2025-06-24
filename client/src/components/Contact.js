import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Correct the import to match your file name
import { doc, getDoc, updateDoc, arrayUnion, setDoc } from "firebase/firestore"; // Import necessary Firestore functions
import "../assets/Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  useEffect(() => {
    // Get user data from localStorage (or Firebase Auth if you're using session)
    const user = JSON.parse(localStorage.getItem('user')); // Assuming you stored user in localStorage
    if (user) {
      setFormData({
        ...formData,
        name: user.name,
        email: user.email,
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Reference the user document using the email as the document ID
      const userRef = doc(db, "messages", formData.email); // Use email as document ID for easy lookup
      const userDoc = await getDoc(userRef);
  
      if (userDoc.exists()) {
        // If the document exists, update it by adding the new message to the list (array)
        await updateDoc(userRef, {
          messages: arrayUnion({
            name: formData.name,
            email: formData.email,
            message: formData.message,
            timestamp: new Date(),
          }),
        });
        alert('Message sent successfully!');
      } else {
        // If no document exists, create a new one with the user's first message
        await setDoc(userRef, {
          email: formData.email,
          messages: [{
            name: formData.name,
            email: formData.email,
            message: formData.message,
            timestamp: new Date(),
          }],
        });
        alert('Message sent successfully!');
      }
  
      // Reset form data after submission
      setFormData({ name: '', email: '', message: '' });
  
      // Reload the page after successful message submission
      window.location.reload();
    } catch (e) {
      console.error("Error adding document: ", e);
      alert('There was an error sending the message.');
    }
  };
  

  return (
    <div className="contact-container">
      <div className="contact-header">
        <h2>Contact Us</h2>
        <p>We'd love to hear from you! Feel free to reach out with any questions.</p>
      </div>
      <div className="contact-body">
        <div className="contact-form">
          <h3>Send us a Message</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
              disabled // Name is prefilled from the registered user
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              required
              disabled // Email is prefilled from the registered user
            />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message"
              required
            />
            <button type="submit" className="btn-submit">Submit</button>
          </form>
        </div>
        <div className="contact-details">
          <h3>Contact Details</h3>
          <p><strong>Email:</strong> sgsv919904@gmail.com</p>
          <p><strong>Phone:</strong> +91 7815996361</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
