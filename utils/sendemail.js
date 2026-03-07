// Purana import hatao aur ye likho:
import { Courier } from "@trycourier/courier";

const courier = new Courier({ 
  authorizationToken: process.env.COURIER_AUTH_TOKEN 
});

export const sendmail = async (email, otp) => {
  try {
    const { requestId } = await courier.send({
      message: {
        to: { email: email },
        template: "Gmail_otp", 
        data: {
          otp_code: otp, 
        },
      },
    });
    console.log("OTP Sent via Courier! ID:", requestId);
  } catch (err) {
    console.error("Courier Error:", err.message);
    throw err;
  }
};