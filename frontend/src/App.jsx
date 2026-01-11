import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import BaggageCalculator from './pages/BaggageCalculator';
import PassengerRights from './pages/PassengerRights';
import ComplaintGenerator from './pages/ComplaintGenerator';

// Simple 404 component - no need for separate file
function NotFound() {
  return (
    <div className="text-center p-8">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-gray-600 mt-4">Page not found</p>
    </div>
  );
}

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/baggage-calculator" element={<BaggageCalculator />} />
            <Route path="/passenger-rights" element={<PassengerRights />} />
            <Route path="/complaint-generator" element={<ComplaintGenerator />} />
            <Route path="*" element={<NotFound />} /> {/* This handles 404 */}
          </Routes>
        </Layout>
        <Toaster position="top-right" />
      </Router>
    </QueryClientProvider>
  );
}

export default App;