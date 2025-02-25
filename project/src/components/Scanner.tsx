import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useDispatch } from 'react-redux';
import {
  setMedicineName,
  setExpiryDate,
  setQuantity,
  resetForm
} from '../store/slices/uploadSlice';
import axiosInstance from '../config/axios.config';

export default function Scanner() {
  const dispatch = useDispatch();

  const [scanResult, setScanResult] = useState<string | null>(null);
  const [batchNumber, setBatchNumber] = useState<string | null>(null);
  const [medicineName, setMedicineNameState] = useState<string | null>(null);
  const [brand, setBrand] = useState<string | null>(null);
  const [manufacturerDetails, setManufacturerDetails] = useState<string | null>(null);
  const [expiryDate, setExpiryDateState] = useState<string | null>(null);
  const [scanner, setScanner] = useState<Html5QrcodeScanner | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null);

  useEffect(() => {
    console.log("Initializing QR Scanner...");

    const newScanner = new Html5QrcodeScanner(
      'qr-reader',
      { fps: 10, qrbox: 250 },
      false
    );

    newScanner.render(
      (decodedText) => {
        console.log('✅ QR Code Scanned:', decodedText);
        try {
          const formattedJson = decodedText.replace(/'/g, '"');
          const parsedData = JSON.parse(formattedJson);

          console.log('📌 Parsed QR Data:', parsedData);

          const formattedExpiryDate = parsedData.expiryDate
            ? parsedData.expiryDate.split('T')[0]
            : '';

          // Updating Redux store
          dispatch(setMedicineName(parsedData.name || ''));
          dispatch(setExpiryDate(formattedExpiryDate));
          dispatch(setQuantity(parsedData.quantity || 1));

          // Updating local state
          setBatchNumber(parsedData.batchNumber || '');
          setMedicineNameState(parsedData.name || ''); 
          setBrand(parsedData.brand || '');
          setManufacturerDetails(parsedData.manufacturerDetails || '');
          setExpiryDateState(formattedExpiryDate);
          setScanResult(decodedText);

          // Stop the scanner after a successful scan
          newScanner.clear();
          setIsScanning(false);
        } catch (error) {
          console.error('❌ Error parsing QR code data:', error);
        }
      },
      (errorMessage) => {
        console.warn('⚠️ QR Code Scan Error:', errorMessage);
      }
    );

    setScanner(newScanner);
    setIsScanning(true);

    return () => {
      console.log("Cleaning up QR Scanner...");
      newScanner.clear();
    };
  }, [dispatch]);

  const handleVerify = async () => {
    if (!batchNumber) {
      setVerificationStatus('⚠️ No batch number available to verify.');
      return;
    }
    console.log("🔍 Verifying Batch Number:", batchNumber);

    try {
      const response = await axiosInstance.get(`/chain/api/verify/${batchNumber}`);
      console.log('🔄 Verification Response:', response.data);

      const { batchDetails } = response.data;
      if (batchDetails?.isVerified) {
        setVerificationStatus('✅ Batch Verified Successfully!');
      } else {
        setVerificationStatus('❌ Batch Verification Failed. This batch may not be authentic.');
      }
      dispatch(resetForm());
    } catch (error) {
      console.error('❌ Error verifying batch:', error);
      setVerificationStatus('⚠️ Error verifying batch. Please try again.');
      dispatch(resetForm());
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="donate">
      <div className="bg-white text-gray-900 rounded-xl shadow-lg p-6">
        <h2 className="text-3xl font-bold mb-6 text-center text-emerald-600">Scan Medicine QR Code</h2>

        <div id="qr-reader" className="mb-6 border-2 border-gray-300 rounded-lg p-4 bg-gray-100"></div>

        <div className="flex justify-center">
          <button
            onClick={() => setIsScanning(!isScanning)}
            className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition"
          >
            {isScanning ? 'Stop Scanning' : 'Start Scan'}
          </button>
        </div>

        <form className="grid grid-cols-1 gap-6 mt-6">
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
          </div>

          <button
            type="button"
            onClick={handleVerify}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition"
          >
            Verify Batch
          </button>

          <button
            type="button"
            className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition"
          >
            Donate Medicine
          </button>

          {verificationStatus && (
            <div
              className={`text-center font-semibold p-3 rounded-lg mt-4 ${
                verificationStatus.includes('✅')
                  ? 'bg-green-100 text-green-700 border border-green-500'
                  : 'bg-red-100 text-red-700 border border-red-500'
              }`}
            >
              {verificationStatus}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
