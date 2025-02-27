import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { RefreshCw, AlertCircle } from "lucide-react"
import axiosInstance from "../config/axios.config"
import { useSelector } from "react-redux"
import type { RootState } from "../store"
import { Navigate } from "react-router-dom"

interface MedicineDonation {
  _id: string
  medicine: string
  quantity: number
  status: "pending" | "approved" | "rejected"
  donorName: string
  createdAt: string
  batchNumber: string
  brand: string
  expiryDate: string
  manufacturerDetails: string
  manufacturer: string
}

const AdminPanel: React.FC = () => {
  const [medicineDonations, setMedicineDonations] = useState<MedicineDonation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [verifiedBatches, setVerifiedBatches] = useState<{ [key: string]: boolean }>({})
  const { user } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (!user?.role) return
    fetchMedicineDonations()
  }, [user])

  const fetchMedicineDonations = async () => {
    try {
      setLoading(true)
      const { data } = await axiosInstance.get("/users/donation/")
      console.log("called api donations")
      console.log(data)

      setMedicineDonations(data.map((item: any) => ({
        _id: item._id,
        medicine: item.medicine,
        quantity: item.quantity,
        status: item.status,
        donorName: item.user.name,
        createdAt: item.createdAt,
        batchNumber: item.batchNumber,
        brand: item.brand,
        expiryDate: item.expiryDate,
        manufacturerDetails: item.manufacturerDetails,
        manufacturer: item.manufacturer,
      })))
    } catch (err) {
      setError("Failed to fetch medicine donations")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyBatch = async (batchNumber: string) => {
    try {
        console.log(medicineDonations)
        console.log(batchNumber)
      const { data } = await axiosInstance.get(`/chain/api/verify/${batchNumber}`)
      console.log("yeh data verify krne pe ara hai from blokchain" , data?.batchDetails?.isVerified )
      if (data?.batchDetails?.isVerified) {
        setVerifiedBatches((prev) => ({ ...prev, [batchNumber]: true }))
        console.log("verify batches set to true " , verifiedBatches)
      }
    } catch (err) {
      setError("Failed to verify batch number")
    }
  }

  const handleAddToStore = async (donation: MedicineDonation) => {
    try {
      await axiosInstance.post("/store/medicine", {
        name: donation.medicine,
        batchNumber: donation.batchNumber,
        quantity: donation.quantity,
        brand: donation.brand,
        expiryDate: donation.expiryDate,
        manufacturer: donation.manufacturer,
      })
      alert("Medicine added to store successfully!")
    } catch (err) {
      setError("Failed to add medicine to store")
    }
  }

  if (!user?.role) return <Navigate to="/" replace />

  return (
    <div className="container mx-auto px-4 py-8 mt-16 max-w-full overflow-x-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-emerald-600 mb-6 text-center">Medicine Donations Administration</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-500 rounded-md flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-max divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["Medicine", "Quantity", "Donor", "Batch Number", "Brand", "Expiry Date", "Created At", "Verify", "Add to Store"].map((col) => (
                  <th key={col} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-xs md:text-sm">
              {medicineDonations.map((donation) => (
                <motion.tr key={donation._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="hover:bg-gray-100">
                  <td className="px-3 py-2 whitespace-nowrap">{donation.medicine}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{donation.quantity}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{donation.donorName}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{donation.batchNumber}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{donation.manufacturerDetails}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{new Date(donation.expiryDate).toLocaleDateString()}</td>
                  {/* <td className="px-3 py-2 whitespace-nowrap">{donation.manufacturer}</td> */}
                  <td className="px-3 py-2 whitespace-nowrap">{new Date(donation.createdAt).toLocaleDateString()}</td>
                  <td className="px-3 py-2">
                    <button onClick={() => handleVerifyBatch(donation.batchNumber)} className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 text-xs md:text-sm">
                      Verify
                    </button>
                  </td>
                  <td className="px-3 py-2">
                    {verifiedBatches[donation.batchNumber] && (
                      <button onClick={() => handleAddToStore(donation)} className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-xs md:text-sm">
                        Add to Store
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminPanel
