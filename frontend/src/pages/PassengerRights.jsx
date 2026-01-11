// frontend/src/pages/PassengerRights.jsx
import React, { useState } from 'react';
import { Shield, Clock, AlertTriangle, Check, X, DollarSign, HelpCircle } from 'lucide-react';

const PassengerRights = () => {
  const [formData, setFormData] = useState({
    airline: 'Air India',
    issueType: '',
    delayHours: 0,
    flightType: 'domestic',
  });

  const [rights, setRights] = useState(null);

  const issueTypes = [
    { value: 'delay', label: 'Flight Delay', icon: Clock },
    { value: 'cancellation', label: 'Flight Cancellation', icon: X },
    { value: 'denied_boarding', label: 'Denied Boarding', icon: AlertTriangle },
    { value: 'baggage_loss', label: 'Lost Baggage', icon: X },
    { value: 'baggage_delay', label: 'Delayed Baggage', icon: Clock },
  ];

  const airlines = ['Air India', 'IndiGo', 'SpiceJet', 'Vistara', 'Go First'];

  const calculateRights = () => {
    // Mock rights calculation based on DGCA rules
    let compensation = 0;
    let assistance = [];
    let canRefuse = [];
    let provisions = [];

    switch (formData.issueType) {
      case 'delay':
        if (formData.delayHours >= 6) {
          compensation = 10000;
          assistance = ['Meal vouchers', 'Hotel accommodation', 'Transportation', 'Communication facilities'];
        } else if (formData.delayHours >= 2) {
          assistance = ['Refreshments/meals', 'Hotel accommodation if overnight delay'];
        }
        provisions = ['Airline must inform passengers about delay', 'Provide regular updates every 30 minutes'];
        break;

      case 'cancellation':
        compensation = 10000;
        assistance = ['Alternate flight or full refund', 'Meal vouchers', 'Hotel accommodation if required'];
        canRefuse = ['Re-routing on unsafe aircraft', 'Compensation less than legal minimum'];
        provisions = ['Cancellation must be informed at least 2 weeks before departure'];
        break;

      case 'denied_boarding':
        compensation = 20000;
        assistance = ['200% of ticket fare as compensation', 'Alternate flight arrangement'];
        provisions = ['Compulsory for airlines to ask for volunteers first'];
        break;

      case 'baggage_loss':
        compensation = 20000;
        assistance = ['Interim compensation for essentials', 'Compensation up to ₹20,000 per kg'];
        provisions = ['Must file complaint within 7 days of baggage loss'];
        break;

      case 'baggage_delay':
        assistance = ['Interim compensation for essentials', 'Delivery of delayed baggage to address'];
        provisions = ['Compensation for essential purchases'];
        break;
    }

    setRights({
      compensation,
      assistance,
      canRefuse,
      provisions,
      legalReferences: ['DGCA CAR Section 3, Series M, Part IV', 'Montreal Convention 1999'],
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex p-3 bg-green-100 rounded-full mb-4">
          <Shield className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Passenger Rights Calculator
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Know your legal rights for flight issues. Based on DGCA regulations and international conventions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Describe Your Situation
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Airline
                </label>
                <select
                  value={formData.airline}
                  onChange={(e) => setFormData({...formData, airline: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select Airline</option>
                  {airlines.map(airline => (
                    <option key={airline} value={airline}>{airline}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Flight Type
                </label>
                <select
                  value={formData.flightType}
                  onChange={(e) => setFormData({...formData, flightType: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="domestic">Domestic</option>
                  <option value="international">International</option>
                </select>
              </div>
            </div>

            {/* Issue Type Selection */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                What happened with your flight?
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {issueTypes.map((issue) => {
                  const Icon = issue.icon;
                  const isSelected = formData.issueType === issue.value;
                  
                  return (
                    <button
                      key={issue.value}
                      onClick={() => setFormData({...formData, issueType: issue.value})}
                      className={`p-4 border rounded-xl text-left transition-all ${
                        isSelected
                          ? 'border-green-500 bg-green-50 ring-2 ring-green-500 ring-opacity-20'
                          : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                      }`}
                    >
                      <div className="flex items-center mb-2">
                        <div className={`p-2 rounded-lg ${
                          isSelected ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                        }`}>
                          <Icon className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="font-medium text-gray-900">{issue.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Delay Hours Input */}
            {formData.issueType === 'delay' && (
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delay Duration (hours)
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="0"
                    max="24"
                    step="1"
                    value={formData.delayHours}
                    onChange={(e) => setFormData({...formData, delayHours: parseInt(e.target.value)})}
                    className="flex-1"
                  />
                  <div className="w-20 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {formData.delayHours}
                    </div>
                    <div className="text-sm text-gray-500">hours</div>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>No delay</span>
                  <span>24+ hours</span>
                </div>
              </div>
            )}

            <button
              onClick={calculateRights}
              disabled={!formData.issueType}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg text-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Shield className="h-5 w-5 mr-2 inline" />
              Calculate My Rights
            </button>
          </div>
        </div>

        {/* Right Column - Results */}
        <div className="lg:col-span-1">
          {rights ? (
            <div className="space-y-6">
              {/* Compensation Card */}
              {rights.compensation > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                  <div className="flex items-center mb-4">
                    <DollarSign className="h-6 w-6 text-green-600 mr-3" />
                    <h3 className="text-lg font-bold text-green-900">Compensation Entitlement</h3>
                  </div>
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-green-800">
                      ₹{rights.compensation.toLocaleString('en-IN')}
                    </div>
                    <div className="text-green-700">Maximum compensation amount</div>
                  </div>
                  <p className="text-sm text-green-600">
                    This amount is based on DGCA regulations for {formData.flightType} flights.
                  </p>
                </div>
              )}

              {/* Assistance Card */}
              {rights.assistance.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-blue-900 mb-4">Airline Must Provide</h3>
                  <ul className="space-y-3">
                    {rights.assistance.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-blue-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Can Refuse Card */}
              {rights.canRefuse.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-yellow-900 mb-4">You Can Refuse</h3>
                  <ul className="space-y-3">
                    {rights.canRefuse.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <X className="h-5 w-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-yellow-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Legal References */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Legal References</h3>
                <ul className="space-y-2">
                  {rights.legalReferences.map((ref, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      • {ref}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
                <HelpCircle className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Know Your Rights
              </h3>
              <p className="text-gray-600 text-sm">
                Select your airline and describe the issue to see what compensation and assistance you're entitled to.
              </p>
            </div>
          )}

          {/* Disclaimer */}
          <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-red-900 mb-1">Legal Disclaimer</h4>
                <p className="text-red-700 text-sm">
                  This information is for guidance only and does not constitute legal advice. 
                  Regulations vary by specific circumstances. Consult a legal professional for specific cases.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassengerRights;