import React from 'react';
import { Upload } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  setFile,
  setMedicineName,
  setExpiryDate,
  setQuantity,
  resetForm,
} from '../store/slices/uploadSlice';

export default function Scanner() {
  const dispatch = useDispatch();
  const { file, medicineName, expiryDate, quantity } = useSelector(
    (state: RootState) => state.upload
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        dispatch(setFile(reader.result as string));
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log({ file, medicineName, expiryDate, quantity });
    dispatch(resetForm());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="donate">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Donate Medicine</h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="medicine-image"
              />
              <label
                htmlFor="medicine-image"
                className="cursor-pointer flex flex-col items-center space-y-2"
              >
                <Upload className="h-8 w-8 text-gray-400" />
                <span className="text-sm text-gray-500">
                  Upload medicine package photo
                </span>
              </label>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="medicine-name" className="block text-sm font-medium text-gray-700">
                  Medicine Name
                </label>
                <input
                  type="text"
                  id="medicine-name"
                  value={medicineName}
                  onChange={(e) => dispatch(setMedicineName(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  placeholder="Enter medicine name"
                />
              </div>
              <div>
                <label htmlFor="expiry-date" className="block text-sm font-medium text-gray-700">
                  Expiry Date
                </label>
                <input
                  type="date"
                  id="expiry-date"
                  value={expiryDate}
                  onChange={(e) => dispatch(setExpiryDate(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  value={quantity || ''}
                  onChange={(e) => dispatch(setQuantity(Number(e.target.value)))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  placeholder="Enter quantity"
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Medicine Details</h3>
            {file ? (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-md shadow-sm">
                  <img
                    src={file}
                    alt="Medicine package"
                    className="w-full h-48 object-cover rounded-md"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => dispatch(setFile(null))}
                  className="text-sm text-emerald-600 hover:text-emerald-700"
                >
                  Remove image
                </button>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                Upload a clear photo of the medicine package to help us verify the details.
              </p>
            )}

            <button
              type="submit"
              className="mt-6 w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 transition-colors"
            >
              Submit Donation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}