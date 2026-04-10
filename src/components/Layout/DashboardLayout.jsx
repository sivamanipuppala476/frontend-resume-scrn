import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function DashboardLayout({ title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="dashboard-main">
        <Navbar
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          title={title}
        />
        <div className="dashboard-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
