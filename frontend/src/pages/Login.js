// src/pages/Login.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";

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
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a1b2a",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative red circles */}
      <div style={{
        position: "absolute",
        top: "-50px",
        left: "-50px",
        width: "200px",
        height: "200px",
        borderRadius: "50%",
        background: "rgba(255,0,0,0.2)"
      }} />
      <div style={{
        position: "absolute",
        bottom: "-60px",
        right: "-60px",
        width: "250px",
        height: "250px",
        borderRadius: "50%",
        background: "rgba(255,0,0,0.15)"
      }} />

      {/* Branding */}
      <h1 style={{
        color: "white",
        fontSize: "3rem",
        fontWeight: "bold",
        marginBottom: "40px",
        zIndex: 1
      }}>
        SkillShare
      </h1>

      {/* Login Card */}
      <form
        onSubmit={handleLogin}
        style={{
          background: "#112240",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          minWidth: "320px",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "20px"
        }}
      >
        <h2 style={{ color: "white", textAlign: "center", marginBottom: "10px" }}>
          Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "none",
            outline: "none",
            fontSize: "1rem"
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "none",
            outline: "none",
            fontSize: "1rem"
          }}
        />

        <button
          type="submit"
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "none",
            background: "#e63946",
            color: "white",
            fontSize: "1rem",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "transform 0.2s ease",
          }}
          onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
        >
          Login
        </button>

        {error && (
          <p style={{ color: "#ff4d6d", textAlign: "center" }}>{error}</p>
        )}
      </form>
    </div>
  );
}
