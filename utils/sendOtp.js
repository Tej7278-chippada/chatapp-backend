// Mock function to send OTP
const sendOtp = (email, otp) => {
    // Use email/SMS API to send OTP
    console.log(`Sending OTP ${otp} to ${email}`);
  };
  module.exports = sendOtp;
  