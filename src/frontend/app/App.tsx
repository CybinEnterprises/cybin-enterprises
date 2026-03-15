import { ThemeProvider } from "@/contexts/ThemeContext";
import { usePageTracking } from "@/hooks/usePageTracking";
import ErrorBoundary from "@/components/ErrorBoundary";
import Layout from "../widgets/layout/Layout";
import { useEffect } from "react";
import { HashRouter, useNavigate } from "react-router-dom";
import { Route, Routes } from "react-router-dom";

import AboutPage from "../pages/AboutPage";
import AccessibilityPage from "../pages/AccessibilityPage";
import AdminPage from "../pages/AdminPage";
import BlogPostPage from "../pages/BlogPostPage";
import CompliancePage from "../pages/CompliancePage";
import ContactPage from "../pages/ContactPage";
import DoNotSellPage from "../pages/DoNotSellPage";
import FaqPage from "../pages/FaqPage";
import FraudDeflectPage from "../pages/FraudDeflectPage";
import HardwarePage from "../pages/HardwarePage";
import HomePage from "../pages/HomePage";
import HowItWorksPage from "../pages/HowItWorksPage";
import IndustriesPage from "../pages/IndustriesPage";
import IndustryLandingPage from "../pages/IndustryLandingPage";
import InsightsPage from "../pages/InsightsPage";
import KnowledgePage from "../pages/KnowledgePage";
import {
  CookiePolicyPage,
  PrivacyPolicyPage,
  TermsOfServicePage,
} from "../pages/LegalPage";
import PartnersPage from "../pages/PartnersPage";
import PaymentSolutionsPage from "../pages/PaymentSolutionsPage";
import PeptidesPage from "../pages/PeptidesPage";
import SolutionsEnterprisePage from "../pages/SolutionsEnterprisePage";
import SolutionsPage from "../pages/SolutionsPage";
import WizardPage from "../pages/WizardPage";
function IntegrationsRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/", { replace: true });
  }, [navigate]);
  return null;
}

function EnterpriseRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/apply?tier=enterprise", { replace: true });
  }, [navigate]);
  return null;
}

function AppRoutes() {
  usePageTracking();
  return (
    <Routes>
      {/* Standalone wizard — no Layout wrapper */}
      <Route path="/apply" element={<WizardPage />} />

      {/* Enterprise apply redirect */}
      <Route path="/apply/enterprise" element={<EnterpriseRedirect />} />

      {/* Standalone admin — no Layout wrapper */}
      <Route path="/admin" element={<AdminPage />} />

      {/* All other pages wrapped in Layout */}
      <Route
        path="/"
        element={
          <Layout>
            <HomePage />
          </Layout>
        }
      />
      <Route
        path="/payment-solutions"
        element={
          <Layout>
            <PaymentSolutionsPage />
          </Layout>
        }
      />
      <Route
        path="/industries"
        element={
          <Layout>
            <IndustriesPage />
          </Layout>
        }
      />
      <Route
        path="/industries/peptides"
        element={
          <Layout>
            <PeptidesPage />
          </Layout>
        }
      />
      <Route
        path="/industries/:slug"
        element={
          <Layout>
            <IndustryLandingPage />
          </Layout>
        }
      />
      <Route
        path="/hardware"
        element={
          <Layout>
            <HardwarePage />
          </Layout>
        }
      />
      <Route
        path="/fraud-deflect"
        element={
          <Layout>
            <FraudDeflectPage />
          </Layout>
        }
      />
      <Route
        path="/about"
        element={
          <Layout>
            <AboutPage />
          </Layout>
        }
      />
      <Route
        path="/insights"
        element={
          <Layout>
            <InsightsPage />
          </Layout>
        }
      />
      <Route
        path="/insights/:slug"
        element={
          <Layout>
            <BlogPostPage />
          </Layout>
        }
      />
      <Route
        path="/contact"
        element={
          <Layout>
            <ContactPage />
          </Layout>
        }
      />
      <Route
        path="/privacy-policy"
        element={
          <Layout>
            <PrivacyPolicyPage />
          </Layout>
        }
      />
      <Route
        path="/terms-of-service"
        element={
          <Layout>
            <TermsOfServicePage />
          </Layout>
        }
      />
      <Route
        path="/cookie-policy"
        element={
          <Layout>
            <CookiePolicyPage />
          </Layout>
        }
      />
      <Route
        path="/faq"
        element={
          <Layout>
            <FaqPage />
          </Layout>
        }
      />
      <Route
        path="/knowledge"
        element={
          <Layout>
            <KnowledgePage />
          </Layout>
        }
      />
      <Route
        path="/partners"
        element={
          <Layout>
            <PartnersPage />
          </Layout>
        }
      />
      <Route path="/integrations" element={<IntegrationsRedirect />} />
      <Route
        path="/compliance"
        element={
          <Layout>
            <CompliancePage />
          </Layout>
        }
      />
      <Route
        path="/do-not-sell"
        element={
          <Layout>
            <DoNotSellPage />
          </Layout>
        }
      />
      <Route
        path="/accessibility"
        element={
          <Layout>
            <AccessibilityPage />
          </Layout>
        }
      />
      <Route
        path="/how-it-works"
        element={
          <Layout>
            <HowItWorksPage />
          </Layout>
        }
      />
      <Route
        path="/solutions"
        element={
          <Layout>
            <SolutionsPage />
          </Layout>
        }
      />
      <Route
        path="/solutions/enterprise"
        element={
          <Layout>
            <SolutionsEnterprisePage />
          </Layout>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <HashRouter>
          <AppRoutes />
        </HashRouter>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
