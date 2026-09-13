import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api.js";
import Navbar from "../components/Navbar.jsx";
import RFQCard from "../components/RFQCard.jsx";

const SupplierDashboard = () => {
  const [rfqs, setRfqs] = useState([]);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRFQs = async (
    searchValue = search,
    locationValue = location
  ) => {
    try {
      setLoading(true);
      setError("");

      const params = {};

      if (searchValue.trim()) {
        params.search = searchValue.trim();
      }

      if (locationValue.trim()) {
        params.location = locationValue.trim();
      }

      const response = await api.get("/rfqs", {
        params
      });

      setRfqs(response.data.rfqs);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load available RFQs."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRFQs();
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();

    fetchRFQs();
  };

  const handleClear = () => {
    setSearch("");
    setLocation("");

    fetchRFQs("", "");
  };

  return (
    <>
      <Navbar />

      <main className="page-container">
        <div className="page-header">
            <Link
  to="/supplier/quotations"
  className="primary-button"
>
  My Quotations
</Link>
          <div>
            <h1>Available RFQs</h1>

            <p>
              Find opportunities and submit your
              quotations.
            </p>
          </div>
        </div>

        <form
          className="search-bar"
          onSubmit={handleSearch}
        >
          <input
            type="text"
            placeholder="Search product or service..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

          <input
            type="text"
            placeholder="Delivery location..."
            value={location}
            onChange={(event) =>
              setLocation(event.target.value)
            }
          />

          <button
            type="submit"
            className="primary-button"
            disabled={loading}
          >
            Search
          </button>

          <button
            type="button"
            onClick={handleClear}
          >
            Clear
          </button>
        </form>

        {loading && (
          <div className="state-message">
            Loading available RFQs...
          </div>
        )}

        {error && !loading && (
          <div className="error-state">
            <p>{error}</p>

            <button onClick={() => fetchRFQs()}>
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && rfqs.length === 0 && (
          <div className="empty-state">
            <h2>No RFQs found</h2>

            <p>
              There are currently no RFQs matching your
              search.
            </p>
          </div>
        )}

        {!loading && !error && rfqs.length > 0 && (
          <div className="rfq-grid">
            {rfqs.map((rfq) => (
              <RFQCard
                key={rfq._id}
                rfq={rfq}
              />
            ))}
          </div>
        )}
      </main>
    </>
  );
};

export default SupplierDashboard;