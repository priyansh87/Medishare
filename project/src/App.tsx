import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Scanner from './components/Scanner';
import NGOMap from './components/NGOMap';
import HealthInsights from './components/HealthInsights';
import Dashboard from './components/Dashboard';
import ReportAnalysis from './components/ReportAnalysis';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Routes>
          <Route path="/" element={
            <main>
              <Hero />
              <Scanner />
              <NGOMap />
              <HealthInsights />
              <Dashboard />
            </main>
          } />
          <Route path="/report-analysis" element={<ReportAnalysis />} />
        </Routes>
        <footer className="bg-white border-t border-gray-200 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-gray-500 text-sm">
              © 2024 MediShare. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;