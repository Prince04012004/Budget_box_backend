import { Courier } from "@trycourier/courier";

// Is tarah likhne se Courier ko error dene ka mauka nahi milega
const courier = new Courier({ 
  apiKey: process.env.COURIER_AUTH_TOKEN || process.env.COURIER_API_KEY 
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
    console.log("OTP Sent! ID:", requestId);
  } catch (err) {
    console.error("Courier Error:", err.message);
    throw err;
  }
};