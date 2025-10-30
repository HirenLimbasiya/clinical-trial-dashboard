import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Dashboard from "./components/Dashboard";
import SearchPage from "./pages/SearchPage";
import OfficialsPage from "./pages/OfficialsPage";
import "./App.css";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/officials" element={<OfficialsPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
