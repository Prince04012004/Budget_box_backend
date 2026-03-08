import { Courier } from "@trycourier/courier";

const courier = new Courier({ 
  authorizationToken: process.env.COURIER_AUTH_TOKEN || "token_T5A1G7550RMQHJHHA1TEPHKVGZ7Y" 
});

export const sendmail = async (email, otp) => {
  try {
    // Naye SDK mein structure aise hota hai
    const response = await courier.send({
      message: {
        to: { email: email },
        template: "Gmail_otp", 
        data: {
          otp_code: otp, 
        },
      },
    });
    console.log("OTP Sent Successfully! ID:", response.requestId);
  } catch (err) {
    // Isse humein asli error pata chalega agar kuch galat hua
    console.error("Courier Actual Error:", err);
    throw err;
  }
};