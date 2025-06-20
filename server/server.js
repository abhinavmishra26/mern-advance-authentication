import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';

// This is needed for ES module-style paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Explicitly load .env from root directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log(process.env.SENDER_EMAIL, process.env.APP_PASS);





const app=express();
const port=process.env.PORT || 4000;




app.use(express.json());
app.use(cookieParser());
app.use(cors({origin:"http://localhost:5173",credentials:true}));



// app.get("/",(req,res)=>{
//     res.send("Api working");
// })
app.use("/api/auth",authRouter);
if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname,"/client/dist")));
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,"client","dist","index.html"));
    })
}


app.listen(port ,()=>{
    connectDB();
    console.log(`Server started on Port :${port}`)
});
