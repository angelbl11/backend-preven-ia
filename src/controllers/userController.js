const userService = require("../services/userService");
const otpService = require("../services/otpService");

exports.register = async (req, res) => {
  try {
    //   const { idToken, additionalData } = req.body; -> Prod code
    const { phoneNumber, additionalData } = req.body; // -> Test code
    await otpService.sendOTP(phoneNumber);
    // if (!idToken) {
    //   return res.errorResponse(
    //     "Invalid request",
    //     400,
    //     "Se necesita un token de autenticación"
    //   );
    // }
    // const { userId, phoneNumber } = await userService.verifyPhoneNumber(
    //   idToken
    // ); -> Prod code

    const userId = `test-uid-${phoneNumber}`; // -> Test code

    const newUser = await userService.registerUser(
      userId,
      phoneNumber,
      additionalData || {}
    );

    if (!newUser || Object.keys(newUser).length === 0) {
      res.errorResponse(
        "Error registering user",
        500,
        "Error registrando usuario"
      );
      throw new Error("Error registering user");
    }

    res.successResponse(
      { user: newUser },
      "User registered successfully",
      "Usuario registrado exitosamente"
    );
  } catch (e) {
    console.error("Error registering user:", e);
    res.errorResponse(e.message, 500, "Error registrando usuario");
  }
};

exports.login = async (req, res) => {
  try {
    // const { idToken } = req.body;
    // if (!idToken) {
    //   return res.errorResponse(
    //     "Invalid request",
    //     400,
    //     "Se necesita un token de autenticación"
    //   );
    // } -> Prod code

    const { phoneNumber, otpCode } = req.body; // -> Test code
    if (!phoneNumber || !otpCode) {
      return res.errorResponse(
        "Invalid request",
        400,
        "Se necesitan el número de teléfono y el código OTP."
      );
    }

    const verificationId = `test-verification-id-${phoneNumber}`;
    await otpService.verifyOTP(verificationId, otpCode);

    // const { userId } = await userService.verifyPhoneNumber(idToken); -> Prod code
    const userId = `test-uid-${phoneNumber}`; // -> Test code
    const userData = await userService.loginUser(userId);

    if (!userData || Object.keys(userData).length === 0) {
      res.errorResponse("User does not exist", 404, "Usuario no encontrado");
      throw new Error("User does not exist");
    }
    res.successResponse(
      { user: userData },
      "User logged in successfully",
      "Usuario autenticado exitosamente"
    );
  } catch (e) {
    console.error("Error logging in user:", e);
    res.errorResponse(e.message, 400, "Error autenticando usuario");
  }
};
