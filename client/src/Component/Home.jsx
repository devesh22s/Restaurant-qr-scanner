import React from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const nav = useNavigate();

  return (
    <>
      <h1>Home</h1>
      <button onClick={() => nav("/register")}>Register</button>
    </>
  );
}

export default Home;
