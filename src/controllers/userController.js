const userService = require("../services/userService");

exports.register = async (req, res) => {
  try {
    const { phoneNumber, password, personalInfo } = req.body;

    if (!phoneNumber || !password) {
      return res.errorResponse(
        "Invalid request",
        400,
        "Se necesita un número de teléfono y una contraseña"
      );
    }

    const newUser = await userService.registerUser(
      phoneNumber,
      password,
      personalInfo
    );

    res.successResponse(
      newUser,
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
    const { phoneNumber, password } = req.body;
    if (!phoneNumber || !password) {
      return res.errorResponse(
        "Invalid request",
        400,
        "Se necesita un número de teléfono y una contraseña"
      );
    }

    const userData = await userService.loginUser(phoneNumber, password);

    res.successResponse(
      userData,
      "User logged in successfully",
      "Usuario autenticado exitosamente"
    );
  } catch (e) {
    console.error("Error logging in user:", e);
    res.errorResponse(e.message, 400, "Error autenticando usuario");
  }
};
