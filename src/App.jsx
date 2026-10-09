import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layouts
import Navbar from './layouts/Navbar';
import Footer from './layouts/Footer';
import UserDashboardLayout from './layouts/UserDashboardLayout';
import AdminDashboardLayout from './layouts/AdminDashboardLayout';

// Public Pages
import HomePage from './pages/public/HomePage';
import DestinationsPage from './pages/public/DestinationsPage';
import DestinationDetailPage from './pages/public/DestinationDetailPage';
import AttractionsPage from './pages/public/AttractionsPage';
import RecommendationsPage from './pages/public/RecommendationsPage';
import AboutPage from './pages/public/AboutPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';

// User Dashboard Pages
import UserOverview from './pages/user/UserOverview';
import SmartRecommendations from './pages/user/SmartRecommendations';
import MyFavorites from './pages/user/MyFavorites';
import ItineraryBuilder from './pages/user/ItineraryBuilder';
import MyReviews from './pages/user/MyReviews';
import UserProfile from './pages/user/UserProfile';

// Admin Dashboard Pages
import AdminOverview from './pages/admin/AdminOverview';
import AdminUsers from './pages/admin/AdminUsers';
import AdminDestinations from './pages/admin/AdminDestinations';
import AdminAttractions from './pages/admin/AdminAttractions';
import AdminCategories from './pages/admin/AdminCategories';
import AdminReviews from './pages/admin/AdminReviews';
import AdminReports from './pages/admin/AdminReports';

// Public Layout Wrapper
const PublicLayout = () => (
  <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Navbar />
    <main style={{ flexGrow: 1 }}>
      <Outlet />
    </main>
    <Footer />
  </div>
);

// Protected Route Guard
const ProtectedRoute = ({ allowedRole }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRole && user?.role !== allowedRole) {
    return <Navigate to={user?.role === 'ROLE_ADMIN' ? '/admin' : '/dashboard'} replace />;
  }

  return <Outlet />;
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes with Navbar & Footer */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/destinations" element={<DestinationsPage />} />
          <Route path="/destinations/:id" element={<DestinationDetailPage />} />
          <Route path="/attractions" element={<AttractionsPage />} />
          <Route path="/recommendations" element={<RecommendationsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* User Dashboard Protected Routes */}
        <Route element={<ProtectedRoute allowedRole="ROLE_USER" />}>
          <Route path="/dashboard" element={<UserDashboardLayout />}>
            <Route index element={<UserOverview />} />
            <Route path="explore" element={<DestinationsPage />} />
            <Route path="recommendations" element={<SmartRecommendations />} />
            <Route path="favorites" element={<MyFavorites />} />
            <Route path="itineraries" element={<ItineraryBuilder />} />
            <Route path="reviews" element={<MyReviews />} />
            <Route path="profile" element={<UserProfile />} />
          </Route>
        </Route>

        {/* Admin Dashboard Protected Routes */}
        <Route element={<ProtectedRoute allowedRole="ROLE_ADMIN" />}>
          <Route path="/admin" element={<AdminDashboardLayout />}>
            <Route index element={<AdminOverview />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="destinations" element={<AdminDestinations />} />
            <Route path="attractions" element={<AdminAttractions />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="reports" element={<AdminReports />} />
          </Route>
        </Route>

        {/* Catch-all Fallback Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
