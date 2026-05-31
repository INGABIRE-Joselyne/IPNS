import React from 'react'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import useRouter from './hooks/useRouter'
import Layout from './components/Layout'
import BackButton from './components/BackButton'

// Public Pages
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'
import Unauthorized from './pages/Unauthorized'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'

// Pharmacist Dashboard Pages
import Dashboard from './pages/Dashboard'
import PharmacyDashboard from './pages/PharmacyDashboard'
import Inventory from './pages/Inventory'
import PharmacyProfile from './pages/PharmacyProfile'
import InventoryDetail from './pages/InventoryDetail'
import PharmacistSettings from './pages/PharmacistSettings'

// Admin Pages
import AdminDashboard from './pages/AdminDashboard'
import AdminUserManagement from './pages/AdminUserManagement'
import MedicineManagement from './pages/MedicineManagement'
import InsuranceManagement from './pages/InsuranceManagement'
import Reports from './pages/Reports'
import AdminPharmacyManagement from './pages/AdminPharmacyManagement'
import AdminInventoryOverview from './pages/AdminInventoryOverview'
import AdminMedicineCategories from './pages/AdminMedicineCategories'

// Patient Pages
import PharmacyFinder from './pages/PharmacyFinder'
import PharmacyDetails from './pages/PharmacyDetails'
import MedicineSearch from './pages/MedicineSearch'
import About from './pages/About'
import Contact from './pages/Contact'
import FAQ from './pages/FAQ'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'

const AppContent = () => {
  const currentPage = useRouter()

  const renderPublicPage = () => {
    switch (currentPage) {
      case '/':
        return <Landing />
      case '/login':
        return <Login />
      case '/register':
        return <Register />
      case '/forgot-password':
        return <ForgotPassword />
      case '/reset-password':
        return <ResetPassword />
      case '/unauthorized':
        return <Unauthorized />
      case '/404':
      default:
        return <NotFound />
    }
  }

  const renderPharmacistPage = () => {
    switch (currentPage) {
      case '/dashboard':
        return (
          <ProtectedRoute requiredRole="pharmacist">
            <PharmacyDashboard />
          </ProtectedRoute>
        )
      case '/inventory':
        return (
          <ProtectedRoute requiredRole="pharmacist">
            <Inventory />
          </ProtectedRoute>
        )
      case '/inventory-detail':
        return (
          <ProtectedRoute requiredRole="pharmacist">
            <InventoryDetail />
          </ProtectedRoute>
        )
      case '/pharmacy-profile':
        return (
          <ProtectedRoute requiredRole="pharmacist">
            <PharmacyProfile />
          </ProtectedRoute>
        )
      case '/settings':
        return (
          <ProtectedRoute>
            <PharmacistSettings />
          </ProtectedRoute>
        )
      default:
        return <NotFound />
    }
  }

  const renderAdminPage = () => {
    switch (currentPage) {
      case '/admin':
      case '/admin/dashboard':
        return (
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        )
      case '/admin/pharmacies':
        return (
          <ProtectedRoute requiredRole="admin">
            <AdminPharmacyManagement />
          </ProtectedRoute>
        )
      case '/admin/inventory':
        return (
          <ProtectedRoute requiredRole="admin">
            <AdminInventoryOverview />
          </ProtectedRoute>
        )
      case '/admin/categories':
        return (
          <ProtectedRoute requiredRole="admin">
            <AdminMedicineCategories />
          </ProtectedRoute>
        )
      case '/admin/users':
        return (
          <ProtectedRoute requiredRole="admin">
            <AdminUserManagement />
          </ProtectedRoute>
        )
      case '/admin/medicines':
        return (
          <ProtectedRoute requiredRole="admin">
            <MedicineManagement />
          </ProtectedRoute>
        )
      case '/admin/insurance':
        return (
          <ProtectedRoute requiredRole="admin">
            <InsuranceManagement />
          </ProtectedRoute>
        )
      case '/reports':
        return (
          <ProtectedRoute requiredRole="admin">
            <Reports />
          </ProtectedRoute>
        )
      default:
        return <NotFound />
    }
  }

  if (['/login', '/register', '/unauthorized', '/404', '/forgot-password', '/reset-password'].includes(currentPage)) {
    return renderPublicPage()
  }

  if (
    currentPage.startsWith('/dashboard') ||
    currentPage.startsWith('/inventory') ||
    currentPage.startsWith('/pharmacy-profile') ||
    currentPage === '/settings'
  ) {
    return renderPharmacistPage()
  }

  if (
    currentPage === '/admin' ||
    currentPage.startsWith('/admin/') ||
    currentPage === '/reports'
  ) {
    return renderAdminPage()
  }

  return (
    <Layout>
      {['/', '/pharmacies', '/medicines', '/about', '/contact', '/faq', '/privacy-policy', '/terms'].includes(currentPage) ? (
        currentPage === '/' ? (
          <Landing />
        ) : currentPage === '/pharmacies' ? (
          <PharmacyFinder />
        ) : currentPage === '/medicines' ? (
          <MedicineSearch />
        ) : currentPage === '/about' ? (
          <About />
        ) : currentPage === '/contact' ? (
          <Contact />
        ) : currentPage === '/faq' ? (
          <FAQ />
        ) : currentPage === '/privacy-policy' ? (
          <PrivacyPolicy />
        ) : (
          <TermsOfService />
        )
      ) : currentPage.startsWith('/pharmacies/') ? (
        <PharmacyDetails pharmacyId={currentPage.split('/')[2]} />
      ) : (
        <NotFound />
      )}
    </Layout>
  )
}

const App = () => {
  return (
    <AuthProvider>
      <BackButton />
      <AppContent />
    </AuthProvider>
  )
}

export default App