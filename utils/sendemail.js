import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // 587 ke liye false hi rahega
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS,
      },
      family: 4, // 🔥 Ye line IPv6 ko block karke IPv4 force karegi
      connectionTimeout: 20000, 
      tls: {
        rejectUnauthorized: false
      }
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
    console.error("Nodemailer Error:", err.message); 
    throw new Error("Failed to send email");
  }
};

export default sendmail;