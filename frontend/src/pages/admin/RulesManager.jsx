// frontend/src/pages/admin/RulesManager.jsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Calendar,
  AlertTriangle
} from 'lucide-react';

const RulesManager = () => {
  const [editingRule, setEditingRule] = useState(null);
  const [newRule, setNewRule] = useState({
    airline_id: '',
    cabin_class: 'ECONOMY',
    route_type: 'DOMESTIC',
    passenger_type: 'ADULT',
    cabin_baggage_count: 1,
    cabin_baggage_weight: 7,
    checked_baggage_count: 1,
    checked_baggage_weight: 15,
    excess_fee_per_kg: 500,
    excess_fee_flat: 1000,
    currency: 'INR',
    effective_from: new Date().toISOString().split('T')[0]
  });

  const queryClient = useQueryClient();

  const { data: rules, isLoading } = useQuery({
    queryKey: ['admin-rules'],
    queryFn: async () => {
      const response = await axios.get('/api/admin/rules');
      return response.data;
    }
  });

  const { data: airlines } = useQuery({
    queryKey: ['airlines'],
    queryFn: async () => {
      const response = await axios.get('/api/airlines');
      return response.data;
    }
  });

  const createMutation = useMutation({
    mutationFn: (rule) => axios.post('/api/admin/rules', rule),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-rules']);
      setNewRule({
        airline_id: '',
        cabin_class: 'ECONOMY',
        route_type: 'DOMESTIC',
        passenger_type: 'ADULT',
        cabin_baggage_count: 1,
        cabin_baggage_weight: 7,
        checked_baggage_count: 1,
        checked_baggage_weight: 15,
        excess_fee_per_kg: 500,
        excess_fee_flat: 1000,
        currency: 'INR',
        effective_from: new Date().toISOString().split('T')[0]
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, rule }) => axios.put(`/api/admin/rules/${id}`, rule),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-rules']);
      setEditingRule(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => axios.delete(`/api/admin/rules/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-rules']);
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add New Rule Form */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Plus className="h-6 w-6" />
          Add New Baggage Rule
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Airline
            </label>
            <select
              value={newRule.airline_id}
              onChange={(e) => setNewRule({...newRule, airline_id: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Airline</option>
              {airlines?.map((airline) => (
                <option key={airline.id} value={airline.id}>
                  {airline.name} ({airline.iata_code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cabin Class
            </label>
            <select
              value={newRule.cabin_class}
              onChange={(e) => setNewRule({...newRule, cabin_class: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="ECONOMY">Economy</option>
              <option value="PREMIUM_ECONOMY">Premium Economy</option>
              <option value="BUSINESS">Business</option>
              <option value="FIRST">First</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Route Type
            </label>
            <select
              value={newRule.route_type}
              onChange={(e) => setNewRule({...newRule, route_type: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="DOMESTIC">Domestic</option>
              <option value="INTERNATIONAL">International</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Effective From
            </label>
            <input
              type="date"
              value={newRule.effective_from}
              onChange={(e) => setNewRule({...newRule, effective_from: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cabin Bags (count)
            </label>
            <input
              type="number"
              min="0"
              value={newRule.cabin_baggage_count}
              onChange={(e) => setNewRule({...newRule, cabin_baggage_count: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cabin Weight (kg)
            </label>
            <input
              type="number"
              min="0"
              step="0.5"
              value={newRule.cabin_baggage_weight}
              onChange={(e) => setNewRule({...newRule, cabin_baggage_weight: parseFloat(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Checked Bags (count)
            </label>
            <input
              type="number"
              min="0"
              value={newRule.checked_baggage_count}
              onChange={(e) => setNewRule({...newRule, checked_baggage_count: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Checked Weight (kg)
            </label>
            <input
              type="number"
              min="0"
              step="0.5"
              value={newRule.checked_baggage_weight}
              onChange={(e) => setNewRule({...newRule, checked_baggage_weight: parseFloat(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Excess Fee per kg
            </label>
            <input
              type="number"
              min="0"
              value={newRule.excess_fee_per_kg}
              onChange={(e) => setNewRule({...newRule, excess_fee_per_kg: parseFloat(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Flat Excess Fee
            </label>
            <input
              type="number"
              min="0"
              value={newRule.excess_fee_flat}
              onChange={(e) => setNewRule({...newRule, excess_fee_flat: parseFloat(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <button
          onClick={() => createMutation.mutate(newRule)}
          disabled={createMutation.isLoading || !newRule.airline_id}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {createMutation.isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Creating...
            </>
          ) : (
            <>
              <Plus className="h-5 w-5" />
              Add Rule
            </>
          )}
        </button>
      </div>

      {/* Existing Rules Table */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Existing Baggage Rules ({rules?.length || 0})
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Airline
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Class / Route
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cabin Allowance
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Checked Allowance
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Excess Fees
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Effective Dates
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rules?.map((rule) => (
                <tr key={rule.id}>
                  <td className="px-4 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {rule.airline_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {rule.iata_code}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900">
                      {rule.cabin_class}
                    </div>
                    <div className="text-xs text-gray-500">
                      {rule.route_type}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900">
                      {rule.cabin_baggage_count} × {rule.cabin_baggage_weight}kg
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900">
                      {rule.checked_baggage_count} × {rule.checked_baggage_weight}kg
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900">
                      {rule.excess_fee_per_kg ? `${rule.currency} ${rule.excess_fee_per_kg}/kg` : '-'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {rule.excess_fee_flat ? `Flat: ${rule.currency} ${rule.excess_fee_flat}` : ''}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900">
                      From: {new Date(rule.effective_from).toLocaleDateString('en-IN')}
                    </div>
                    {rule.effective_to && (
                      <div className="text-xs text-yellow-600">
                        To: {new Date(rule.effective_to).toLocaleDateString('en-IN')}
                      </div>
                    )}
                    {new Date(rule.effective_from) > new Date() && (
                      <div className="text-xs text-blue-600 mt-1">
                        <Calendar className="h-3 w-3 inline mr-1" />
                        Future rule
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingRule(rule)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteMutation.mutate(rule.id)}
                        disabled={deleteMutation.isLoading}
                        className="p-1 text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingRule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Edit Rule
                </h2>
                <button
                  onClick={() => setEditingRule(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Edit form similar to add form */}
              <div className="space-y-6">
                {/* Form fields pre-filled with editingRule data */}
                {/* ... */}
                
                <div className="flex justify-end gap-4 pt-6 border-t">
                  <button
                    onClick={() => setEditingRule(null)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => updateMutation.mutate({
                      id: editingRule.id,
                      rule: editingRule
                    })}
                    disabled={updateMutation.isLoading}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg flex items-center gap-2"
                  >
                    <Save className="h-5 w-5" />
                    {updateMutation.isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RulesManager;