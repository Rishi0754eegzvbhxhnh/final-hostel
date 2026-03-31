import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import RoomView from './pages/RoomView';
import Payment from './pages/Payment';
import Complaints from './pages/Complaints';
import AdminDashboard from './pages/AdminDashboard';
import AdminSignup from './pages/AdminSignup';
import AriaAssistant from './components/AriaAssistant';
import BrowseRooms from './pages/BrowseRooms';
import ARTour from './pages/ARTour';
import DigitalTwin from './pages/DigitalTwin';
import RoommateMatcher from './pages/RoommateMatcher';
import StudyPods from './pages/StudyPods';
import SmartLiving from './pages/SmartLiving';
import Gamification from './pages/Gamification';
import CommunityHub from './pages/CommunityHub';
import PredictiveDashboard from './pages/PredictiveDashboard';
import FeedbackHub from './pages/Feedback';
import EventCalendar from './pages/EventCalendar';
import DigitalSecurity from './pages/DigitalSecurity';
import FoodMenu from './pages/FoodMenu';
import RoomBooking from './pages/RoomBooking';
import HostelSmartOS from './pages/HostelSmartOS';
import HostelDiscovery from './pages/HostelDiscovery';
import FacilitiesPage from './pages/FacilitiesPage';
import RoomGallery from './pages/RoomGallery';
import SampleDashboard from './pages/SampleDashboard';
import HostelList from './pages/HostelList';

function App() {
  return (
    <Router>
      <AriaAssistant />
      <Routes>
        {/* Student Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/roomview" element={<RoomView />} />
        <Route path="/rooms" element={<BrowseRooms />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/complaints" element={<Complaints />} />
        <Route path="/food-menu" element={<FoodMenu />} />
        <Route path="/room-booking" element={<RoomBooking />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/admin/digital-twin" element={<DigitalTwin />} />
        <Route path="/admin/predictive" element={<PredictiveDashboard />} />
        <Route path="/ar-tour" element={<ARTour />} />
        <Route path="/roommate-match" element={<RoommateMatcher />} />
        <Route path="/study-pods" element={<StudyPods />} />
        <Route path="/smart-living" element={<SmartLiving />} />
        <Route path="/gamification" element={<Gamification />} />
        <Route path="/community" element={<CommunityHub />} />
        <Route path="/feedback" element={<FeedbackHub />} />
        <Route path="/events" element={<EventCalendar />} />
        <Route path="/security" element={<DigitalSecurity />} />
        <Route path="/smart-os" element={<HostelSmartOS />} />
        <Route path="/discovery" element={<HostelDiscovery />} />
        
        {/* Sample Data Routes */}
        <Route path="/facilities" element={<FacilitiesPage />} />
        <Route path="/room-gallery" element={<RoomGallery />} />
        <Route path="/sample-dashboard" element={<SampleDashboard />} />
        <Route path="/hostels" element={<HostelList />} />
      </Routes>
    </Router>
  );
}

export default App;
