import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Auth.css";

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    othernames: "",
    email: "",
    phone: "",
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await signup(formData);

      if (!response || !response.success) {
        alert(response?.message || "Signup failed.");
        setLoading(false);
        return;
      }

      alert("Account created successfully!");
      navigate("/login", { replace: true });
    } catch (err) {
      alert("Could not connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo">iReporter</div>
          <div className="logo-subtitle">Fighting Corruption Together</div>
        </div>

        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join the community</p>

        <form onSubmit={handleSubmit} className="auth-form">
          {/* FIRSTNAME */}
          <div className="form-group">
            <label className="form-label">First Name</label>
            <input
              type="text"
              name="firstname"
              className="form-input"
              placeholder="Enter first name"
              disabled={loading}
              value={formData.firstname}
              onChange={handleChange}
              required
            />
          </div>

          {/* LASTNAME */}
          <div className="form-group">
            <label className="form-label">Last Name</label>
            <input
              type="text"
              name="lastname"
              className="form-input"
              placeholder="Enter last name"
              disabled={loading}
              value={formData.lastname}
              onChange={handleChange}
              required
            />
          </div>

          {/* OTHER NAMES */}
          <div className="form-group">
            <label className="form-label">Other Names</label>
            <input
              type="text"
              name="othernames"
              className="form-input"
              placeholder="Middle or other names"
              disabled={loading}
              value={formData.othernames}
              onChange={handleChange}
            />
          </div>

          {/* EMAIL */}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="Enter your email"
              disabled={loading}
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* PHONE */}
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="text"
              name="phone"
              className="form-input"
              placeholder="Enter phone number"
              disabled={loading}
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          {/* USERNAME */}
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              name="username"
              className="form-input"
              placeholder="Choose a username"
              disabled={loading}
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="Create a password"
              disabled={loading}
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
