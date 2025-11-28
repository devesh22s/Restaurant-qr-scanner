import React from "react";
import { useState } from "react";
import Home from "../Component/Home";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    console.log("Login Response:", data);

    navigate("/main");
  };

  return (
    <div className="form-wrapper">
      <form className="form p-4" onSubmit={handleSubmit}>
        <h2 className="form-title">Login</h2>

        <div className="mb-3">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            name="email"
            onChange={handleChange}
            value={formData.email}
            className="form-control"
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            name="password"
            onChange={handleChange}
            value={formData.password}
            className="form-control"
            placeholder="Enter your password"
            required
          />
        </div>

        <div className="text-center">
          <button type="submit" className="btn-submit">
            Login
          </button>
        </div>
      </form>

      <p className="text-center mt-3">Already have an account?</p>

      <Link to="/register">
        <button type="button" className="btn-submit">
          Login
        </button>
      </Link>
    </div>
  );
}
