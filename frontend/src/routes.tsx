import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/home/LandingPage";
import NotFound from "./pages/home/NotFound";

import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";

import UserDashboard from "./pages/dashboard/UserDashboard";
import CompanyDashboard from "./pages/dashboard/CompanyDashboard";

import AboutPage from "./components/AboutPage";

import ProtectedRoute from "./components/ProtectedRoute";

import UserProfile from "./pages/profile/UserProfile";
import CompanyProfile from "./pages/profile/CompanyProfile";

import SubscriptionPage from "./pages/subscription/SubscriptionPage";
import UsagePage from "./pages/usage/UsagePage";
import CapturePaymentPage from "./pages/payment/CapturePaymentPage";
import CaptureInvoicePage from "./pages/invoice/CaptureInvoicePage";
import DataPage from "./pages/data/DataPage";
import CaptureRequestPage from "./pages/data/CaptureRequestPage";
import AddonPage from "./pages/addon/AddonPage";
import SupportPage from "./pages/support/SupportPage";
import CapturePaymentsDetailsPage from "./pages/payment/CapturePaymentsDetailsPage";
import CaptureInvoicesDetailsPage from "./pages/invoice/CaptureInvoicesDetailsPage";


/* ✅ IMPORT SCROLL */
import ScrollToTop from "./components/ScrollToTop";

export default function AppRoutes() {
  return (
    <BrowserRouter>

      {/* ✅ CORRECT POSITION */}
      <ScrollToTop />

      <Routes>

        {/* LANDING */}
        <Route path="/" element={<LandingPage />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ABOUT */}
        <Route path="/about" element={<AboutPage />} />

        {/* PERSONAL */}
        <Route
          path="/puser-dashboard"
          element={
            <ProtectedRoute role="personal">
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/profile"
          element={
            <ProtectedRoute role="personal">
              <UserProfile />
            </ProtectedRoute>
          }
        />

        {/* COMPANY */}
        <Route
          path="/cuser-dashboard"
          element={
            <ProtectedRoute role="company">
              <CompanyDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/company/profile"
          element={
            <ProtectedRoute role="company">
              <CompanyProfile />
            </ProtectedRoute>
          }
        />

        {/* SHARED */}
        <Route
          path="/subscription"
          element={
            <ProtectedRoute role={["personal", "company"]}>
              <SubscriptionPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/data"
          element={
            <ProtectedRoute role={["personal", "company"]}>
              <DataPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/capture-request"
          element={
            <ProtectedRoute role={["personal", "company"]}>
              <CaptureRequestPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/usage"
          element={
            <ProtectedRoute role={["personal", "company"]}>
              <UsagePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/addon"
          element={
            <ProtectedRoute role={["personal", "company"]}>
              <AddonPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/support"
          element={
            <ProtectedRoute>
              <SupportPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment"
          element={
            <ProtectedRoute role={["personal", "company"]}>
              <CapturePaymentPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/capture-invoice/:invoiceId"
          element={
            <ProtectedRoute role={["personal", "company"]}>
              <CaptureInvoicePage  />
            </ProtectedRoute>
          }
        />

        <Route
  path="/capture-payments"
  element={
    <ProtectedRoute role={["personal", "company"]}>
      <CapturePaymentsDetailsPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/capture-invoices"
  element={
    <ProtectedRoute role={["personal", "company"]}>
      <CaptureInvoicesDetailsPage />
    </ProtectedRoute>
  }
/>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}