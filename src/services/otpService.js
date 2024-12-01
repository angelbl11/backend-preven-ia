// Only for testing purposes
exports.sendOTP = async (phoneNumber) => {
  try {
    const verificationId = `test-verification-id-${phoneNumber}`;
    return verificationId;
  } catch (error) {
    console.error("Error simulating OTP send", error);
    throw new Error("Error sending OTP code");
  }
};

// Only for testing purposes
exports.verifyOTP = async (verificationId, otpCode) => {
  try {
    if (
      !verificationId.startsWith("test-verification-id-") ||
      otpCode !== "654321"
    ) {
      throw new Error("Invalid OTP code");
    }

    const idToken = `test-id-token-${verificationId}`;
    return idToken;
  } catch (error) {
    console.error("Error validating OTP:", error);
    throw new Error("Invalid OTP code");
  }
};
