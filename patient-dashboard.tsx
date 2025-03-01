import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, Clock, Activity, Heart, Thermometer, User, FileText, MessageSquare, PlusCircle } from 'lucide-react';

// Sample data for demonstration
const heartRateData = [
  { date: 'Mon', value: 72 },
  { date: 'Tue', value: 75 },
  { date: 'Wed', value: 68 },
  { date: 'Thu', value: 71 },
  { date: 'Fri', value: 74 },
  { date: 'Sat', value: 69 },
  { date: 'Sun', value: 67 }
];

const bloodPressureData = [
  { date: 'Mon', systolic: 120, diastolic: 80 },
  { date: 'Tue', systolic: 122, diastolic: 82 },
  { date: 'Wed', systolic: 119, diastolic: 79 },
  { date: 'Thu', systolic: 121, diastolic: 81 },
  { date: 'Fri', systolic: 124, diastolic: 83 },
  { date: 'Sat', systolic: 118, diastolic: 78 },
  { date: 'Sun', systolic: 120, diastolic: 80 }
];

const medications = [
  { id: 1, name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', timeOfDay: 'Morning', nextDose: '8:00 AM' },
  { id: 2, name: 'Metoprolol', dosage: '25mg', frequency: 'Twice daily', timeOfDay: 'Morning/Evening', nextDose: '8:00 PM' },
  { id: 3, name: 'Aspirin', dosage: '81mg', frequency: 'Once daily', timeOfDay: 'Morning', nextDose: '8:00 AM Tomorrow' }
];

const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Heart Health Monitor</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <span className="ml-2 text-gray-700">John Smith</span>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'overview' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'medications' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('medications')}
          >
            Medications
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'records' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('records')}
          >
            Medical Records
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'messages' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('messages')}
          >
            Messages
          </button>
        </div>
        
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-red-100 text-red-500">
                    <Heart className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500 font-medium">Heart Rate</p>
                    <h3 className="text-2xl font-bold text-gray-900">72 BPM</h3>
                    <p className="text-sm text-green-500">Normal range</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-500">
                    <Activity className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500 font-medium">Blood Pressure</p>
                    <h3 className="text-2xl font-bold text-gray-900">120/80 mmHg</h3>
                    <p className="text-sm text-green-500">Normal range</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100 text-purple-500">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500 font-medium">Next Appointment</p>
                    <h3 className="text-lg font-bold text-gray-900">March 15, 2025</h3>
                    <p className="text-sm text-gray-500">Dr. Johnson - 10:30 AM</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-medium text-gray-700 mb-4">Heart Rate - Last 7 Days</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={heartRateData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[60, 80]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="value" stroke="#ef4444" name="Heart Rate (BPM)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-medium text-gray-700 mb-4">Blood Pressure - Last 7 Days</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={bloodPressureData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[70, 130]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="systolic" stroke="#3b82f6" name="Systolic (mmHg)" />
                      <Line type="monotone" dataKey="diastolic" stroke="#93c5fd" name="Diastolic (mmHg)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            {/* Upcoming Medications */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="font-medium text-gray-700">Today's Medications</h3>
                <button className="flex items-center text-sm text-blue-600 hover:text-blue-800">
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Add Medication
                </button>
              </div>
              <div className="divide-y divide-gray-200">
                {medications.map(med => (
                  <div key={med.id} className="p-6 flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-900">{med.name}</h4>
                      <p className="text-sm text-gray-500">{med.dosage} - {med.frequency}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">Next Dose</p>
                      <p className="text-sm text-gray-500">{med.nextDose}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Placeholder for other tabs */}
        {activeTab === 'medications' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Medication Management</h2>
            <p className="text-gray-600">View and manage your medications here.</p>
          </div>
        )}
        
        {activeTab === 'records' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Medical Records</h2>
            <p className="text-gray-600">Access your medical records and test results here.</p>
          </div>
        )}
        
        {activeTab === 'messages' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Doctor Communication</h2>
            <p className="text-gray-600">Message your healthcare providers here.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default PatientDashboard;
