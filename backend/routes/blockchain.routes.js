import express from "express";
import { contractInstance } from "../app.js";
import { ethers } from "ethers";

const router = express.Router();

// ✅ Admin Only APIs

// Add Medicine
router.post("/api/medicines/add", async (req, res) => {
    try {
        const { batchNumber, name, brand, expiryDate, manufacturerDetails, manufacturer } = req.body;

        if (!batchNumber || !name || !brand || !expiryDate || !manufacturerDetails || !manufacturer) {
            return res.status(400).json({ error: "All fields are required" });
        }
        console.log("route called to add medicine ")

        const expiryTimestamp = Math.floor(new Date(expiryDate).getTime() / 1000);
        const tx = await contractInstance.addMedicine(
            batchNumber,
            name,
            brand,
            expiryTimestamp,
            manufacturerDetails,
            manufacturer
        );

        await tx.wait();
        const batchData = await contractInstance.verifyBatch("BATCH001");
        console.log(batchData);
        res.json({ success: true, batchId: batchNumber });
    } catch (error) {
        console.error("Error adding medicine:", error);
        res.status(500).json({ error: "Failed to add medicine" });
    }
});

// Verify Medicine
router.patch("/api/medicines/verify", async (req, res) => {
    try {
        const { batchNumber, status } = req.body;

        if (!batchNumber || typeof status !== "boolean") {
            return res.status(400).json({ error: "Invalid parameters" });
        }

        const tx = await contractInstance.verifyMedicine(batchNumber, status);
        await tx.wait();

        res.json({ success: true });
    } catch (error) {
        console.error("Error verifying medicine:", error);
        res.status(500).json({ error: "Failed to verify medicine" });
    }
});

router.post("/api/nfts/mint", async (req, res) => {
    try {
      const { batchNumber, manufacturer } = req.body;
      if (!batchNumber || !manufacturer) {
        return res.status(400).json({ error: "Batch number and manufacturer are required" });
      }
      
      console.log("Fetching medicine details for:", batchNumber);
      // Call the new view function to get all medicine details
      const medDetails = await contractInstance.getMedicineDetails(batchNumber,manufacturer);
      console.log("Medicine details from contract:", medDetails);
  
      // Compare the manufacturer addresses (case-insensitive)
      if (manufacturer.toLowerCase() !== medDetails.manufacturer.toLowerCase()) {
        return res.status(400).json({ error: "Manufacturer address does not match on-chain record." });
      }
      
      // If manufacturer addresses match, proceed to mint the NFT
      const tx = await contractInstance.authenticateBatch(batchNumber);
      const receipt = await tx.wait();
      const tokenId = receipt.events?.[0]?.args?.tokenId.toNumber();
  
      res.json({ success: true, tokenId });
    } catch (error) {
      console.error("Error minting NFT:", error);
      res.status(500).json({ error: "Failed to mint NFT" });
    }
  });
  

// ✅ Public APIs


// 📌 Route to fetch batch details
router.get("/api/verify/:batchNumber", async (req, res) => {
    try {
        const batchNumber = req.params.batchNumber;
        // Use callStatic to simulate the call
        const batchData = await contractInstance.verifyBatch(batchNumber);
        console.log(batchData.data)
        // Format the response
        const formattedResponse = {
            batchDetails: {
                isValid: batchData[0],
                isVerified: batchData[1],
                isAuthenticated: batchData[2],
                manufacturer: batchData[3],
                expiryDate: batchData[4]?.toString(), // Convert BigNumber to string
                isActive: batchData[5],
                tokenId: batchData[6]?.toString(),
                isNFTValid: batchData[7],
            },
        };
        res.json(formattedResponse);
    } catch (error) {
        console.error("Error fetching batch details:", error);
        res.status(500).json({ error: "Failed to fetch batch details" });
    }
});


// Get Manufacturer NFTs
router.get("/api/nfts/:manufacturer", async (req, res) => {
    try {
        const { manufacturer } = req.params;
        const nfts = await contractInstance.getManufacturerNFTs(manufacturer);
        res.json({ nfts });
    } catch (error) {
        console.error("Error fetching NFTs:", error);
        res.status(500).json({ error: "Failed to fetch NFTs" });
    }
});

// Check NFT Validity
router.get("/api/nft/status/:tokenId", async (req, res) => {
    try {
        const { tokenId } = req.params;
        const isValid = await contractInstance.isNFTValid(tokenId);
        res.json({ valid: isValid });
    } catch (error) {
        console.error("Error checking NFT status:", error);
        res.status(500).json({ error: "Failed to check NFT status" });
    }
});

export default router;
