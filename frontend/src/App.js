/**
 * App Component
 * Root component that wraps the entire application
 */

import React from "react";
import Dashboard from "./components/Dashboard";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Dashboard />
    </div>
  );
}

export default App;
