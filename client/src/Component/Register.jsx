import React from "react";
import { useState } from "react";

export default function Register() {
    const {formData, setFormData} = useState({
        fullname: "",
        email:"",
        password: "",
        contact: ""
    })
      const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e)=>{
    e.preventDefault()

    const res = await fetch("http://localhost:3000/api/auth/register",{
        method:"POST",
        headers: { "Content-Type": "application/json" },
         body: JSON.stringify(formData)

    })
    const data = await res.json();
    console.log("all data is ", data);
    

  }
  return (
    <div className="form-wrapper">
      <form className="p-4" onSubmit={handleSubmit}>
        <h2 className="form-title">Registration Form</h2>

        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            name="fullName"
            onChange={handleChange}
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
            onChange={handleChange}
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
                        onChange={handleChange}

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
                        onChange={handleChange}

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
    <a href="/Login"><button type="submit" class="btn-submit">Login</button></a>

    </div>
  );
}
