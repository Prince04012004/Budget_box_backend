import { CourierClient } from "@trycourier/courier";

const courier = CourierClient({ 
  authorizationToken: process.env.COURIER_AUTH_TOKEN // token_T5A1G...
});

export const sendmail = async (email, otp) => {
  try {
    const { requestId } = await courier.send({
      message: {
        to: { 
          email: email 
        },
        template: "Gmail_otp", //
        data: {
          otp_code: otp, // Ye tumhare {{otp_code}} se match karega
        },
        // Routing add karne se mail jaldi deliver hota hai
        routing: {
          method: "single",
          channels: ["email"],
        },
      },
    });
    console.log("OTP Sent! Request ID:", requestId);
    return requestId;
  } catch (err) {
    console.error("Courier Error:", err.message);
    throw err;
  }
};