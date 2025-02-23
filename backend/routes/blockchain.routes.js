import express from "express";
import { contractInstance } from "../app.js";
import { ethers } from "ethers";

const router = express.Router();

// ✅ Add Medicine API
router.post("/addMedicine", async (req, res) => {
    try {
        const { batchNumber, name, brand, expiryDate, manufacturerDetails, manufacturer } = req.body;
        console.log("in the api: ")
        // 🛑 Validate input
        if (!batchNumber || !name || !brand || !expiryDate || !manufacturerDetails || !manufacturer) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // 🔹 Convert expiryDate to a BigNumber (Solidity expects uint256)
        const expiryTimestamp = Math.floor(new Date(expiryDate).getTime() / 1000);

        // 🔹 Send transaction to the smart contract
        const tx = await contractInstance.addMedicine(
            batchNumber,
            name,
            brand,
            expiryTimestamp,
            manufacturerDetails,
            manufacturer
        );

        await tx.wait(); // Wait for transaction confirmation

        res.json({ success: true, message: "Medicine added successfully", transactionHash: tx.hash });
    } catch (error) {
        console.error("Error adding medicine:", error);
        res.status(500).json({ error: "Failed to add medicine" });
    }
});

export default router;
