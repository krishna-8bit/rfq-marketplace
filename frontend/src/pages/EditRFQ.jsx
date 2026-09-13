import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../services/api.js";
import Navbar from "../components/Navbar.jsx";

const EditRFQ = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    quantity: "",
    deliveryLocation: "",
    deadline: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchRFQ = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/rfqs/${id}`);

      const rfq = response.data.rfq;

      setFormData({
        productName: rfq.productName,
        description: rfq.description,
        quantity: rfq.quantity,
        deliveryLocation: rfq.deliveryLocation,
        deadline: new Date(rfq.deadline)
          .toISOString()
          .slice(0, 16)
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load RFQ."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRFQ();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      await api.put(`/rfqs/${id}`, {
        ...formData,
        quantity: Number(formData.quantity)
      });

      navigate(`/rfqs/${id}`);
    } catch (error) {
      const validationErrors =
        error.response?.data?.errors;

      if (validationErrors?.length) {
        setError(validationErrors[0].msg);
      } else {
        setError(
          error.response?.data?.message ||
            "Unable to update RFQ."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="page-container">
          <div className="state-message">
            Loading RFQ...
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="form-page">
        <div className="form-container">
          <h1>Edit RFQ</h1>

          <p className="form-description">
            Update the requirements for your RFQ.
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
                onClick={() =>
                  navigate(`/rfqs/${id}`)
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-button"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default EditRFQ;