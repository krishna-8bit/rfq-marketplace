import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../services/api.js";
import Navbar from "../components/Navbar.jsx";
import RFQCard from "../components/RFQCard.jsx";

const BuyerDashboard = () => {
  const [rfqs, setRfqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRFQs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/rfqs/my");

      setRfqs(response.data.rfqs);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load your RFQs."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRFQs();
  }, []);

  return (
    <>
      <Navbar />

      <main className="page-container">
        <div className="page-header">
          <div>
            <h1>Buyer Dashboard</h1>

            <p>
              Create and manage your requests for
              quotation.
            </p>
          </div>

          <Link
            to="/buyer/rfqs/new"
            className="primary-button"
          >
            + Create RFQ
          </Link>
        </div>

        {loading && (
          <div className="state-message">
            Loading your RFQs...
          </div>
        )}

        {error && !loading && (
          <div className="error-state">
            <p>{error}</p>

            <button onClick={fetchRFQs}>
              Try Again
            </button>
          </div>
        )}

        {!loading &&
          !error &&
          rfqs.length === 0 && (
            <div className="empty-state">
              <h2>No RFQs yet</h2>

              <p>
                Create your first RFQ to start
                receiving quotations from suppliers.
              </p>

              <Link
                to="/buyer/rfqs/new"
                className="primary-button"
              >
                Create Your First RFQ
              </Link>
            </div>
          )}

        {!loading &&
          !error &&
          rfqs.length > 0 && (
            <div className="rfq-grid">
              {rfqs.map((rfq) => (
                <RFQCard
                  key={rfq._id}
                  rfq={rfq}
                  showActions
                />
              ))}
            </div>
          )}
      </main>
    </>
  );
};

export default BuyerDashboard;