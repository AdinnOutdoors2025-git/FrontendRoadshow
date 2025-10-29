import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { LoginProvider } from './Authentication/LoginContext';
import Home from './components/a1Home';
import ScrollToTop from './components/Scroll_To_Top';
import VehicleTypes from './components/a2VehicleTypes';
import VehicleTypesDetails from './components/a2VehicleTypesDetails';
import Navbar from './components/a1Navbar';
import Footer from './components/a3Footer';
import PreLoad from './components/PreLoad';
// PROTECTED FILES 
import Admin from './AdminPanel/ad1.jsx';
import CreativeAdminLogin from './Authentication/CreativeLogin_UserAdmin.jsx';
import ProtectedRoute from './Authentication/PROTECTED_ROUTE.jsx';
import NotFound from './components/404NOT_FOUND.jsx';
// VEHICLE CONTEXT 
import { VehicleProvider } from './components/A_VehicleContext.jsx';

//ADMIN VEHICLE DETAILS PAGE
import AdminVehicleDetailsPg from './components/AdminVehicleDetails.jsx';
import VehicleDetailsWrapper from './Authentication/VehicleDetailsWrapper.jsx'

function App() {
  const [load, upadateLoad] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      upadateLoad(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LoginProvider>
      <VehicleProvider>
        <div>
          <Router>
            <PreLoad load={load} />
            <ScrollToTop />
            <Routes>
              <Route path="*" element={<NotFound />} />
              <Route path="/" element={<Home />} />
              <Route path='/navbar' element={<Navbar />} />
              <Route path="/vehicleTypes" element={<VehicleTypes />} />
              {/* <Route path="/vehicleTypesDetails/:vehicleId" element={<VehicleTypesDetails />} />
              
              <Route path="/vehicleTypesDetails/:vehicleId" element={<AdminVehicleDetailsPg />} /> */}
              
<Route 
  path="/vehicleTypesDetails/:vehicleId" 
  element={<VehicleDetailsWrapper />} 
/>

              <Route path='/footer' element={<Footer />} />

              {/* Admin Authentication Routes */}
              <Route path="/adminLogin" element={<CreativeAdminLogin />} />

              {/* Protected Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute adminOnly>
                  <Admin />
                </ProtectedRoute>
              } />

              {/* Redirect root admin path to admin login */}
              <Route path="/admin" element={<Navigate to="/adminLogin" replace />} />

              {/* Catch all route - redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </div>
      </VehicleProvider>
    </LoginProvider>
  )
}

export default App;
