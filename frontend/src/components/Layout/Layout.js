/**
 * Layout Component
 * Professional sidebar navigation with clean design
 */

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { BarChart3, Search, Users, Activity } from "lucide-react";
import "../../styles/Layout.css";

const Layout = ({ children }) => {
  const location = useLocation();

  const navItems = [
    {
      path: "/",
      icon: BarChart3,
      label: "Dashboard",
    },
    {
      path: "/search",
      icon: Search,
      label: "Search Trials",
    },
    {
      path: "/officials",
      icon: Users,
      label: "Officials",
    },
  ];

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <Activity className="logo-icon" size={28} strokeWidth={2.5} />
            <span className="logo-text">Clinical Trials</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive(item.path) ? "active" : ""}`}
              >
                <Icon size={20} strokeWidth={2} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              <Users size={16} />
            </div>
            <div className="user-details">
              <p className="user-name">Admin User</p>
              <p className="user-role">Analytics Dashboard</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">{children}</main>
    </div>
  );
};

export default Layout;
