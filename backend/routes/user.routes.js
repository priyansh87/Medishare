import express from "express";
import { registerUser, loginUser, logoutUser, getUserProfile , uploadMedicalReport } from "../controllers/user.controllers.js";
import authMiddleware from "../middlewares/auth.middlewares.js";
import { multerErrorHandler, upload } from "../middlewares/multer.middleware.js";
import { analyzePdfWithGemini } from "../lib/geminiConfig/gemini.config.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", authMiddleware , logoutUser); 
router.get("/profile", authMiddleware, getUserProfile); // Protected route
// Route to handle PDF upload and processing
router.post('/upload', upload.single('pdfFile'), async (req, res) => {
    try {
      // Check if file is uploaded

      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      console.log("file is now being sent to gemini from routes ", )
      // Process the uploaded PDF (using a helper function like simulatePdfUpload)
      console.log(" yeh delkh ", req.file)
      const result = await analyzePdfWithGemini(req.file.path); // Assuming simulatePdfUpload handles the file path
  
      // Send the analysis result
      res.json({ message: 'Analysis complete', result: result });
    } catch (error) {
      console.error('Error during file upload and processing:', error);
      res.status(500).json({ error: 'Failed to process PDF' });
    }
  });
  

export default router;
