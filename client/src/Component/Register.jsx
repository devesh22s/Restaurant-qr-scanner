import React from "react";

export default function Register() {
  return (
    <div className="form-wrapper">
      <form className="p-4">
        <h2 className="form-title">Registration Form</h2>

        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            name="fullName"
            className="form-control"
            placeholder="Enter full name"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="example@email.com"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            placeholder="Enter password"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Contact</label>
          <input
            type="number"
            name="contact"
            className="form-control"
            placeholder="Enter contact"
            required
          />
        </div>

        <div className="text-center">
          <button type="submit" className="btn-submit">
            Register
          </button>
        </div>
      </form>

      <p className="text-center mt-3">Already have an account?</p>
      <a href="/login">
        <button className="btn-submit">Login</button>
      </a>
    </div>
  );
}
