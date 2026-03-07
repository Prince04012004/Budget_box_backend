import nodemailer from "nodemailer";
import dns from "dns";
import dotenv from "dotenv";
dotenv.config();

dns.setDefaultResultOrder("ipv4first");

export const sendmail = async (email, otp) => {
  try {

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
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
      <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>BudgetBox Verification</h2>
      <p>Your OTP code is <b>${otp}</b></p>
      </div>
      `
    };

    const info = await transporter.sendMail(mailoptions);

    console.log("Email sent:", info.messageId);
    return info;

  } catch (err) {
    console.error("FULL ERROR:", err);
    throw new Error("Failed to send email");
  }
};