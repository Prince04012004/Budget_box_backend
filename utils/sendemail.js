import { CourierClient } from "@trycourier/courier";

// Fix: 'new CourierClient' use karo
const courier = new CourierClient({ 
  authorizationToken: process.env.COURIER_AUTH_TOKEN || "token_T5A1G7550RMQHJHHA1TEPHKVGZ7Y" 
});

export const sendmail = async (email, otp) => {
  try {
    // Ab ye function sahi se call hoga
    const response = await courier.send({
      message: {
        to: { email: email },
        template: "Gmail_otp", 
        data: {
          otp_code: otp, 
        },
      },
    });
    console.log("OTP Sent! ID:", response.requestId);
  } catch (err) {
    console.error("Courier Actual Error:", err.message);
    throw err;
  }
};