// frontend/src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Calculator, Shield, FileText, Plane, CheckCircle, Users, Globe } from 'lucide-react';

const HomePage = () => {
  const features = [
    {
      icon: Calculator,
      title: 'Baggage Calculator',
      description: 'Calculate baggage allowance and excess fees for any airline and route.',
      link: '/baggage-calculator',
      color: 'blue',
    },
    {
      icon: Shield,
      title: 'Passenger Rights',
      description: 'Know your legal rights for flight delays, cancellations, and baggage issues.',
      link: '/passenger-rights',
      color: 'green',
    },
    {
      icon: FileText,
      title: 'Complaint Generator',
      description: 'Generate professional complaint letters and email templates for airlines.',
      link: '/complaint-generator',
      color: 'purple',
    },
  ];

  const airlines = ['Air India', 'IndiGo', 'SpiceJet', 'Vistara', 'AirAsia', 'Emirates', 'Qatar Airways'];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-6">
            <Plane className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Know Your Rights, Calculate Your Baggage
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Get instant baggage calculations, understand your passenger rights, and generate 
            professional complaint letters for flight issues.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/baggage-calculator"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg text-lg transition duration-200"
            >
              Calculate Baggage
            </Link>
            <Link
              to="/passenger-rights"
              className="bg-white hover:bg-gray-50 text-gray-800 font-semibold py-3 px-8 rounded-lg text-lg border border-gray-300 transition duration-200"
            >
              Know Your Rights
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Everything You Need for Stress-Free Travel
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            const colorClasses = {
              blue: 'bg-blue-100 text-blue-600',
              green: 'bg-green-100 text-green-600',
              purple: 'bg-purple-100 text-purple-600',
            };
            
            return (
              <div key={feature.title} className="bg-white rounded-2xl shadow-xl p-8">
                <div className={`inline-flex p-4 rounded-2xl ${colorClasses[feature.color]} mb-6`}>
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-6">{feature.description}</p>
                <Link
                  to={feature.link}
                  className={`font-medium ${
                    feature.color === 'blue' ? 'text-blue-600 hover:text-blue-700' :
                    feature.color === 'green' ? 'text-green-600 hover:text-green-700' :
                    'text-purple-600 hover:text-purple-700'
                  }`}
                >
                  Try it now →
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Supported Airlines */}
      <section className="py-8 bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center mb-6">
          <Globe className="h-6 w-6 text-gray-700 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">Supported Airlines</h2>
        </div>
        <p className="text-gray-600 mb-6">
          Get accurate baggage rules and fees for major airlines worldwide
        </p>
        <div className="flex flex-wrap gap-3">
          {airlines.map((airline) => (
            <span
              key={airline}
              className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg font-medium"
            >
              {airline}
            </span>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 rounded-2xl p-6">
          <div className="flex items-center mb-4">
            <CheckCircle className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <div className="text-3xl font-bold text-blue-900">100%</div>
              <div className="text-blue-700">Accuracy</div>
            </div>
          </div>
          <p className="text-blue-800 text-sm">
            Based on latest airline policies and DGCA regulations
          </p>
        </div>
        
        <div className="bg-green-50 rounded-2xl p-6">
          <div className="flex items-center mb-4">
            <Users className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <div className="text-3xl font-bold text-green-900">24/7</div>
              <div className="text-green-700">Access</div>
            </div>
          </div>
          <p className="text-green-800 text-sm">
            Calculate and generate documents anytime, anywhere
          </p>
        </div>
        
        <div className="bg-purple-50 rounded-2xl p-6">
          <div className="text-3xl font-bold text-purple-900 mb-2">₹0</div>
          <div className="text-purple-700 font-medium mb-2">Completely Free</div>
          <p className="text-purple-800 text-sm">
            No charges for calculations, rights info, or document generation
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;