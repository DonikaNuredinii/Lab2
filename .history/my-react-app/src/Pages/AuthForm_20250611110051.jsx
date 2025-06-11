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

  const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage("");
  setMessageType("");

  try {
    if (isLogin) {
      const response = await axios.post(`${API_BASE}/api/User/login`, {
        email: form.email,
        password: form.password,
      });

      const { token, refreshToken, userId, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
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
