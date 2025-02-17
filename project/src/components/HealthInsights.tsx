import React, { useState } from 'react';
import { FileText, Brain, AlertCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setCurrentReport, addReport } from '../store/slices/healthSlice';
import { useNavigate } from 'react-router-dom';

export default function HealthInsights() {
  const [file, setFile] = useState<File | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      setFile(files[0]);
    }
  };

  const handleAnalyze = () => {
    if (file) {
      // Simulated report analysis - in a real app, this would be an API call
      const mockReport = {
        id: Date.now().toString(),
        userId: 'user123',
        uploadDate: new Date().toISOString(),
        summary: 'Annual Health Checkup Report',
        insights: [
          'Blood pressure is slightly elevated',
          'Cholesterol levels are within normal range',
          'Vitamin D deficiency detected'
        ],
        recommendations: [
          'Consider reducing sodium intake',
          'Maintain current exercise routine',
          'Start Vitamin D supplementation'
        ],
        patientInfo: {
          name: 'John Doe',
          age: 35,
          gender: 'Male'
        },
        diagnoses: [
          {
            condition: 'Mild Hypertension',
            medications: [
              {
                name: 'Amlodipine',
                dosage: '5mg',
                frequency: 'Once daily'
              }
            ]
          }
        ]
      };

      dispatch(addReport(mockReport));
      dispatch(setCurrentReport(mockReport));
      navigate('/report-analysis');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="insights">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Health Insights</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
                id="health-report"
              />
              <label
                htmlFor="health-report"
                className="cursor-pointer flex flex-col items-center space-y-2"
              >
                <FileText className="h-8 w-8 text-gray-400" />
                <span className="text-sm text-gray-500">
                  Upload your health report
                </span>
              </label>
            </div>

            {file && (
              <div className="mt-4 space-y-4">
                <div className="p-4 bg-emerald-50 rounded-lg">
                  <p className="text-sm text-emerald-700">
                    Selected file: {file.name}
                  </p>
                </div>
                <button
                  onClick={handleAnalyze}
                  className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 transition-colors"
                >
                  Analyze Report
                </button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Brain className="h-5 w-5 text-emerald-600" />
                <h3 className="font-medium text-gray-900">AI Analysis</h3>
              </div>
              <p className="text-sm text-gray-500">
                Upload your health report to get AI-powered insights and recommendations
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <AlertCircle className="h-5 w-5 text-emerald-600" />
                <h3 className="font-medium text-gray-900">Privacy Notice</h3>
              </div>
              <p className="text-sm text-gray-500">
                Your health data is encrypted and processed securely. We never store your original reports.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}