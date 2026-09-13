import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          RFQ Marketplace
        </Link>

        {user && (
          <div className="navbar-right">
            <div className="user-info">
              <span className="user-name">
                {user.name}
              </span>

              <span className="user-role">
                {user.role}
              </span>
            </div>

            {user.role === "buyer" && (
              <Link to="/buyer">
                Dashboard
              </Link>
            )}

            {user.role === "supplier" && (
              <>
                <Link to="/supplier">
                  Browse RFQs
                </Link>

                <Link to="/supplier/quotations">
                  My Quotations
                </Link>
              </>
            )}

            <button
              type="button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;