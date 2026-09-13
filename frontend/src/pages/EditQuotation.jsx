import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams
} from "react-router-dom";

import api from "../services/api.js";
import Navbar from "../components/Navbar.jsx";

const EditQuotation = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quotation, setQuotation] =
    useState(null);

  const [formData, setFormData] = useState({
    quotedPrice: "",
    estimatedDeliveryTime: "",
    message: ""
  });

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const fetchQuotation = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await api.get("/quotations/my");

      const foundQuotation =
        response.data.quotations.find(
          (item) => item._id === id
        );

      if (!foundQuotation) {
        setError(
          "Quotation not found."
        );
        return;
      }

      setQuotation(foundQuotation);

      setFormData({
        quotedPrice:
          foundQuotation.quotedPrice,
        estimatedDeliveryTime:
          foundQuotation.estimatedDeliveryTime,
        message:
          foundQuotation.message || ""
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load quotation."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotation();
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

      await api.put(
        `/quotations/${id}`,
        {
          ...formData,
          quotedPrice: Number(
            formData.quotedPrice
          )
        }
      );

      navigate(
        "/supplier/quotations"
      );
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
            "Unable to update quotation."
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
            Loading quotation...
          </div>
        </main>
      </>
    );
  }

  if (error && !quotation) {
    return (
      <>
        <Navbar />

        <main className="page-container">
          <div className="error-state">
            <p>{error}</p>

            <Link
              to="/supplier/quotations"
              className="primary-button"
            >
              Back to My Quotations
            </Link>
          </div>
        </main>
      </>
    );
  }

  const rfq = quotation?.rfq;

  const isExpired =
    rfq &&
    new Date(rfq.deadline) <= new Date();

  const canEdit =
    rfq &&
    rfq.status === "open" &&
    !isExpired;

  return (
    <>
      <Navbar />

      <main className="form-page">
        <div className="form-container">
          <Link
            to="/supplier/quotations"
          >
            ← Back to My Quotations
          </Link>

          <h1>
            Edit Quotation
          </h1>

          {rfq && (
            <p className="form-description">
              Quotation for{" "}
              <strong>
                {rfq.productName}
              </strong>
            </p>
          )}

          {!canEdit ? (
            <div className="error-state">
              <p>
                This quotation can no longer
                be edited because the RFQ is
                closed or its deadline has
                passed.
              </p>
            </div>
          ) : (
            <>
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
              >
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
                    value={
                      formData.quotedPrice
                    }
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
                    rows="5"
                    value={
                      formData.message
                    }
                    onChange={handleChange}
                  />
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        "/supplier/quotations"
                      )
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
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default EditQuotation;