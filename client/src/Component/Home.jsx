import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const nav = useNavigate();

  return (
    <div className="home-hero">
      <div className="hero-content">
        <h1 className="hero-title">Welcome to Our Platform</h1>
        <p className="hero-subtitle">
          Secure • Fast • Modern Authentication System
        </p>

        <div className="hero-buttons">
          <button onClick={() => nav("/login")} className="hero-btn primary">
            Login
          </button>

          <button onClick={() => nav("/register")} className="hero-btn secondary">
            Register
          </button>

          <button className="hero-btn guest" onClick={() => nav("/guest")}>
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
