import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams
} from "react-router-dom";

import api from "../services/api.js";
import Navbar from "../components/Navbar.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import QuotationForm from "../components/QuotationForm.jsx";

const RFQDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [rfq, setRfq] = useState(null);
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRFQ = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/rfqs/${id}`);

      const fetchedRFQ = response.data.rfq;

      setRfq(fetchedRFQ);

      if (user?.role === "buyer") {
        const quotationResponse = await api.get(
          `/rfqs/${id}/quotations`
        );

        setQuotations(
          quotationResponse.data.quotations
        );
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load RFQ."
      );

      setQuotations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRFQ();
  }, [id, user?.role]);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this RFQ?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await api.delete(`/rfqs/${id}`);

      navigate("/buyer");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to delete RFQ."
      );
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

  if (error) {
    return (
      <>
        <Navbar />

        <main className="page-container">
          <div className="error-state">
            <p>{error}</p>

            <button onClick={fetchRFQ}>
              Try Again
            </button>
          </div>
        </main>
      </>
    );
  }

  if (!rfq) {
    return null;
  }

  const deadline = new Date(rfq.deadline);
  const isExpired = deadline <= new Date();

  const buyerId =
    typeof rfq.buyer === "object"
      ? rfq.buyer?._id
      : rfq.buyer;

  const isOwner = buyerId === user?.id;

  return (
    <>
      <Navbar />

      <main className="page-container">
        <Link
          to={
            user?.role === "buyer"
              ? "/buyer"
              : "/supplier"
          }
        >
          ← Back
        </Link>

        <div className="details-card">
          <div className="page-header">
            <div>
              <h1>{rfq.productName}</h1>

              <span
                className={`status ${
                  isExpired
                    ? "status-expired"
                    : `status-${rfq.status}`
                }`}
              >
                {isExpired
                  ? "expired"
                  : rfq.status}
              </span>
            </div>

            {user?.role === "buyer" &&
              isOwner &&
              !isExpired && (
                <div className="action-group">
                  <Link
                    to={`/buyer/rfqs/${rfq._id}/edit`}
                    className="primary-button"
                  >
                    Edit RFQ
                  </Link>

                  <button
                    type="button"
                    className="danger-button"
                    onClick={handleDelete}
                  >
                    Delete RFQ
                  </button>
                </div>
              )}
          </div>

          <section>
            <h2>Requirement</h2>

            <p>{rfq.description}</p>
          </section>

          <div className="details-grid">
            <div>
              <strong>Quantity</strong>
              <span>{rfq.quantity}</span>
            </div>

            <div>
              <strong>Delivery Location</strong>
              <span>
                {rfq.deliveryLocation}
              </span>
            </div>

            <div>
              <strong>Deadline</strong>
              <span>
                {deadline.toLocaleString()}
              </span>
            </div>

            <div>
              <strong>Status</strong>
              <span>
                {isExpired
                  ? "Expired"
                  : rfq.status}
              </span>
            </div>
          </div>
        </div>

        {user?.role === "buyer" &&
          isOwner && (
            <section className="quotations-section">
              <h2>Received Quotations</h2>

              {quotations.length === 0 ? (
                <div className="empty-state">
                  <p>
                    No quotations have been
                    submitted yet.
                  </p>
                </div>
              ) : (
                <div className="quotation-list">
                  {quotations.map(
                    (quotation) => (
                      <div
                        className="card"
                        key={quotation._id}
                      >
                        <h3>
                          {quotation.supplier?.name ||
                            "Supplier"}
                        </h3>

                        <p>
                          <strong>
                            Price:
                          </strong>{" "}
                          ₹
                          {quotation.quotedPrice}
                        </p>

                        <p>
                          <strong>
                            Estimated Delivery:
                          </strong>{" "}
                          {
                            quotation.estimatedDeliveryTime
                          }
                        </p>

                        {quotation.message && (
                          <p>
                            <strong>
                              Message:
                            </strong>{" "}
                            {
                              quotation.message
                            }
                          </p>
                        )}
                      </div>
                    )
                  )}
                </div>
              )}
            </section>
          )}

        {user?.role === "supplier" &&
          rfq.status === "open" &&
          !isExpired && (
            <section className="quotation-section">
              <QuotationForm
                rfqId={rfq._id}
              />
            </section>
          )}
      </main>
    </>
  );
};

export default RFQDetails;