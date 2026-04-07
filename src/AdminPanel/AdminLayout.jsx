// AdminPanel/AdminLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';


const AdminLayout = () => {
  return (
    <div>
      {/* Fixed top navbar */}
      <AdminHeader />

      {/* Sidebar + Page content side by side */}
      <div className="AdminPanelHome-content d-flex">
        <AdminSidebar />

        {/* All nested route pages render here */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
