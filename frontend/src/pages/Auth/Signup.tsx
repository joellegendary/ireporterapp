import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Auth.css";

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({
    firstname: false,
    lastname: false,
    email: false,
    phoneNumber: false,
    password: false,
    confirmPassword: false,
  });

  const { signup } = useAuth(); // returns AuthResponse
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const validateForm = () => {
    const errors: string[] = [];
    if (!formData.firstname.trim()) errors.push("First name is required");
    if (!formData.lastname.trim()) errors.push("Last name is required");
    if (!formData.email.trim()) errors.push("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) errors.push("Email is invalid");
    if (!formData.phoneNumber.trim()) errors.push("Phone number is required");
    if (formData.password.length < 6)
      errors.push("Password must be at least 6 characters");
    if (formData.password !== formData.confirmPassword)
      errors.push("Passwords do not match");
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const errors = validateForm();
    if (errors.length > 0) {
      setError(errors[0]);
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...userData } = formData;

      const completeUserData = {
        ...userData,
        othernames: "",
        username: userData.email.split("@")[0],
      };

      const response = await signup(completeUserData);

      if (response.success && response.user) {
        if (response.user.isAdmin) {
          navigate("/admin", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      } else {
        setError(response.message || "Account could not be created.");
      }
    } catch (err) {
      setError("Unable to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getFieldError = (fieldName: keyof typeof formData) => {
    if (!touched[fieldName]) return "";

    const value = formData[fieldName];
    switch (fieldName) {
      case "firstname":
      case "lastname":
        return !value.trim() ? "This field is required" : "";
      case "email":
        if (!value.trim()) return "Email is required";
        if (!/\S+@\S+\.\S+/.test(value)) return "Enter a valid email address";
        return "";
      case "phoneNumber":
        return !value.trim() ? "Phone number is required" : "";
      case "password":
        if (!value) return "Password is required";
        if (value.length < 6) return "Minimum 6 characters required";
        return "";
      case "confirmPassword":
        if (!value) return "Please confirm your password";
        if (value !== formData.password) return "Passwords do not match";
        return "";
      default:
        return "";
    }
  };

  const isFieldInvalid = (fieldName: keyof typeof formData) => {
    return touched[fieldName] && !!getFieldError(fieldName);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo">iReporter</div>
        </div>

        <div className="auth-content">
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">
            Join our community dedicated to fighting corruption
          </p>

          {error && <div className="error-message">⚠ {error}</div>}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstname">First Name *</label>
                <input
                  id="firstname"
                  type="text"
                  name="firstname"
                  className={`form-input ${isFieldInvalid("firstname") ? "error" : ""}`}
                  value={formData.firstname}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                {isFieldInvalid("firstname") && (
                  <span className="field-error">
                    {getFieldError("firstname")}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="lastname">Last Name *</label>
                <input
                  id="lastname"
                  type="text"
                  name="lastname"
                  className={`form-input ${isFieldInvalid("lastname") ? "error" : ""}`}
                  value={formData.lastname}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                {isFieldInvalid("lastname") && (
                  <span className="field-error">
                    {getFieldError("lastname")}
                  </span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                id="email"
                type="email"
                name="email"
                className={`form-input ${isFieldInvalid("email") ? "error" : ""}`}
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
              {isFieldInvalid("email") && (
                <span className="field-error">{getFieldError("email")}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number *</label>
              <input
                id="phoneNumber"
                type="tel"
                name="phoneNumber"
                className={`form-input ${isFieldInvalid("phoneNumber") ? "error" : ""}`}
                value={formData.phoneNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
              {isFieldInvalid("phoneNumber") && (
                <span className="field-error">
                  {getFieldError("phoneNumber")}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <input
                id="password"
                type="password"
                name="password"
                className={`form-input ${isFieldInvalid("password") ? "error" : ""}`}
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
              {isFieldInvalid("password") && (
                <span className="field-error">{getFieldError("password")}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password *</label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                className={`form-input ${isFieldInvalid("confirmPassword") ? "error" : ""}`}
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
              {isFieldInvalid("confirmPassword") && (
                <span className="field-error">
                  {getFieldError("confirmPassword")}
                </span>
              )}
            </div>

            <button
              type="submit"
              className={`btn btn-primary ${loading ? "loading" : ""}`}
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="auth-link">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
