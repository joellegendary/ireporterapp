// src/pages/Auth/Login.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import "./Auth.css";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.email || !formData.password) {
      toast.error("Please fill all fields.");
      setLoading(false);
      return;
    }

    try {
      const response = await login(formData.email, formData.password);

      if (!response) {
        toast.error("Unable to connect to server.");
        return;
      }

      if (!response.success) {
        toast.error(response.message || "Invalid email or password.");
        return;
      }

      const role = response.user?.role?.toLowerCase();

      // ⭐ No UI changes — just swapped alerts for toast
      if (role === "admin") {
        toast.success("Admin login successful!");
        navigate("/admin", { replace: true });
      } else {
        toast.success("Login successful!");
        navigate("/dashboard", { replace: true });
      }
    } catch (error) {
      toast.error("Server error. Please try again.");
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

        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Sign in to continue</p>

        <form onSubmit={handleSubmit} className="auth-form">
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

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="Enter your password"
              disabled={loading}
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Signing In..." : "Login"}
          </button>
        </form>

        <div className="auth-footer">
          Don’t have an account?{" "}
          <Link to="/signup" className="auth-link">
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
