import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      // Hum direct Gmail ke server IP ko hit karenge
      host: "74.125.200.108", 
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS,
      },
      family: 4,
      connectionTimeout: 40000,
      tls: {
        // Ye line zaroori hai jab IP use kar rahe ho
        servername: "smtp.gmail.com",
        rejectUnauthorized: false
      }
    });

    const mailoptions = {
      from: `"BudgetBox" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verification Code - BudgetBox",
      html: `<p>Your OTP code is: <b>${otp}</b></p>`
    };

    return await transporter.sendMail(mailoptions); 

  } catch (err) {
    console.error("DEBUG ERROR:", err.message); 
    throw new Error("Failed to send email");
  }
};

export default sendmail;