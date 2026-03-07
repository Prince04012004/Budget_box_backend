import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        // Check karo ki .env mein variables ka naam exactly yahi hai
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS,
      }
    });

    const mailoptions = {
      from: '"Budgetbox" <budgetbox2004@gmail.com>',
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It will expire in 5 minutes.`
    };

    // 🔥 FIX: sendMail (M capital) hoga
    const result = await transporter.sendMail(mailoptions); 
    return result;

  } catch (err) {
    // 🔥 Isse terminal mein asli wajah dikhegi
    console.error("Nodemailer Error Details:", err.message); 
    throw new Error("Failed to send email");
  }
};

export default sendmail;

