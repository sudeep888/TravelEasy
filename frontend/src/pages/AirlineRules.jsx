// frontend/src/pages/AirlineRules.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { 
  Plane, 
  Package, 
  AlertCircle, 
  CheckCircle,
  Clock,
  DollarSign,
  Globe,
  FileText
} from 'lucide-react';
import SEO from '../components/SEO/SEO';
import LoadingSpinner from '../components/Shared/LoadingSpinner';

const AirlineRules = () => {
  const { airlineCode } = useParams();
  const [airlineName, setAirlineName] = useState('');

  const { data: airlineData, isLoading } = useQuery({
    queryKey: ['airline', airlineCode],
    queryFn: async () => {
      const [airlineRes, rulesRes] = await Promise.all([
        axios.get(`/api/airlines/${airlineCode}`),
        axios.get(`/api/baggage/rules/${airlineCode}`)
      ]);
      
      return {
        airline: airlineRes.data,
        rules: rulesRes.data
      };
    },
    enabled: !!airlineCode
  });

  useEffect(() => {
    if (airlineData?.airline?.name) {
      setAirlineName(airlineData.airline.name);
    }
  }, [airlineData]);

  if (isLoading) return <LoadingSpinner />;

  const airline = airlineData?.airline;
  const rules = airlineData?.rules || [];

  // Group rules by cabin class and route type
  const groupedRules = rules.reduce((acc, rule) => {
    const key = `${rule.cabin_class}-${rule.route_type}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(rule);
    return acc;
  }, {});

  return (
    <>
      <SEO
        title={`${airlineName} Baggage Allowance & Fees`}
        description={`Complete guide to ${airlineName} baggage rules, excess fees, cabin baggage allowance, checked baggage limits, and passenger rights. Updated regularly from airline policies.`}
        keywords={`${airlineName} baggage allowance, ${airlineName} excess baggage fees, ${airlineName} cabin baggage, ${airlineName} checked baggage, ${airlineName} rules`}
      />

      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-4">
              {airline?.logo_url ? (
                <img 
                  src={airline.logo_url} 
                  alt={`${airlineName} logo`}
                  className="h-16 w-16 object-contain"
                />
              ) : (
                <Plane className="h-12 w-12 text-blue-600" />
              )}
              <div>
                <h1 className="text-4xl font-bold text-gray-900">
                  {airlineName} Baggage Rules & Fees
                </h1>
                <p className="text-gray-600 mt-2">
                  Complete baggage allowance guide with updated excess fees
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 mt-4">
              <a 
                href="#baggage-rules" 
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200"
              >
                Baggage Rules
              </a>
              <a 
                href="#excess-fees" 
                className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg font-medium hover:bg-yellow-200"
              >
                Excess Fees
              </a>
              <a 
                href="#passenger-rights" 
                className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200"
              >
                Passenger Rights
              </a>
              <a 
                href="#contact" 
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200"
              >
                Contact Airline
              </a>
            </div>
          </div>

          {/* Last Updated */}
          {rules.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
              <div className="flex items-center gap-2 text-blue-700">
                <Clock className="h-5 w-5" />
                <span className="font-medium">
                  Last updated: {new Date(rules[0].updated_at).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                <span className="text-sm">• Effective from: {new Date(rules[0].effective_from).toLocaleDateString('en-IN')}</span>
              </div>
            </div>
          )}

          {/* Baggage Rules Table */}
          <div id="baggage-rules" className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Package className="h-6 w-6" />
              Baggage Allowance Rules
            </h2>

            {Object.entries(groupedRules).map(([key, ruleGroup]) => {
              const [cabinClass, routeType] = key.split('-');
              return (
                <div key={key} className="mb-8 last:mb-0">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    {cabinClass} Class • {routeType} Flights
                  </h3>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Passenger Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Cabin Baggage
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Checked Baggage
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Notes
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {ruleGroup.map((rule) => (
                          <tr key={rule.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {rule.passenger_type}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">
                                <div className="font-medium">
                                  {rule.cabin_baggage_count} bag{rule.cabin_baggage_count !== 1 ? 's' : ''}
                                </div>
                                <div className="text-gray-600">
                                  {rule.cabin_baggage_weight} kg
                                </div>
                                {rule.cabin_baggage_dimensions && (
                                  <div className="text-gray-500 text-xs">
                                    Size: {rule.cabin_baggage_dimensions} cm
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">
                                <div className="font-medium">
                                  {rule.checked_baggage_count} bag{rule.checked_baggage_count !== 1 ? 's' : ''}
                                </div>
                                <div className="text-gray-600">
                                  {rule.checked_baggage_weight} kg
                                </div>
                                {rule.checked_baggage_size && (
                                  <div className="text-gray-500 text-xs">
                                    Size: {rule.checked_baggage_size} cm
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-600">
                                {rule.notes || 'Standard allowance'}
                                {rule.effective_to && (
                                  <div className="text-xs text-yellow-600 mt-1">
                                    Valid until: {new Date(rule.effective_to).toLocaleDateString('en-IN')}
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Excess Fees */}
          <div id="excess-fees" className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <DollarSign className="h-6 w-6" />
              Excess Baggage Fees
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {rules.filter(r => r.excess_fee_per_kg || r.excess_fee_flat).map((rule) => (
                <div key={`excess-${rule.id}`} className="border border-gray-200 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">
                      {rule.cabin_class} • {rule.route_type}
                    </h3>
                    <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                      {rule.currency}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    {rule.excess_fee_per_kg && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Per excess kg:</span>
                        <span className="font-bold text-lg">
                          {rule.currency} {rule.excess_fee_per_kg}/kg
                        </span>
                      </div>
                    )}
                    
                    {rule.excess_fee_flat && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Flat fee per bag:</span>
                        <span className="font-bold text-lg">
                          {rule.currency} {rule.excess_fee_flat}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-start gap-2 text-sm text-yellow-600">
                      <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <p>Fees may vary at airport counters. Online prepayment might be cheaper.</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SEO Content */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              About {airlineName} Baggage Policies
            </h2>
            
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">
                {airlineName} follows specific baggage allowance rules based on cabin class, 
                route type (domestic or international), and passenger type. The allowances 
                mentioned above are standard rules and may vary for special fare types, 
                frequent flyer status, or promotional offers.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Important Guidelines
              </h3>
              
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Always check your specific fare conditions for exact allowances</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Pre-pay excess baggage online to save up to 30% compared to airport rates</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Sports equipment and special items may have different rules</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Infants (under 2 years) usually have separate allowances</span>
                </li>
              </ul>
              
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                <h4 className="font-bold text-gray-900 mb-2">Need Help?</h4>
                <p className="text-gray-700 mb-3">
                  Use our <a href="/baggage-calculator" className="text-blue-600 hover:underline font-medium">Baggage Calculator</a> 
                  {' '}to check your specific allowance and calculate exact excess fees based on your flight details.
                </p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300">
                  Calculate Your Baggage
                </button>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-red-900 mb-2">Disclaimer</h3>
                <p className="text-red-700">
                  The information provided here is for informational purposes only and is based on 
                  publicly available airline policies. While we strive to keep it accurate and up-to-date, 
                  rules may change without notice. Always verify with {airlineName} directly before your flight. 
                  This is not legal advice. For specific legal questions about passenger rights, 
                  consult with a legal professional or the relevant aviation authority (DGCA in India).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AirlineRules;