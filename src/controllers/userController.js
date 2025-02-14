const userService = require("../services/userService");

exports.register = async (req, res) => {
  try {
    const { phoneNumber, password, personalInfo, height, weight } = req.body;

    if (!phoneNumber || !password || !height || !weight) {
      return res.errorResponse(
        "Invalid request",
        400,
        "Se necesita un número de teléfono, una contraseña, estatura y peso"
      );
    }

    // Validar que height y weight sean numéricos
    if (isNaN(height) || isNaN(weight)) {
      return res.errorResponse(
        "Invalid height or weight",
        400,
        "La estatura y el peso deben ser valores numéricos"
      );
    }

    // Registrar el usuario con los nuevos campos
    const newUser = await userService.registerUser(
      phoneNumber,
      password,
      personalInfo,
      parseFloat(height), // Asegurar que sean números
      parseFloat(weight)  // Asegurar que sean números
    );

    res.successResponse(
      newUser,
      "User registered successfully",
      "Usuario registrado exitosamente"
    );
  } catch (e) {
    console.error("Error registering user:", e);
    if (e.message === "Phone number already registered") {
      return res.errorResponse(
        e.message,
        409,
        "Número de teléfono ya registrado"
      );
    }
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
    if (e.message === "User not found") {
      return res.errorResponse(e.message, 404, "Usuario no registrado");
    }

    res.errorResponse(e.message, 400, "Error autenticando usuario");
  }
};
