import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Standard service use karo, IP ki zaroorat nahi
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, // Bina space wala password
      },
    });

    const mailoptions = {
      from: `"BudgetBox" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verification Code - BudgetBox",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;">
          <h2 style="color: #4CAF50;">BudgetBox Verification</h2>
          <p>Your OTP code is: <b style="font-size: 24px;">${otp}</b></p>
          <p>This code is valid for 10 minutes.</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailoptions);
    console.log("Email sent successfully:", info.messageId);
    return info;

  } catch (err) {
    console.error("DEBUG ERROR:", err.message); 
    throw new Error("Failed to send email");
  }
};

export default sendmail;