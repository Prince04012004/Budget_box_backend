import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendmail = async (email, otp) => {
  try {

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const mailoptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "BudgetBox OTP",
      text: `Your OTP is ${otp}`
    };

    const info = await transporter.sendMail(mailoptions);

    console.log("Email sent:", info.messageId);

  } catch (err) {
    console.error("FULL ERROR:", err);
    throw new Error("Failed to send email");
  }
};