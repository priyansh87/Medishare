import React, { useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  setMedicineName,
  setExpiryDate,
  setQuantity,
  resetForm,
} from '../store/slices/uploadSlice';

export default function Scanner() {
  const dispatch = useDispatch();
  const { medicineName, expiryDate, quantity } = useSelector(
    (state: RootState) => state.upload
  );
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [batchNumber, setBatchNumber] = useState<string | null>(null);
  const [brand, setBrand] = useState<string | null>(null);
  const [manufacturerDetails, setManufacturerDetails] = useState<string | null>(null);
  const [scanner, setScanner] = useState<Html5QrcodeScanner | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const startScan = () => {
    if (!isScanning) {
      const newScanner = new Html5QrcodeScanner(
        'qr-reader',
        { fps: 10, qrbox: 250 },
        false
      );

      newScanner.render(
        (decodedText) => {
          console.log('Scanned Data:', decodedText);
          setScanResult(decodedText);
          try {
            const parsedData = JSON.parse(decodedText);
            dispatch(setMedicineName(parsedData.name || ''));
            dispatch(setExpiryDate(parsedData.expiryDate || ''));
            dispatch(setQuantity(parsedData.quantity || 1));
            setBatchNumber(parsedData.batchNumber || '');
            setBrand(parsedData.brand || '');
            setManufacturerDetails(parsedData.manufacturerDetails || '');
          } catch (error) {
            console.error('Error parsing QR code data:', error);
          }
          newScanner.clear(); // Close scanner after successful scan
          setIsScanning(false);
        },
        (errorMessage) => {
          console.warn('QR Code Scan Error:', errorMessage);
        }
      );
      setScanner(newScanner);
      setIsScanning(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ scanResult, medicineName, expiryDate, quantity, batchNumber, brand, manufacturerDetails });
  };

  const handleVerify = () => {
    console.log({ batchNumber });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="donate">
      <div className="bg-white text-gray-900 rounded-xl shadow-lg p-6">
        <h2 className="text-3xl font-bold mb-6 text-center text-emerald-600">Scan Medicine QR Code</h2>
        <button
          type="button"
          onClick={startScan}
          className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-700 transition mb-4"
        >
          Start Scan
        </button>
        <div id="qr-reader" className="mb-6 border-2 border-gray-300 rounded-lg p-4 bg-gray-100"></div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Batch Number</label>
              <input
                type="text"
                value={batchNumber || ''}
                readOnly
                className="w-full p-2 rounded-md bg-gray-200 text-gray-900 border border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Medicine Name</label>
              <input
                type="text"
                value={medicineName || ''}
                readOnly
                className="w-full p-2 rounded-md bg-gray-200 text-gray-900 border border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Brand</label>
              <input
                type="text"
                value={brand || ''}
                readOnly
                className="w-full p-2 rounded-md bg-gray-200 text-gray-900 border border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Manufacturer Details</label>
              <input
                type="text"
                value={manufacturerDetails || ''}
                readOnly
                className="w-full p-2 rounded-md bg-gray-200 text-gray-900 border border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Expiry Date</label>
              <input
                type="date"
                value={expiryDate || ''}
                readOnly
                className="w-full p-2 rounded-md bg-gray-200 text-gray-900 border border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Quantity</label>
              <input
                type="number"
                min="1"
                value={quantity || ''}
                readOnly
                className="w-full p-2 rounded-md bg-gray-200 text-gray-900 border border-gray-300"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-700 transition"
          >
            Submit Donation
          </button>
          <button
            type="button"
            onClick={handleVerify}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition"
          >
            Verify Batch
          </button>
        </form>
      </div>
    </div>
  );
}
