import React from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const nav = useNavigate();

  return (
    <div className="home-container">
      <div className="home-card">
        <h1>Welcome</h1>

        <button onClick={() => nav("/login")} className="home-btn">
          Login
        </button>

        <button onClick={() => nav("/register")} className="home-btn">
          Register
        </button>

        <button className="home-btn guest">
          Continue as a guest
        </button>
      </div>
    </div>
  );
}

export default Home;
