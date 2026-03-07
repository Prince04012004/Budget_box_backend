import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendmail = async (email, otp) => {
  try {
    const data = await resend.emails.send({
      from: "BudgetBox <onboarding@resend.dev>",
      to: email,
      subject: "BudgetBox OTP",
      html: `<h2>Your OTP is ${otp}</h2>`
    });

    console.log("Email sent:", data);
  } catch (error) {
    console.error("Email error:", error);
  }
};