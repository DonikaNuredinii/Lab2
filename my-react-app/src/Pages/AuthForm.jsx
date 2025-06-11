import React, { useState } from "react";
import axios from "axios";
import "../CSS/AuthForm.css";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const AuthForm = ({ setIsAuthenticated }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "", 
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setMessage("");
    setMessageType("");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
  const { email, password, firstName, lastName, phoneNumber } = form;

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const allowedDomains = ["gmail.com", "outlook.com", "hotmail.com"];
  const domain = email.split("@")[1]?.toLowerCase();

  if (!emailRegex.test(email)) {
    setMessage("Invalid email format.");
    setMessageType("error");
    return false;
  }

  if (!allowedDomains.includes(domain)) {
    setMessage("Email must be from gmail.com, outlook.com, or hotmail.com.");
    setMessageType("error");
    return false;
  }


  if (!/^[A-Z]/.test(password)) {
    setMessage(" Password must start with an uppercase letter.");
    setMessageType("error");
    return false;
  }

 
  if (!isLogin) {
    if (!firstName || !lastName || !phoneNumber) {
      setMessage("❌ All fields are required for signup.");
      setMessageType("error");
      return false;
    }

    if (password !== form.confirmPassword) {
      setMessage("❌ Passwords do not match.");
      setMessageType("error");
      return false;
    }



  }

  return true;
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");

    if (!validateForm()) return;


    try {
      if (isLogin) {
        
        if (!form.email || !form.password) {
          alert("Please enter email and password");
          return;
        }

        const response = await axios.post(
          `${API_BASE}/api/User/login`,
          {
            email: form.email,
            password: form.password,
          },
          {
            withCredentials: true,
          }
        );

        const { token, userId, user } = response.data;

        localStorage.setItem("token", token);
        localStorage.setItem("userId", String(userId));
        localStorage.setItem("role", user.role);

        setIsAuthenticated(true);

        alert("✅ Login successful!");
        setMessageType("success");

        if (user.role === "Superadmin") {
          navigate("/superadmin");
        } else if (user.role === "Admin") {
          navigate("/admin");
        } else if (user.role === "user" || user.role === "User") {
          navigate("/online-menu");
        } else {
          console.warn("Unknown role. Redirecting to fallback route.");
          navigate("/");
        }
      } else {
        // SIGNUP logic here
        await axios.post(`${API_BASE}/api/User/signup`, form);
        alert("✅ Signup successful. Please log in.");
        setMessageType("success");
        setIsLogin(true); // switch to login form after signup
      }
    } catch (error) {
      const errMsg =
        typeof error.response?.data === "string"
          ? error.response.data
          : "Something went wrong.";
      setMessage(` ${errMsg}`);
      setMessageType("error");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className={`auth-container ${isLogin ? "" : "slide-left"}`}>
        <form onSubmit={handleSubmit} className="auth-form">
          <h2>{isLogin ? "Login" : "Sign Up"}</h2>

          {message && (
            <p
              className={`message ${
                messageType === "success" ? "success" : "error"
              }`}
            >
              {message}
            </p>
          )}

          {!isLogin && (
            <>
              <input
                name="firstName"
                placeholder="First Name"
                onChange={handleChange}
                required
              />
              <input
                name="lastName"
                placeholder="Last Name"
                onChange={handleChange}
                required
              />
              <input
                name="phoneNumber"
                placeholder="Phone Number"
                onChange={handleChange}
                required
              />
            </>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
        
          {!isLogin && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={handleChange}
              required
            />
          )}

          <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
        
          <p className="toggle-text">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button type="button" onClick={toggleForm}>
              {isLogin ? " Register now" : " Login here"}
            </button>
          </p>
        </form>

      </div>
    </div>
  );
};

export default AuthForm;
