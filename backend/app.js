import express from "express"  ;
import cookieParser from "cookie-parser";
import dotenv from "dotenv" ;
import cors from "cors";
import morgan from "morgan";

import userRoute from "./routes/user.routes.js"
import { multerErrorHandler } from "./middlewares/multer.middleware.js";
dotenv.config() ; 


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


export default app;


