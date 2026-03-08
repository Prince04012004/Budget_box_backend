export const sendmail = async (email, otp) => {
  const data = {
    service_id: process.env.EMAILJS_SERVICE_ID,
    template_id: process.env.EMAILJS_TEMPLATE_ID,
    user_id: process.env.EMAILJS_PUBLIC_KEY,
    private_key: process.env.EMAILJS_PRIVATE_KEY, // 👈 Bas ye ek line add karo
    template_params: {
      to_email: email, 
      passcode: otp,   // Aapke template ka variable {{passcode}}
    },
  };

  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      console.log("✅ BudgetBox: OTP Sent Successfully!");
    } else {
      const errorText = await response.text();
      console.error("❌ EmailJS Error:", errorText);
    }
  } catch (err) {
    console.error("❌ Critical Error in sendmail:", err.message);
  }
};