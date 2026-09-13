import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "buyer"
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await api.post(
        "/auth/signup",
        formData
      );

      const response = await api.post(
        "/auth/login",
        {
          email: formData.email,
          password: formData.password
        }
      );

      login(
        response.data.user,
        response.data.token
      );

      if (
        response.data.user.role === "buyer"
      ) {
        navigate("/buyer");
      } else {
        navigate("/supplier");
      }
    } catch (error) {
      const validationErrors =
        error.response?.data?.errors;

      if (validationErrors?.length) {
        setError(
          validationErrors[0].msg
        );
      } else {
        setError(
          error.response?.data?.message ||
            "Unable to create account."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-container">
        <h1>Create account</h1>

        <p>
          Join the RFQ marketplace as a buyer
          or supplier.
        </p>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">
              Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">
              Account Type
            </label>

            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="buyer">
                Buyer
              </option>

              <option value="supplier">
                Supplier
              </option>
            </select>
          </div>

          <button
            type="submit"
            className="primary-button"
            disabled={loading}
            style={{ width: "100%" }}
          >
            {loading
              ? "Creating account..."
              : "Create Account"}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{" "}
          <Link to="/login">
            Login
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Signup;