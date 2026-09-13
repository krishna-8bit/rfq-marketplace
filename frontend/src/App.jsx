import { Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";

import BuyerDashboard from "./pages/BuyerDashboard.jsx";
import SupplierDashboard from "./pages/SupplierDashboard.jsx";

import CreateRFQ from "./pages/CreateRFQ.jsx";
import EditRFQ from "./pages/EditRFQ.jsx";
import RFQDetails from "./pages/RFQDetails.jsx";
import MyQuotations from "./pages/MyQuotations.jsx";
import EditQuotation from "./pages/EditQuotation.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";

const App = () => {
  return (
    <Routes>
      {/* Public routes */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/signup"
        element={<Signup />}
      />

      {/* Buyer routes */}

      <Route
        path="/buyer"
        element={
          <ProtectedRoute allowedRole="buyer">
            <BuyerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/buyer/rfqs/new"
        element={
          <ProtectedRoute allowedRole="buyer">
            <CreateRFQ />
          </ProtectedRoute>
        }
      />

      <Route
        path="/buyer/rfqs/:id/edit"
        element={
          <ProtectedRoute allowedRole="buyer">
            <EditRFQ />
          </ProtectedRoute>
        }
      />

      {/* Supplier routes */}

      <Route
        path="/supplier"
        element={
          <ProtectedRoute allowedRole="supplier">
            <SupplierDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/supplier/quotations"
        element={
          <ProtectedRoute allowedRole="supplier">
            <MyQuotations />
          </ProtectedRoute>
        }
      />

      <Route
        path="/supplier/quotations/:id/edit"
        element={
          <ProtectedRoute allowedRole="supplier">
            <EditQuotation />
          </ProtectedRoute>
        }
      />

      {/* Shared authenticated route */}

      <Route
        path="/rfqs/:id"
        element={
          <ProtectedRoute>
            <RFQDetails />
          </ProtectedRoute>
        }
      />

      {/* Default routes */}

      <Route
        path="/"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />

      <Route
        path="*"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />
    </Routes>
  );
};

export default App;