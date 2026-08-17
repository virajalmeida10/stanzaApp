import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import SearchResultsPage from './pages/SearchResultsPage';
import HotelDetailPage from './pages/HotelDetailPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import BookingFlowPage from './pages/BookingFlowPage';
import PaymentStatusPage from './pages/PaymentStatusPage';
import MyBookingsPage from './pages/MyBookingsPage';
import ProfilePage from './pages/ProfilePage';
import OfferDealPage from './pages/OfferDealPage';
import InfoPage from './pages/InfoPage';

export default function App() {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchResultsPage />} />
                <Route path="/hotels/:hotelId" element={<HotelDetailPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/book" element={<ProtectedRoute><BookingFlowPage /></ProtectedRoute>} />
                <Route path="/payments/:bookingId/status" element={<ProtectedRoute><PaymentStatusPage /></ProtectedRoute>} />
                <Route path="/my-bookings" element={<ProtectedRoute><MyBookingsPage /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="/offers/:code" element={<OfferDealPage />} />

                {/* Footer / info pages */}
                <Route path="/about" element={<InfoPage slug="about" />} />
                <Route path="/careers" element={<InfoPage slug="careers" />} />
                <Route path="/contact" element={<InfoPage slug="contact" />} />
                <Route path="/help" element={<InfoPage slug="help" />} />
                <Route path="/cancellation" element={<InfoPage slug="cancellation" />} />
                <Route path="/safety" element={<InfoPage slug="safety" />} />
                <Route path="/terms" element={<InfoPage slug="terms" />} />
                <Route path="/privacy" element={<InfoPage slug="privacy" />} />
                <Route path="/cookies" element={<InfoPage slug="cookies" />} />
            </Routes>
        </Layout>
    );
}