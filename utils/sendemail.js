export const sendmail = async (email, otp) => {
  // 1. Data Object tayyar karo jo EmailJS ko chahiye
  const data = {
    service_id: process.env.EMAILJS_SERVICE_ID,
    template_id: process.env.EMAILJS_TEMPLATE_ID,
    user_id: process.env.EMAILJS_PUBLIC_KEY,
    template_params: {
      to_email: email, // Right side wala variable
      passcode: otp,   // Template body wala variable {{passcode}}
    },
  };

  try {
    // 2. EmailJS API ko fetch call karo
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      console.log("✅ BudgetBox: OTP Sent Successfully via EmailJS!");
    } else {
      const errorText = await response.text();
      console.error("❌ EmailJS Error:", errorText);
      throw new Error(`EmailJS Error: ${errorText}`);
    }
  } catch (err) {
    console.error("❌ Critical Error in sendmail:", err.message);
    throw err;
  }
};