//import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import WorkerRegistration from './pages/WorkerRegistration';
import WorkerListing from './pages/WorkerListing';
import WorkerProfile from './pages/WorkerProfile';
import UserProfile from './pages/UserProfile';
import EditProfileForm from './pages/EditProfileForm';
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/userprofile" element={<UserProfile />} />
              <Route path="/editprofile" element={<EditProfileForm />} />
              <Route path="/worker-registration" element={<WorkerRegistration />} />
              <Route path="/workers" element={<WorkerListing /> } />
              <Route path="/workers/:id" element={<WorkerProfile /> } />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;