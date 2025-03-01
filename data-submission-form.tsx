import React, { useState } from 'react';
import { Calendar, Upload, Check, AlertCircle } from 'lucide-react';

const DataSubmissionForm = () => {
  const [formType, setFormType] = useState('vitals');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  // Vitals form state
  const [vitalsForm, setVitalsForm] = useState({
    heartRate: '',
    systolicBP: '',
    diastolicBP: '',
    weight: '',
    notes: ''
  });
  
  // Biological sample form state
  const [bioSampleForm, setBioSampleForm] = useState({
    sampleType: 'blood',
    collectionDate: '',
    labId: '',
    notes: '',
    file: null
  });
  
  // File upload state
  const [selectedFile, setSelectedFile] = useState(null);
  
  // Handle vitals form changes
  const handleVitalsChange = (e) => {
    const { name, value } = e.target;
    setVitalsForm({
      ...vitalsForm,
      [name]: value
    });
  };
  
  // Handle biological sample form changes
  const handleBioSampleChange = (e) => {
    const { name, value } = e.target;
    setBioSampleForm({
      ...bioSampleForm,
      [name]: value
    });
  };
  
  // Handle file upload
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setBioSampleForm({
        ...bioSampleForm,
        file: e.target.files[0]
      });
    }
  };
  
  // Submit vitals form
  const submitVitalsForm = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Submitting vitals data:', vitalsForm);
      
      // Reset form after successful submission
      setVitalsForm({
        heartRate: '',
        systolicBP: '',
        diastolicBP: '',
        weight: '',
        notes: ''
      });
      
      setSubmitSuccess(true);
    } catch (error) {
      setSubmitError('Failed to submit data. Please try again.');
      console.error('Error submitting vitals:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Submit biological sample form
  const submitBioSampleForm = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Submitting biological sample data:', bioSampleForm);
      
      // Reset form after successful submission
      setBioSampleForm({
        sampleType: 'blood',
        collectionDate: '',
        labId: '',
        notes: '',
        file: null
      });
      setSelectedFile(null);
      
      setSubmitSuccess(true);
    } catch (error) {
      setSubmitError('Failed to submit sample data. Please try again.');
      console.error('Error submitting sample data:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Submit Health Data</h2>
      
      {/* Form Type Selector */}
      <div className="flex mb-6 border-b border-gray-200">
        <button
          className={`px-4 py-2 font-medium ${formType === 'vitals' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setFormType('vitals')}
        >
          Vital Signs
        </button>
        <button
          className={`px-4 py-2 font-medium ${formType === 'bioSample' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setFormType('bioSample')}
        >
          Biological Sample
        </button>
        <button
          className={`px-4 py-2 font-medium ${formType === 'imaging' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setFormType('imaging')}
        >
          Medical Imaging
        </button>
        <button
          className={`px-4 py-2 font-medium ${formType === 'questionnaire' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setFormType('questionnaire')}
        >
          Questionnaire
        </button>
      </div>
      
      {/* Success Message */}
      {submitSuccess && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded flex items-center">
          <Check className="h-5 w-5 mr-2" />
          <span>Data submitted successfully!</span>
        </div>
      )}
      
      {/* Error Message */}
      {submitError && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{submitError}</span>
        </div>
      )}
      
      {/* Vitals Form */}
      {formType === 'vitals' && (
        <form onSubmit={submitVitalsForm}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="heartRate">
                Heart Rate (BPM)
              </label>
              <input
                type="number"
                id="heartRate"
                name="heartRate"
                value={vitalsForm.heartRate}
                onChange={handleVitalsChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                placeholder="Enter heart rate"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="bloodPressure">
                Blood Pressure (mmHg)
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  id="systolicBP"
                  name="systolicBP"
                  value={vitalsForm.systolicBP}
                  onChange={handleVitalsChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                  placeholder="Systolic"
                  required
                />
                <span className="flex items-center text-gray-500">/</span>
                <input
                  type="number"
                  id="diastolicBP"
                  name="diastolicBP"
                  value={vitalsForm.diastolicBP}
                  onChange={handleVitalsChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                  placeholder="Diastolic"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="weight">
                Weight (kg)
              </label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={vitalsForm.weight}
                onChange={handleVitalsChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                placeholder="Enter weight"
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="notes">
              Additional Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={vitalsForm.notes}
              onChange={handleVitalsChange}
              rows="3"
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
              placeholder="Any additional information about your readings"
            ></textarea>
          </div>
          
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Vital Signs'}
          </button>
        </form>
      )}
      
      {/* Biological Sample Form */}
      {formType === 'bioSample' && (
        <form onSubmit={submitBioSampleForm}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="sampleType">
                Sample Type
              </label>
              <select
                id="sampleType"
                name="sampleType"
                value={bioSampleForm.sampleType}
                onChange={handleBioSampleChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                required
              >
                <option value="blood">Blood</option>
                <option value="urine">Urine</option>
                <option value="saliva">Saliva</option>
                <option value="tissue">Tissue</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="collectionDate">
                Collection Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="collectionDate"
                  name="collectionDate"
                  value={bioSampleForm.collectionDate}
                  onChange={handleBioSampleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                  required
                />
                <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="labId">
                Lab ID (if available)
              </label>
              <input
                type="text"
                id="labId"
                name="labId"
                value={bioSampleForm.labId}
                onChange={handleBioSampleChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                placeholder="Enter lab identification"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="file">
                Lab Report (PDF, CSV)
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col w-full h-32 border-2 border-dashed border-gray-300 rounded hover:bg-gray-50 hover:border-gray-400 transition cursor-pointer">
                  <div className="flex flex-col items-center justify-center pt-7">
                    <Upload className="h-10 w-10 text-gray-400" />
                    <p className="pt-1 text-sm text-gray-500">
                      {selectedFile ? selectedFile.name : 'Upload a file'}
                    </p>
                  </div>
                  <input
                    type="file"
                    id="file"
                    name="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.csv,.xlsx,.xls"
                  />
                </label>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="bioNotes">
              Notes
            </label>
            <textarea
              id="bioNotes"
              name="notes"
              value={bioSampleForm.notes}
              onChange={handleBioSampleChange}
              rows="3"
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
              placeholder="Any additional information about this sample"
            ></textarea>
          </div>
          
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Sample Information'}
          </button>
        </form>
      )}
      
      {/* Placeholders for other form types */}
      {formType === 'imaging' && (
        <div className="text-center py-10">
          <h3 className="text-lg font-medium text-gray-700">Medical Imaging Upload</h3>
          <p className="text-gray-500 mt-2">Medical imaging upload form will be implemented here.</p>
        </div>
      )}
      
      {formType === 'questionnaire' && (
        <div className="text-center py-10">
          <h3 className="text-lg font-medium text-gray-700">Health Questionnaire</h3>
          <p className="text-gray-500 mt-2">Health questionnaire form will be implemented here.</p>
        </div>
      )}
    </div>
  );
};

export default DataSubmissionForm;
