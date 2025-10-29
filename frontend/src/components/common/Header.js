/**
 * Header Component
 * Dashboard header with title and description
 */

import React from "react";

const Header = () => {
  return (
    <header className="dashboard-header">
      <h1 className="dashboard-title">Clinical Trial Analytics Dashboard</h1>
      <p className="dashboard-subtitle">
        Comprehensive analytics and insights from clinical trial data worldwide
      </p>
    </header>
  );
};

export default Header;
