import React from "react";
import { useState } from "react";

export default function Login() {
  const { formData, setFormData } = useState({ email: "", password: "" });
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
  };

  return (
    <div className="form-wrapper">
      <form className="form p-4" onClick={handleSubmit}>
        <h2 className="form-title">Login</h2>

        <div className="mb-3">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            name="email"
            onClick={handleChange}
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
            onClick={handleChange}
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

      <p className="text-center mt-3">Don't have an account?</p>
      <a href="/register">
        <button className="btn-submit">Register</button>
      </a>
    </div>
  );
}
