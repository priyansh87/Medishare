const TransactionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Claimer
    medicine: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true }, // Medicine claimed
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' }, // Transaction status
    transactionDate: { type: Date, default: Date.now },
  }, { timestamps: true });
  
  export const Transaction = mongoose.model('Transaction', TransactionSchema);
  