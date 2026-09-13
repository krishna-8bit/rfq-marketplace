import { Link } from "react-router-dom";

const RFQCard = ({ rfq, showActions = false }) => {
  const deadline = new Date(rfq.deadline);
  const isExpired = deadline <= new Date();

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3>{rfq.productName}</h3>

          <span
            className={`status ${
              isExpired
                ? "status-expired"
                : `status-${rfq.status}`
            }`}
          >
            {isExpired ? "Expired" : rfq.status}
          </span>
        </div>
      </div>

      <p className="description">
        {rfq.description}
      </p>

      <div className="rfq-info">
        <span>
          <strong>Quantity:</strong>{" "}
          {rfq.quantity}
        </span>

        <span>
          <strong>Location:</strong>{" "}
          {rfq.deliveryLocation}
        </span>

        <span>
          <strong>Deadline:</strong>{" "}
          {deadline.toLocaleString()}
        </span>
      </div>

      <div className="card-actions">
        <Link to={`/rfqs/${rfq._id}`}>
          View Details
        </Link>

        {showActions &&
          !isExpired &&
          rfq.status === "open" && (
            <Link
              to={`/buyer/rfqs/${rfq._id}/edit`}
            >
              Edit
            </Link>
          )}
      </div>
    </div>
  );
};

export default RFQCard;