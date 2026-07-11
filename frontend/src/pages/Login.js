// src/pages/Login.js
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import "../styles/auth.css";

import "../navbar.css";
export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      
      console.log(res.data);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("token", res.data.token);

      // decode token to update App.js user state
      const [, payload] = res.data.token.split(".");
      const decoded = JSON.parse(atob(payload));
      setUser(decoded);

      navigate("/"); // redirect to home
    } catch (err) {
      localStorage.removeItem("token"); // remove stale token
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div
      className="auth-page"
    >
      

      {/* Branding */}
      <div className="brand">
  <Link to="/" className="login-brand">
  <span className="login-brand-icon">SS</span>
  <span>SkillShare Pro</span>
</Link>

  

  <p className="brand-subtitle">
    Learn. Share. Grow.
  </p>
</div>

      {/* Login Card */}
      <form
        onSubmit={handleLogin}
        className="auth-card"
      >
        <h2 className="auth-heading">
          Login
        </h2>

        <input 
          className="auth-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          
        />

        <input
          className="auth-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          
        />

        <button
          className="auth-button"
          type="submit"
        >
          Login
        </button>
        <p className="auth-switch">
  Don't have an account?{" "}
  <Link to="/register" className="auth-link">
    Create one
  </Link>
</p>
        {error && (
          <p style={{ color: "#ff4d6d", textAlign: "center" }}>{error}</p>
        )}
      </form>
    </div>
  );
}
