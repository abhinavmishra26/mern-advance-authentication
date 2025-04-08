import jwt from "jsonwebtoken";
import userModel from "../Models/userModel.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import crypto from "crypto";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail ,sendWelcomeEmail ,sendPasswordResetEmail ,sendResetSuccessEmail} from "../sendEmail/email.js";

import User from "../Models/userModel.js";
dotenv.config();
export const signup=async(req,res)=>{
    const {name ,email,password}=req.body;
   
    try{
        if(!name|| !email || !password){
            // throw new Error("Missing details");
           return res.status(400).json({ success: false, message: "Missing details" });
        }
        const userAlreadyExists=await userModel.findOne({email});
        if(userAlreadyExists){
            return res.status(400).json({success:false,message:"User already exists"});
        }
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
        const verificationToken=Math.floor(100000 + Math.random()*900000).toString();

        const user=await userModel.create({
            name,
            email,
            password:hashedPassword,
            verificationToken,
            verificationTokenExpiresAt:Date.now()+ 24 * 60 *60 *1000,
        })
        generateTokenAndSetCookie(res,user._id);
        

        await sendVerificationEmail(user.email,verificationToken);
       
        
        res.status(201).json({
            success:true,
            message:"User created successfully",
            user:{
                ...user._doc,
                password:undefined,
            }
        })

    }
    catch(error){
        res.status(400).json({
            success:false,
            message:error.message
        })
    }

}

export const verifyEmail=async(req,res)=>{
    const{code}=req.body;
    try{
        const user=await User.findOne({
            verificationToken:code,
            verificationTokenExpiresAt:{$gt:Date.now()}
        })
        if(!user){
            return res.status(400).json({success:false,message:"Invalid or expired verification code"})
        }
        user.isVerified=true;
        user.verificationToken=undefined;
        user.verificationTokenExpiresAt=undefined;
       await user.save();
       await sendWelcomeEmail(user.email,user.name);

       res.status(200).json({
        success:true,
        message:"Email verified successfully",
        user:{
            ...user._doc,
            password:undefined,
        },
       });
    }
    catch(error){
        return res.json({
            success:false,
            message:error.message
        })

    }
}


export const login=async(req,res)=>{
    const {email,password}=req.body;

    if(!email || !password){
        return res.json({success:false,message:"Email and password are required"})
    }
    try{

    const user=await userModel.findOne({email});
    if(!user){
        return res.json({success:false,message:"email does not registered"});
    }
    const comparePassword=await bcrypt.compare(password,user.password);
    if(!comparePassword){
        return res.json({success:false,message:"Invalid Password"});
    }
    generateTokenAndSetCookie(res,user._id);
    user.lastLogin=new Date();
    await user.save();
    return res.json({success:true , message:"Login Successfully",user:{
        ...user._doc,
        password:undefined,
    }});
    
    }
    catch(error){
        return res.json({
            success:false,
            message:error.message
        })

    }

}


export const Logout=async(req,res)=>{
    try{
        res.clearCookie("token",{
            httpOnly:true,
            secure: process.env.NODE_ENV==="production",
            sameSite: process.env.NODE_ENV==="production"?  "none":"strict",
        })
        return res.json({success:true ,message:"Logged Out successfully"});

    }
    catch(error){
        return res.json({
            success:false,
            message:error.message
        })

    }

}

export const forgetPassword=async(req,res)=>{
    const {email}=req.body;
    try{
        const user=await userModel.findOne({email});
        if(!user){
            return res.status(400).json({success:false,message:"User not found"});

        }

        const resettoken=crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt=Date.now()+1*60*60*1000;

        user.resetPasswordToken=resettoken;
        user.resetPasswordExpiresAt=resetTokenExpiresAt;
        await user.save();

        await sendPasswordResetEmail(email,`${process.env.CLIENT_URL}/reset-password/${resettoken}`);
        res.status(200).json({
            success:true,
            message:"Password reset Link sent to your email"
        });
    }
    catch(error){
        res.status(400).json({
            success:false,
            error:error.message,
        })

    }

}


export const resetPassword=async(req,res)=>{
    const {token}=req.params;
    const {password}=req.body;
    try{
        const user=await userModel.findOne({
            resetPasswordToken:token,
            resetPasswordExpiresAt:{$gt:Date.now()}
        })
        if(!user){
           return res.status(400).json({success:false,message:"Invalid or Expire Token"})
        }
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
        user.password=hashedPassword;
        user.resetPasswordToken=undefined;
        user.resetPasswordExpiresAt=undefined;
        await user.save();

        await sendResetSuccessEmail(user.email);
        res.status(200).json({ success:true,message:"Password Reset Successfully"});

    }
    catch(error){
        res.status(500).json({
            success:false,
            message:error.message,
        })

    }

}


export const checkAuth=async(req,res)=>{
    try{
        const user=await userModel.findById(req.userId).select("-password");
        if(!user){
            return res.status(400).json({success:true,message:"No user Found"});
         }
        res.status(200).json({
            success:true, user
            // user:{
            //     ...user._doc,
            //     password:undefined;

            // }
        })
    }
    catch(error){
        res.status(500).json({success:false,message:error.message});

    }

}