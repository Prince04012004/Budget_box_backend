import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS,
      },
      family: 4,
      connectionTimeout: 30000,
      greetingTimeout: 30000,
      socketTimeout: 30000,
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
          <p>This code will expire in 5 minutes.</p>
        </div>
      `
    };

    const result = await transporter.sendMail(mailoptions); 
    return result;

  } catch (err) {
    console.error("Nodemailer Error:", err.message); 
    throw new Error("Failed to send email");
  }
};

export default sendmail;