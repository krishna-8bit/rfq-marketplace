import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api.js";
import Navbar from "../components/Navbar.jsx";

const CreateRFQ = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    quantity: "",
    deliveryLocation: "",
    deadline: ""
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
      await api.post("/rfqs", {
        ...formData,
        quantity: Number(formData.quantity)
      });

      navigate("/buyer");
    } catch (error) {
      const validationErrors =
        error.response?.data?.errors;

      if (validationErrors?.length) {
        setError(validationErrors[0].msg);
      } else {
        setError(
          error.response?.data?.message ||
            "Unable to create RFQ."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="form-page">
        <div className="form-container">
          <h1>Create RFQ</h1>

          <p className="form-description">
            Provide the requirements suppliers need to
            submit accurate quotations.
          </p>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="productName">
                Product or Service Name
              </label>

              <input
                id="productName"
                name="productName"
                type="text"
                value={formData.productName}
                onChange={handleChange}
                placeholder="e.g. Steel Pipes"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">
                Requirement Description
              </label>

              <textarea
                id="description"
                name="description"
                rows="5"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your requirements..."
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="quantity">
                Quantity
              </label>

              <input
                id="quantity"
                name="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="deliveryLocation">
                Delivery Location
              </label>

              <input
                id="deliveryLocation"
                name="deliveryLocation"
                type="text"
                value={formData.deliveryLocation}
                onChange={handleChange}
                placeholder="e.g. Visakhapatnam"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="deadline">
                RFQ Deadline
              </label>

              <input
                id="deadline"
                name="deadline"
                type="datetime-local"
                value={formData.deadline}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate("/buyer")}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-button"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create RFQ"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default CreateRFQ;