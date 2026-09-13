import { useState } from "react";

import api from "../services/api.js";

const QuotationForm = ({ rfqId, onSuccess }) => {
  const [formData, setFormData] = useState({
    quotedPrice: "",
    estimatedDeliveryTime: "",
    message: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await api.post(
        `/rfqs/${rfqId}/quotations`,
        {
          ...formData,
          quotedPrice: Number(formData.quotedPrice)
        }
      );

      setFormData({
        quotedPrice: "",
        estimatedDeliveryTime: "",
        message: ""
      });

      setSuccess(
        "Quotation submitted successfully."
      );

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      const validationErrors =
        error.response?.data?.errors;

      if (validationErrors?.length) {
        setError(validationErrors[0].msg);
      } else {
        setError(
          error.response?.data?.message ||
            "Unable to submit quotation."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container quotation-form">
      <h2>Submit Quotation</h2>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {success && (
        <div className="success-message">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="quotedPrice">
            Quoted Price
          </label>

          <input
            id="quotedPrice"
            name="quotedPrice"
            type="number"
            min="0"
            step="0.01"
            placeholder="Enter your price"
            value={formData.quotedPrice}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="estimatedDeliveryTime">
            Estimated Delivery Time
          </label>

          <input
            id="estimatedDeliveryTime"
            name="estimatedDeliveryTime"
            type="text"
            placeholder="e.g. 10 days"
            value={
              formData.estimatedDeliveryTime
            }
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="message">
            Message / Notes
          </label>

          <textarea
            id="message"
            name="message"
            rows="4"
            placeholder="Add any additional information..."
            value={formData.message}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="primary-button"
          disabled={loading}
        >
          {loading
            ? "Submitting..."
            : "Submit Quotation"}
        </button>
      </form>
    </div>
  );
};

export default QuotationForm;