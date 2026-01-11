// frontend/src/components/PassengerRights/RightsCalculator.jsx
import React, { useState } from 'react';
import { Shield, Clock, AlertTriangle, Check, X } from 'lucide-react';
import axios from 'axios';

const RightsCalculator = () => {
  const [formData, setFormData] = useState({
    country: 'IN',
    airlineCode: '',
    issueType: '',
    delayHours: 0,
    flightType: 'DOMESTIC'
  });

  const [rights, setRights] = useState(null);
  const [loading, setLoading] = useState(false);

  const issueTypes = [
    { value: 'DELAY', label: 'Flight Delay', icon: Clock },
    { value: 'CANCELLATION', label: 'Flight Cancellation', icon: X },
    { value: 'DENIED_BOARDING', label: 'Denied Boarding', icon: AlertTriangle },
    { value: 'BAGGAGE_LOSS', label: 'Lost Baggage', icon: X },
    { value: 'BAGGAGE_DELAY', label: 'Delayed Baggage', icon: Clock }
  ];

  const calculateRights = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/rights/calculate', formData);
      setRights(response.data);
    } catch (error) {
      console.error('Error calculating rights:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-8 w-8 text-green-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Know Your Passenger Rights
            </h2>
            <p className="text-gray-600">
              Based on DGCA regulations and airline policies
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Airline
            </label>
            <select
              value={formData.airlineCode}
              onChange={(e) => setFormData({...formData, airlineCode: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Airline</option>
              <option value="AI">Air India</option>
              <option value="6E">IndiGo</option>
              <option value="SG">SpiceJet</option>
              <option value="UK">Vistara</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Issue Type
            </label>
            <select
              value={formData.issueType}
              onChange={(e) => setFormData({...formData, issueType: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Issue</option>
              {issueTypes.map((issue) => (
                <option key={issue.value} value={issue.value}>
                  {issue.label}
                </option>
              ))}
            </select>
          </div>

          {formData.issueType === 'DELAY' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delay Duration (hours)
              </label>
              <input
                type="number"
                min="0"
                max="24"
                value={formData.delayHours}
                onChange={(e) => setFormData({...formData, delayHours: parseInt(e.target.value)})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Flight Type
            </label>
            <select
              value={formData.flightType}
              onChange={(e) => setFormData({...formData, flightType: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="DOMESTIC">Domestic</option>
              <option value="INTERNATIONAL">International</option>
            </select>
          </div>
        </div>

        <button
          onClick={calculateRights}
          disabled={loading || !formData.airlineCode || !formData.issueType}
          className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Calculating...' : 'Check Your Rights'}
        </button>
      </div>

      {rights && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Your Passenger Rights
          </h3>
          
          <div className="space-y-6">
            {/* Compensation */}
            {rights.compensation && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-green-900">Compensation Entitlement</h4>
                    <p className="text-green-700">
                      You may be entitled to compensation of{' '}
                      <span className="font-bold text-lg">
                        ₹{rights.compensation.amount.toLocaleString('en-IN')}
                      </span>
                    </p>
                  </div>
                </div>
                <p className="text-sm text-green-600">
                  {rights.compensation.conditions}
                </p>
              </div>
            )}

            {/* Refunds */}
            {rights.refund && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                <h4 className="font-bold text-blue-900 mb-2">Refund Options</h4>
                <ul className="space-y-2">
                  {rights.refund.options.map((option, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-blue-700">{option}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* What You Can Refuse */}
            {rights.canRefuse && rights.canRefuse.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
                <h4 className="font-bold text-yellow-900 mb-2">
                  What You Can Legally Refuse
                </h4>
                <ul className="space-y-2">
                  {rights.canRefuse.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span className="text-yellow-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Required Assistance */}
            {rights.assistance && (
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
                <h4 className="font-bold text-purple-900 mb-2">
                  Airline Must Provide
                </h4>
                <ul className="space-y-2">
                  {rights.assistance.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Shield className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                      <span className="text-purple-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Disclaimer */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-red-500 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-red-900 mb-2">Important Disclaimer</h4>
                  <p className="text-red-700 text-sm">
                    This information is for guidance only and does not constitute legal advice. 
                    Regulations vary by country and specific circumstances. 
                    Always check with the airline and consult a legal professional for specific cases.
                    Based on DGCA regulations effective {new Date().getFullYear()}.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RightsCalculator;