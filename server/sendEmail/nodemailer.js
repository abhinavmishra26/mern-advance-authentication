import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Get current file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from one directory up from backend/
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import nodemailer from "nodemailer";

const transporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.SENDER_EMAIL,
        pass:process.env.APP_PASS,
    }
});

console.log("Email:", process.env.SENDER_EMAIL);
console.log("App Password:", process.env.APP_PASS ? "✔️ present" : "❌ missing");
export const sendEmail = async (to, subject, html) => {
    try {
      await transporter.sendMail({
        from: process.env.SENDER_EMAIL,
        to,
        subject,
        html,
      });
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  };
  



