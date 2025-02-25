import express from "express"  ;
import cookieParser from "cookie-parser";
import dotenv from "dotenv" ;
import cors from "cors";
import morgan from "morgan";

import userRoute from "./routes/user.routes.js"
import blockChainRoute from "./routes/blockchain.routes.js"
import { multerErrorHandler } from "./middlewares/multer.middleware.js";
dotenv.config() ; 
import { ethers } from 'ethers';
import { createRequire } from 'module';
import { JsonRpcProvider, Wallet, Contract } from 'ethers';

const require = createRequire(import.meta.url);
const { abi } = require("./artifacts/contracts/Medishare.sol/Medishare.json");

const API_URL = "http://127.0.0.1:8545"; // Hardhat local node
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const provider = new JsonRpcProvider(API_URL, {
  name: "localhost",
  chainId: 31337,
});

const signer = new ethers.Wallet(PRIVATE_KEY, provider);
export const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

const app = express() 

app.use(
    cors({
      origin: "http://localhost:5173",
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    })
);

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
  // Add the error handler middleware after all routes
  app.use(multerErrorHandler);
app.get("/", (req, res) => {
  res.send("Hello World");
});


// routes 
app.use("/users", userRoute);
app.use("/chain", blockChainRoute);


export default app;


// 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266