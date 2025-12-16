import { Routes, Route, Navigate } from "react-router-dom";

import Welcome from "./pages/Welcome";
import Dashboard from "./pages/Dashboard";
import Parties from "./pages/Parties";
import PartyDetails from "./pages/PartyDetails";
import ScanBill from "./pages/ScanBill";
import CreateInvoice from "./pages/CreateInvoice";
import Purchases from "./pages/Purchases";
import SupplierBills from "./pages/SupplierBills";
import AddPurchaseBill from "./pages/AddPurchaseBill";
import UploadBill from "./pages/UploadBill";
import InvoiceDetails from "./pages/InvoiceDetails";
import Settings from "./pages/Settings";

import AppLayout from "./layouts/AppLayout";

/* ---------- AUTH HELPERS ---------- */

const isLoggedIn = () => {
  const auth = JSON.parse(localStorage.getItem("auth_user"));
  return auth?.isVerified;
};

const hasBusinessProfile = () => {
  return !!localStorage.getItem("business_profile");
};

/* ---------- PROTECTED ROUTE ---------- */

function Protected({ children }) {
  if (!isLoggedIn()) return <Navigate to="/welcome" replace />;
  if (!hasBusinessProfile()) return <Navigate to="/welcome" replace />;
  return children;
}

/* ---------- APP ---------- */

export default function App() {
  return (
    <Routes>
      {/* AUTH */}
      <Route path="/welcome" element={<Welcome />} />

      {/* DASHBOARD */}
      <Route
        path="/dashboard"
        element={
          <Protected>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </Protected>
        }
      />

      {/* PARTIES */}
      <Route
        path="/parties"
        element={
          <Protected>
            <AppLayout>
              <Parties />
            </AppLayout>
          </Protected>
        }
      />

      <Route
        path="/parties/:id"
        element={
          <Protected>
            <AppLayout>
              <PartyDetails />
            </AppLayout>
          </Protected>
        }
      />

      {/* INVOICE DETAILS */}
      <Route
        path="/invoice/:invoiceId"
        element={
          <Protected>
            <AppLayout>
              <InvoiceDetails />
            </AppLayout>
          </Protected>
        }
      />

      {/* PURCHASES */}
      <Route
        path="/purchases"
        element={
          <Protected>
            <AppLayout>
              <Purchases />
            </AppLayout>
          </Protected>
        }
      />

      <Route
        path="/purchases/:supplier"
        element={
          <Protected>
            <AppLayout>
              <SupplierBills />
            </AppLayout>
          </Protected>
        }
      />

      <Route
        path="/purchases/add"
        element={
          <Protected>
            <AppLayout>
              <AddPurchaseBill />
            </AppLayout>
          </Protected>
        }
      />

      {/* SCAN & CREATE */}
      <Route
        path="/scan-bill"
        element={
          <Protected>
            <AppLayout>
              <ScanBill />
            </AppLayout>
          </Protected>
        }
      />

      <Route
        path="/create-invoice"
        element={
          <Protected>
            <AppLayout>
              <CreateInvoice />
            </AppLayout>
          </Protected>
        }
      />

      {/* ✅ UPLOAD BILL (FIXED) */}
      <Route
        path="/upload/:type"
        element={
          <Protected>
            <AppLayout>
              <UploadBill />
            </AppLayout>
          </Protected>
        }
      />

      {/* SETTINGS */}
      <Route
        path="/settings"
        element={
          <Protected>
            <AppLayout>
              <Settings />
            </AppLayout>
          </Protected>
        }
      />

      {/* DEFAULT */}
      <Route path="*" element={<Navigate to="/welcome" replace />} />
    </Routes>
  );
}
