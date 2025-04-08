import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import dotenv from "dotenv";
import path from "path";
dotenv.config();


const app=express();
const port=process.env.PORT || 4000;
const __dirname=path.resolve();



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