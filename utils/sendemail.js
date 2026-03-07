import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendmail = async (email, otp) => {
  try {

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      family: 4, // force IPv4
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailoptions = {
      from: `"BudgetBox" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verification Code - BudgetBox",
      html: `
      <div style="font-family: Arial; padding:20px;">
        <h2>BudgetBox Verification</h2>
        <p>Your OTP is <b>${otp}</b></p>
        <p>This code will expire in 10 minutes.</p>
      </div>
      `
    };

    const info = await transporter.sendMail(mailoptions);

    console.log("Email sent successfully:", info.messageId);
    return info;

  } catch (err) {

    console.error("FULL ERROR:", err);
    throw new Error("Failed to send email");

  }
};