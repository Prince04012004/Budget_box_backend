import { CourierClient } from "@trycourier/courier";

// Ye values Render ke Environment Variables se uthayega
const courier = CourierClient({ 
  authorizationToken: process.env.COURIER_AUTH_TOKEN 
});

export const sendmail = async (email, otp) => {
  try {
    const { requestId } = await courier.send({
      message: {
        to: { email: email },
        template: "Gmail_otp", // Jo tumne Courier dashboard par banaya hai
        data: {
          otp_code: otp, // Ye tumhare {{otp_code}} variable se match karega
        },
      },
    });
    console.log("OTP Sent via Courier! ID:", requestId);
  } catch (err) {
    console.error("Courier Error:", err.message);
    throw err;
  }
};