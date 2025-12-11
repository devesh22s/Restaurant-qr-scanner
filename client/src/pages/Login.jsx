import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  UtensilsCrossed,
  ArrowRight,
  Loader2
} from "lucide-react";
import { login } from "../redux/authSlice";
import "./login.css"

export default function Login() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData)).unwrap().then(() => {
      navigate("/")
      localStorage.removeItem("sessionToken") // if the guest login then we need to remove that session token
    
    });
    

  };


  return (
    <div className="login-wrapper">
      <div className="login-card">
        {/* LOGO */}
        <div className="login-brand">
          <div className="brand-icon">
            <UtensilsCrossed className="brand-icon-img" />
          </div>
          <div>
            <h2 className="brand-title">SavoryBites</h2>
            <p className="brand-subtitle">Restaurant Management</p>
          </div>
        </div>

        {/* HEADINGS */}
        <div className="login-header">
          <h1 className="heading-main">Welcome Back</h1>
          <p className="heading-sub">Sign in to access your account and rewards</p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="error-box">
            <span className="error-icon">!</span>
            <p className="error-text">{error}</p>
          </div>
        )}

        {/* FORM */}
        <form className="login-form" onSubmit={handleSubmit}>
          <label className="input-label">Email Address</label>
          <input
            type="email"
            name="email"
            onChange={handleChange}
            value={formData.email}
            className="input-field"
            placeholder="Enter your email"
            required
          />

          <label className="input-label">Password</label>
          <input
            type="password"
            name="password"
            onChange={handleChange}
            value={formData.password}
            className="input-field"
            placeholder="Enter your password"
            required
          />

          <div className="remember-forgot">
            <label className="remember-box">
              <input type="checkbox" /> Remember me
            </label>
            <a href="#" className="forgot-link">Forgot password?</a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-submit"
          >
            {loading ? (
              <>
                <Loader2 className="loader-icon" />
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className="arrow-icon" />
              </>
            )}
          </button>
        </form>

        {/* SIGNUP LINK */}
        <p className="signup-text">
          Don’t have an account?{" "}
          <Link to="/register" className="signup-link">
            Sign up <ArrowRight className="signup-arrow" />
          </Link>
        </p>
      </div>
    </div>
  );
}
