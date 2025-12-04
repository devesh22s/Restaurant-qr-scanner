import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { register } from "../redux/authSlice";
import {
  UserPlus,
  ArrowRight,
  Sparkles,
  Gift,
  Award,
  Percent,
} from "lucide-react";


export default function Register() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    email: "",  
    password: "",
    contact: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleConfirmPasswordChange = (e) =>
    setConfirmPassword(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    dispatch(register(formData));

  };

  return (
    <div className="register-wrapper">
      {/* Registration Form */}
      <form className="register-form" onSubmit={handleSubmit}>
        <h1 className="register-title">Create Account</h1>
        <p className="register-subtitle">
          Join us and start earning rewards today
        </p>

        <label className="register-label">Full Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="register-input"
          placeholder="Enter full name"
          required
        />

        <label className="register-label">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="register-input"
          placeholder="example@email.com"
          required
        />
        <label className="register-label">Contact</label>
        <input
          type="text"
          name="contact"
          value={formData.contact}
          onChange={handleChange}
          className="register-input"
          placeholder="9876543210"
          required
        />

        <label className="register-label">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="register-input"
          placeholder="Enter password"
          required
        />

        <label className="register-label">Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          className="register-input"
          placeholder="Confirm password"
          required
        />

        

        <div>
          <input type="checkbox" id="terms" />
          <label htmlFor="terms" className="register-terms">
            I agree to the{" "}
            <a href="#">Terms</a> and <a href="#">Privacy Policy</a>
          </label>
        </div>

        <button type="submit" className="register-submit">
          <UserPlus className="w-5 h-5" />
          <span>Create Account</span>
        </button>

        <div className="register-footer">
          Already have an account?{" "}
          <Link to="/login">
            Sign in <ArrowRight className="w-4 h-4 inline" />
          </Link>
        </div>
      </form>
      

      {/* Benefits */}
      <div className="register-benefits">
        <div className="register-benefit-card">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <h3>New Member Benefits</h3>
          </div>
          <p>20% Welcome Discount on your first order</p>
        </div>

        <div className="register-benefit-card">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-400" />
            <h3>Loyalty Points Program</h3>
          </div>
          <p>Earn points on every order and redeem for discounts.</p>
        </div>

        <div className="register-benefit-card">
          <div className="flex items-center gap-2">
            <Percent className="w-5 h-5 text-yellow-400" />
            <h3>Membership Tiers</h3>
          </div>
          <p>Bronze, Silver, and Gold memberships with exclusive perks.</p>
        </div>
      </div>
    </div>
  );
}
