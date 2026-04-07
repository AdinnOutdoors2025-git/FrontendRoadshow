import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { LoginProvider } from './Authentication/LoginContext';
import Home from './components/a1Home';
import ScrollToTop from './components/Scroll_To_Top';
import VehicleTypes from './components/a2VehicleTypes';
import Navbar from './components/a1Navbar';
import Footer from './components/a3Footer';
import PreLoad from './components/PreLoad';
// PROTECTED FILES 
import Admin from './AdminPanel/ad1.jsx';
import CreativeAdminLogin from './Authentication/CreativeLogin_UserAdmin.jsx';
// import ProtectedRoute from './Authentication/PROTECTED_ROUTE.jsx';
import NotFound from './components/404NOT_FOUND.jsx';
// VEHICLE CONTEXT 
import { VehicleProvider } from './components/A_VehicleContext.jsx';

//ADMIN VEHICLE DETAILS PAGE
import AdminVehicleDetailsPg from './components/AdminVehicleDetails.jsx';
import VehicleDetailsWrapper from './Authentication/VehicleDetailsWrapper.jsx';
//ABOUT US SECTION
import AboutUs from './components/a4About.jsx';
// import './ad1.css';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VehicleInfo from './pages/VehicleInfo.js'
import ProtectedRoute from './Authentication/ProtectedRoute.js';
import AdminLayout from './AdminPanel/AdminLayout.jsx';
import DashboardPage from './AdminPanel/pages/Dashboard/dashboard.jsx';
import VehiclesListTable from './AdminPanel/ad1VehiclesList.jsx';
import VehicleUpload from './AdminPanel/ad1VehicleUpload.jsx';
import EntryNewVehicles from './AdminPanel/ad1EntryNewVehicles.jsx';
import Ad1EntryNewVehiclesDetails from './AdminPanel/ad1EntryNewVehiclesDetails.jsx';
import Ad1OrdersManagement from './AdminPanel/ad1OrdersManagement.jsx';
import AllVehiclesInfoElection from './AdminPanel/ad1AllVehiclesInfoElection.jsx';

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
          <ToastContainer
            position="top-right"
            autoClose={3000}
            theme="colored"
          />
          <Router>

            <PreLoad load={load} />
            <ScrollToTop />
            <Routes>
              <Route path="/vehicleinfo" element={<VehicleInfo />} />
              <Route path="*" element={<NotFound />} />
              <Route path="/" element={<Home />} />
              <Route path='/navbar' element={<Navbar />} />
              <Route path='/aboutUs' element={<AboutUs />} />

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
        

                <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                {/* /admin  →  redirect to /admin/dashboard */}
                <Route index element={<Navigate to="dashboard" replace />} />

                {/* Dashboard */}
                <Route path="dashboard" element={<DashboardPage />} />

                {/* Products */}
                <Route path="products"                element={<Navigate to="all-products" replace />} />
                <Route path="products/all-products"   element={<VehiclesListTable />}                    />
                <Route path="products/add-products"   element={<VehicleUpload />}                    />

                {/* Vehicles */}
                <Route path="vehicles"                element={<Navigate to="vehicles-info" replace />} />
                <Route path="vehicles/vehicles-info"  element={<AllVehiclesInfoElection />}                    />

                {/* New Vehicles */}
                <Route path="new-vehicles"                      element={<Navigate to="new-vehicles-info" replace />} />
                <Route path="new-vehicles/new-vehicles-info"    element={<EntryNewVehicles />}                     />
                <Route path="new-vehicles/new-entry-vehicles"   element={<Ad1EntryNewVehiclesDetails />}                    />

                {/* Orders Management */}
                <Route path="orders-management"         element={<Navigate to="orders" replace />} />
                <Route path="orders-management/orders"  element={<Ad1OrdersManagement />}                   />

              </Route>

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
