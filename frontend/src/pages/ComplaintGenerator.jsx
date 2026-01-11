// frontend/src/pages/ComplaintGenerator.jsx
import React, { useState } from 'react';
import { FileText, Download, Mail, Copy, User, Plane, Calendar, MapPin, AlertCircle } from 'lucide-react';

const ComplaintGenerator = () => {
  const [formData, setFormData] = useState({
    passengerName: '',
    passengerEmail: '',
    passengerAddress: '',
    flightNumber: '',
    airline: 'Air India',
    pnr: '',
    flightDate: '',
    departureAirport: '',
    arrivalAirport: '',
    issueType: 'delay',
    issueDescription: '',
    compensationAmount: '',
  });

  const [generatedContent, setGeneratedContent] = useState(null);

  const airlines = ['Air India', 'IndiGo', 'SpiceJet', 'Vistara', 'Go First'];
  const issueTypes = [
    { value: 'delay', label: 'Flight Delay' },
    { value: 'cancellation', label: 'Flight Cancellation' },
    { value: 'denied_boarding', label: 'Denied Boarding' },
    { value: 'baggage_loss', label: 'Lost Baggage' },
    { value: 'baggage_delay', label: 'Delayed Baggage' },
    { value: 'staff_behavior', label: 'Staff Behavior' },
    { value: 'other', label: 'Other Issues' },
  ];

  const generateComplaint = () => {
    const complaintEmail = `
Subject: Formal Complaint Regarding ${formData.airline} Flight ${formData.flightNumber}

To: ${formData.airline} Customer Relations Department

Dear Sir/Madam,

I am writing to formally complain about my recent flight experience with ${formData.airline}.

**Passenger Details:**
Name: ${formData.passengerName}
Email: ${formData.passengerEmail}
${formData.pnr ? `PNR: ${formData.pnr}` : ''}
${formData.passengerAddress ? `Address: ${formData.passengerAddress}` : ''}

**Flight Details:**
Airline: ${formData.airline}
Flight Number: ${formData.flightNumber}
Date: ${new Date(formData.flightDate).toLocaleDateString('en-IN')}
Route: ${formData.departureAirport} to ${formData.arrivalAirport}

**Issue Details:**
Type: ${issueTypes.find(i => i.value === formData.issueType)?.label}

Description:
${formData.issueDescription}

**Compensation Requested:**
${formData.compensationAmount ? `Amount: ₹${parseInt(formData.compensationAmount).toLocaleString('en-IN')}` : 'As per applicable regulations and airline policy'}

**Legal Basis:**
This complaint is made with reference to:
1. DGCA Civil Aviation Requirements Section 3, Series M, Part IV
2. Montreal Convention 1999 (for international flights)
3. ${formData.airline}'s published Conditions of Carriage

**Expected Resolution:**
I expect:
1. A formal acknowledgment of this complaint within 3 working days
2. A detailed investigation report
3. Appropriate compensation as per regulations
4. Measures to prevent recurrence of such issues

**Supporting Documents:**
I have attached copies of my ticket, boarding pass, and other relevant documents.

I look forward to your prompt response within 30 days as per regulatory requirements.

Sincerely,
${formData.passengerName}
${formData.passengerEmail}
${formData.passengerAddress ? formData.passengerAddress : ''}
`;

    const emailTemplate = {
      subject: `Formal Complaint Regarding ${formData.airline} Flight ${formData.flightNumber}`,
      to: 'customer.relations@' + formData.airline.toLowerCase().replace(/\s+/g, '') + '.com',
      cc: ['dgca@dgca.nic.in'],
      body: complaintEmail,
    };

    setGeneratedContent(emailTemplate);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent.body);
    alert('Complaint copied to clipboard!');
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex p-3 bg-purple-100 rounded-full mb-4">
          <FileText className="h-10 w-10 text-purple-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Complaint Letter Generator
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Generate professional complaint letters and email templates for airline issues. 
          Includes legal references and proper formatting.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Form */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Complaint Details
            </h2>

            <div className="space-y-6">
              {/* Passenger Info */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2 text-gray-500" />
                  Passenger Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.passengerName}
                      onChange={(e) => handleInputChange('passengerName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.passengerEmail}
                      onChange={(e) => handleInputChange('passengerEmail', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mailing Address
                    </label>
                    <textarea
                      value={formData.passengerAddress}
                      onChange={(e) => handleInputChange('passengerAddress', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      rows="2"
                      placeholder="Your complete address"
                    />
                  </div>
                </div>
              </div>

              {/* Flight Info */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Plane className="h-5 w-5 mr-2 text-gray-500" />
                  Flight Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Airline *
                    </label>
                    <select
                      value={formData.airline}
                      onChange={(e) => handleInputChange('airline', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      {airlines.map(airline => (
                        <option key={airline} value={airline}>{airline}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Flight Number *
                    </label>
                    <input
                      type="text"
                      value={formData.flightNumber}
                      onChange={(e) => handleInputChange('flightNumber', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="AI101"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      Flight Date *
                    </label>
                    <input
                      type="date"
                      value={formData.flightDate}
                      onChange={(e) => handleInputChange('flightDate', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      PNR / Booking Reference
                    </label>
                    <input
                      type="text"
                      value={formData.pnr}
                      onChange={(e) => handleInputChange('pnr', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="ABC123"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <MapPin className="h-4 w-4 inline mr-1" />
                      Departure Airport *
                    </label>
                    <input
                      type="text"
                      value={formData.departureAirport}
                      onChange={(e) => handleInputChange('departureAirport', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="DEL (Delhi)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <MapPin className="h-4 w-4 inline mr-1" />
                      Arrival Airport *
                    </label>
                    <input
                      type="text"
                      value={formData.arrivalAirport}
                      onChange={(e) => handleInputChange('arrivalAirport', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="BOM (Mumbai)"
                    />
                  </div>
                </div>
              </div>

              {/* Issue Details */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Issue Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Issue Type *
                    </label>
                    <select
                      value={formData.issueType}
                      onChange={(e) => handleInputChange('issueType', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      {issueTypes.map(issue => (
                        <option key={issue.value} value={issue.value}>{issue.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      value={formData.issueDescription}
                      onChange={(e) => handleInputChange('issueDescription', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      rows="4"
                      placeholder="Describe what happened in detail. Include dates, times, and specific issues..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Compensation Amount Requested (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.compensationAmount}
                      onChange={(e) => handleInputChange('compensationAmount', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="10000"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={generateComplaint}
                disabled={!formData.passengerName || !formData.passengerEmail || !formData.flightNumber}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg text-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FileText className="h-5 w-5 mr-2 inline" />
                Generate Complaint Letter
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Generated Content */}
        <div className="space-y-6">
          {generatedContent ? (
            <>
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Generated Complaint
                  </h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Text
                    </button>
                    <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center mb-2">
                      <Mail className="h-5 w-5 text-gray-500 mr-2" />
                      <h3 className="font-medium text-gray-900">Email Details</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">To: </span>
                        <span className="font-medium">{generatedContent.to}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Subject: </span>
                        <span className="font-medium">{generatedContent.subject}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">CC: </span>
                        <span className="font-medium">{generatedContent.cc.join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-xl p-4">
                    <div className="font-mono text-sm whitespace-pre-wrap bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                      {generatedContent.body}
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-yellow-900 mb-1">Next Steps</h4>
                        <ul className="text-yellow-700 text-sm space-y-1">
                          <li>1. Copy the complaint text above</li>
                          <li>2. Paste it into your email client</li>
                          <li>3. Attach supporting documents (ticket, boarding pass, photos)</li>
                          <li>4. Send to the airline's customer relations email</li>
                          <li>5. Keep a copy for your records</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center h-full flex flex-col justify-center">
              <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4 mx-auto">
                <FileText className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Your Complaint Letter
              </h3>
              <p className="text-gray-600 mb-4">
                Fill in the complaint details on the left to generate a professional complaint letter with legal references.
              </p>
              <ul className="text-sm text-gray-500 space-y-1 text-left">
                <li>✓ Properly formatted email template</li>
                <li>✓ Includes legal references</li>
                <li>✓ Ready to send to airline</li>
                <li>✓ Copyable text and downloadable PDF</li>
              </ul>
            </div>
          )}

          {/* Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-medium text-blue-900 mb-3">Tips for Effective Complaints</h3>
            <ul className="space-y-2 text-sm text-blue-700">
              <li className="flex items-start">
                <div className="h-5 w-5 bg-blue-100 rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">1</div>
                <span>Be specific with dates, times, and flight numbers</span>
              </li>
              <li className="flex items-start">
                <div className="h-5 w-5 bg-blue-100 rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">2</div>
                <span>Attach all relevant documents (tickets, boarding passes, photos)</span>
              </li>
              <li className="flex items-start">
                <div className="h-5 w-5 bg-blue-100 rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">3</div>
                <span>Keep copies of all communications with the airline</span>
              </li>
              <li className="flex items-start">
                <div className="h-5 w-5 bg-blue-100 rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">4</div>
                <span>Follow up if you don't receive a response within 30 days</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintGenerator;