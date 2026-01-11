// frontend/src/pages/BaggageCalculator.jsx
import React, { useState } from 'react';
import { Calculator, Plane, Scale, AlertCircle, CheckCircle, XCircle, Plus, Minus } from 'lucide-react';

const BaggageCalculator = () => {
  const [formData, setFormData] = useState({
    airline: 'Air India',
    routeType: 'domestic',
    cabinClass: 'economy',
    passengerType: 'adult',
    cabinBags: [{ weight: 7 }],
    checkedBags: [{ weight: 15 }],
  });

  const [result, setResult] = useState(null);

  const airlines = [
    'Air India', 'IndiGo', 'SpiceJet', 'Vistara', 'Go First',
    'AirAsia', 'Emirates', 'Qatar Airways', 'Etihad Airways'
  ];

  const calculateBaggage = () => {
    // Mock calculation - in real app, this would call your backend
    const cabinTotal = formData.cabinBags.reduce((sum, bag) => sum + bag.weight, 0);
    const checkedTotal = formData.checkedBags.reduce((sum, bag) => sum + bag.weight, 0);
    
    // Mock allowances based on airline and class
    const allowances = {
      domestic: {
        economy: { cabin: 7, checked: 15 },
        business: { cabin: 10, checked: 25 },
        first: { cabin: 12, checked: 30 },
      },
      international: {
        economy: { cabin: 8, checked: 23 },
        business: { cabin: 12, checked: 32 },
        first: { cabin: 15, checked: 40 },
      },
    };

    const allowance = allowances[formData.routeType][formData.cabinClass];
    const cabinExcess = Math.max(0, cabinTotal - allowance.cabin);
    const checkedExcess = Math.max(0, checkedTotal - allowance.checked);
    const totalExcess = cabinExcess + checkedExcess;
    
    // Calculate fee: ₹500 per kg excess
    const excessFee = totalExcess * 500;

    // Determine status
    const getStatus = (weight, allowance) => {
      if (weight <= allowance) return { status: 'Allowed', color: 'green', icon: CheckCircle };
      if (weight <= allowance * 1.5) return { status: 'Extra Fee', color: 'yellow', icon: AlertCircle };
      return { status: 'Not Allowed', color: 'red', icon: XCircle };
    };

    const cabinStatus = getStatus(cabinTotal, allowance.cabin);
    const checkedStatus = getStatus(checkedTotal, allowance.checked);

    setResult({
      allowances: allowance,
      totals: { cabin: cabinTotal, checked: checkedTotal },
      excess: { cabin: cabinExcess, checked: checkedExcess, total: totalExcess },
      fee: excessFee,
      status: { cabin: cabinStatus, checked: checkedStatus },
    });
  };

  const addBag = (type) => {
    setFormData(prev => ({
      ...prev,
      [type]: [...prev[type], { weight: 0 }]
    }));
  };

  const removeBag = (type, index) => {
    if (formData[type].length > 1) {
      setFormData(prev => ({
        ...prev,
        [type]: prev[type].filter((_, i) => i !== index)
      }));
    }
  };

  const updateBagWeight = (type, index, weight) => {
    const updatedBags = [...formData[type]];
    updatedBags[index] = { weight: parseFloat(weight) || 0 };
    setFormData(prev => ({ ...prev, [type]: updatedBags }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex p-3 bg-blue-100 rounded-full mb-4">
          <Calculator className="h-10 w-10 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Airline Baggage Calculator
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Calculate your baggage allowance and excess fees for any airline and route. 
          Get accurate estimates based on latest airline policies.
        </p>
      </div>

      {/* Calculator Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Enter Flight Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Airline
                </label>
                <select
                  value={formData.airline}
                  onChange={(e) => setFormData({...formData, airline: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {airlines.map(airline => (
                    <option key={airline} value={airline}>{airline}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Route Type
                </label>
                <select
                  value={formData.routeType}
                  onChange={(e) => setFormData({...formData, routeType: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="domestic">Domestic</option>
                  <option value="international">International</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cabin Class
                </label>
                <select
                  value={formData.cabinClass}
                  onChange={(e) => setFormData({...formData, cabinClass: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="economy">Economy</option>
                  <option value="business">Business</option>
                  <option value="first">First Class</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Passenger Type
                </label>
                <select
                  value={formData.passengerType}
                  onChange={(e) => setFormData({...formData, passengerType: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="adult">Adult</option>
                  <option value="child">Child (2-11 years)</option>
                  <option value="infant">Infant (under 2)</option>
                </select>
              </div>
            </div>

            {/* Cabin Bags */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Cabin Baggage</h3>
                <button
                  onClick={() => addBag('cabinBags')}
                  className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Bag
                </button>
              </div>
              
              <div className="space-y-3">
                {formData.cabinBags.map((bag, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="flex-1">
                      <label className="block text-sm text-gray-600 mb-1">
                        Bag {index + 1} Weight (kg)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={bag.weight}
                        onChange={(e) => updateBagWeight('cabinBags', index, e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    {formData.cabinBags.length > 1 && (
                      <button
                        onClick={() => removeBag('cabinBags', index)}
                        className="mt-6 p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Minus className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Checked Bags */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Checked Baggage</h3>
                <button
                  onClick={() => addBag('checkedBags')}
                  className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Bag
                </button>
              </div>
              
              <div className="space-y-3">
                {formData.checkedBags.map((bag, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="flex-1">
                      <label className="block text-sm text-gray-600 mb-1">
                        Bag {index + 1} Weight (kg)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={bag.weight}
                        onChange={(e) => updateBagWeight('checkedBags', index, e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    {formData.checkedBags.length > 1 && (
                      <button
                        onClick={() => removeBag('checkedBags', index)}
                        className="mt-6 p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Minus className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={calculateBaggage}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg text-lg transition duration-200 flex items-center justify-center"
            >
              <Calculator className="h-5 w-5 mr-2" />
              Calculate Baggage
            </button>
          </div>
        </div>

        {/* Right Column - Results */}
        <div className="lg:col-span-1">
          {result ? (
            <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Results</h2>
                <Scale className="h-6 w-6 text-blue-600" />
              </div>

              {/* Allowances */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Allowed Baggage</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-sm text-blue-700">Cabin</div>
                      <div className="text-lg font-bold text-blue-900">
                        {result.allowances.cabin} kg
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-sm text-green-700">Checked</div>
                      <div className="text-lg font-bold text-green-900">
                        {result.allowances.checked} kg
                      </div>
                    </div>
                  </div>
                </div>

                {/* Your Bags */}
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Your Bags</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="text-sm text-gray-600">Cabin Total</div>
                      <div className="text-lg font-bold text-gray-900">
                        {result.totals.cabin} kg
                      </div>
                      <div className="flex items-center mt-2">
                        <result.status.cabin.icon className={`h-4 w-4 mr-1 text-${result.status.cabin.color}-500`} />
                        <span className={`text-sm text-${result.status.cabin.color}-600`}>
                          {result.status.cabin.status}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="text-sm text-gray-600">Checked Total</div>
                      <div className="text-lg font-bold text-gray-900">
                        {result.totals.checked} kg
                      </div>
                      <div className="flex items-center mt-2">
                        <result.status.checked.icon className={`h-4 w-4 mr-1 text-${result.status.checked.color}-500`} />
                        <span className={`text-sm text-${result.status.checked.color}-600`}>
                          {result.status.checked.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Excess & Fees */}
                {result.excess.total > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <h3 className="font-medium text-yellow-800 mb-2">Excess Calculation</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-yellow-700">Cabin Excess:</span>
                        <span className="font-medium">{result.excess.cabin} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-yellow-700">Checked Excess:</span>
                        <span className="font-medium">{result.excess.checked} kg</span>
                      </div>
                      <div className="flex justify-between border-t border-yellow-300 pt-2">
                        <span className="text-yellow-800 font-medium">Total Excess:</span>
                        <span className="font-bold text-yellow-900">{result.excess.total} kg</span>
                      </div>
                      <div className="flex justify-between border-t border-yellow-300 pt-2">
                        <span className="text-red-700 font-medium">Estimated Fee:</span>
                        <span className="font-bold text-red-800">₹{result.fee.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Status Summary */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Status Summary</h3>
                  <p className="text-sm text-gray-600">
                    {result.excess.total === 0 
                      ? '🎉 Your baggage is within the allowed limits!'
                      : result.excess.total <= 5
                      ? '⚠️ You have excess baggage. Consider prepaying online to save up to 30%.'
                      : '❌ You have significant excess baggage. Please check airline policies or consider shipping items separately.'
                    }
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
                <Plane className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Calculate Your Baggage
              </h3>
              <p className="text-gray-600 text-sm">
                Enter your flight details and bag weights to see allowances and any excess fees.
              </p>
            </div>
          )}

          {/* Disclaimer */}
          <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-red-900 mb-1">Important Note</h4>
                <p className="text-red-700 text-sm">
                  Calculations are estimates based on standard rules. Actual fees may vary. 
                  Always check with your airline before travel.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BaggageCalculator;