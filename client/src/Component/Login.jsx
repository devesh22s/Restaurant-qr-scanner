import React from "react";

export default function Login() {
  return (
    <div className="form-wrapper">
      <form className="Student-form p-4">
        <h2 className="form-title">Login</h2>

        <div className="mb-3">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            name="email"
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
