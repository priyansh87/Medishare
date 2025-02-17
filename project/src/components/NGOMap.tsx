import React from 'react';
import { MapPin } from 'lucide-react';

export default function NGOMap() {
  // In a real implementation, you would integrate with Google Maps API
  const mockNGOs = [
    {
      id: '1',
      name: 'HealthCare Foundation',
      address: '123 Main St, City',
      distance: '2.5 km',
    },
    {
      id: '2',
      name: 'Medical Aid Society',
      address: '456 Oak Ave, City',
      distance: '3.8 km',
    },
    {
      id: '3',
      name: 'Community Health NGO',
      address: '789 Pine Rd, City',
      distance: '5.2 km',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="ngos">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Nearby NGOs</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-gray-100 rounded-lg" style={{ minHeight: '400px' }}>
            {/* Google Maps would be integrated here */}
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500">Map view will be displayed here</p>
            </div>
          </div>

          <div className="space-y-4">
            {mockNGOs.map((ngo) => (
              <div
                key={ngo.id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-emerald-500 mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-900">{ngo.name}</h3>
                    <p className="text-sm text-gray-500">{ngo.address}</p>
                    <p className="text-sm text-emerald-600 mt-1">{ngo.distance}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}