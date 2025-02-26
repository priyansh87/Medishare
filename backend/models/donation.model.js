import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Donator
    medicine: { type: String, required: true }, // Name of the donated medicine
    quantity: { type: Number, required: true },
    image: { type: String, required: true }, // Image of the medicine for verification
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    adminResponse: { type: String },
    createdAt: { type: Date, default: Date.now },
});
  

export const DonationSchema = mongoose.model('DonationSchema', donationSchema);
  