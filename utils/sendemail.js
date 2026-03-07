import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail', // 🔥 Ye Render ke liye sabse best hai
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS,
      },
      // IPv4 force karne ki ab bhi zaroorat pad sakti hai
      family: 4 
    });

    const mailoptions = {
      from: `"BudgetBox" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verification Code - BudgetBox",
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ddd;">
          <h2>BudgetBox Verification</h2>
          <p>Your OTP code is: <b style="font-size: 24px; color: #4A90E2;">${otp}</b></p>
        </div>
      `
    };

    return await transporter.sendMail(mailoptions); 

  } catch (err) {
    console.error("Final Debug Error:", err.message); 
    throw new Error("Failed to send email");
  }
};

export default sendmail;