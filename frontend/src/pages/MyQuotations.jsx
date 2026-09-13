import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../services/api.js";
import Navbar from "../components/Navbar.jsx";

const MyQuotations = () => {
  const [quotations, setQuotations] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const fetchQuotations = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await api.get("/quotations/my");

      setQuotations(
        response.data.quotations
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load your quotations."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  return (
    <>
      <Navbar />

      <main className="page-container">
        <div className="page-header">
          <div>
            <h1>My Quotations</h1>

            <p>
              View and manage quotations
              you have submitted.
            </p>
          </div>

          <Link
            to="/supplier"
            className="primary-button"
          >
            Browse RFQs
          </Link>
        </div>

        {loading && (
          <div className="state-message">
            Loading your quotations...
          </div>
        )}

        {error && !loading && (
          <div className="error-state">
            <p>{error}</p>

            <button
              onClick={fetchQuotations}
            >
              Try Again
            </button>
          </div>
        )}

        {!loading &&
          !error &&
          quotations.length === 0 && (
            <div className="empty-state">
              <h2>
                No quotations yet
              </h2>

              <p>
                You haven't submitted any
                quotations.
              </p>

              <Link
                to="/supplier"
                className="primary-button"
              >
                Browse Available RFQs
              </Link>
            </div>
          )}

        {!loading &&
          !error &&
          quotations.length > 0 && (
            <div className="quotation-list">
              {quotations.map(
                (quotation) => {
                  const rfq =
                    quotation.rfq;

                  const isExpired =
                    rfq &&
                    new Date(
                      rfq.deadline
                    ) <= new Date();

                  const canEdit =
                    rfq &&
                    rfq.status === "open" &&
                    !isExpired;

                  return (
                    <div
                      className="card"
                      key={quotation._id}
                    >
                      <div className="card-header">
                        <div>
                          <h3>
                            {rfq?.productName ||
                              "RFQ"}
                          </h3>

                          {rfq && (
                            <span
                              className={`status ${
                                isExpired
                                  ? "status-expired"
                                  : `status-${rfq.status}`
                              }`}
                            >
                              {isExpired
                                ? "Expired"
                                : rfq.status}
                            </span>
                          )}
                        </div>

                        {canEdit && (
                          <Link
                            to={`/supplier/quotations/${quotation._id}/edit`}
                            className="primary-button"
                          >
                            Edit
                          </Link>
                        )}
                      </div>

                      {rfq && (
                        <>
                          <p>
                            <strong>
                              Quantity:
                            </strong>{" "}
                            {rfq.quantity}
                          </p>

                          <p>
                            <strong>
                              Delivery Location:
                            </strong>{" "}
                            {
                              rfq.deliveryLocation
                            }
                          </p>

                          <p>
                            <strong>
                              RFQ Deadline:
                            </strong>{" "}
                            {new Date(
                              rfq.deadline
                            ).toLocaleString()}
                          </p>

                          <Link
                            to={`/rfqs/${rfq._id}`}
                          >
                            View RFQ
                          </Link>
                        </>
                      )}

                      <hr />

                      <p>
                        <strong>
                          Your Quoted Price:
                        </strong>{" "}
                        ₹
                        {
                          quotation.quotedPrice
                        }
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
                            Your Message:
                          </strong>{" "}
                          {
                            quotation.message
                          }
                        </p>
                      )}
                    </div>
                  );
                }
              )}
            </div>
          )}
      </main>
    </>
  );
};

export default MyQuotations;