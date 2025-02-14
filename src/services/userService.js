const { auth, db } = require("../config/firebase");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

/**
 * Registra un usuario en la base de datos con los campos adicionales de estatura y peso.
 * @param {string} phoneNumber - Número de teléfono del usuario.
 * @param {string} password - Contraseña del usuario.
 * @param {object} personalInfo - Información personal del usuario (nombre, edad, etc.).
 * @param {number} height - Estatura del usuario en metros.
 * @param {number} weight - Peso del usuario en kilogramos.
 */
exports.registerUser = async (phoneNumber, password, personalInfo, height, weight) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario en Firebase Auth
    const userRecord = await auth.createUser({
      phoneNumber,
    });

    const userId = uuidv4(); // Generar un identificador único
    const newUser = {
      id: userRecord.uid,
      userId: userId,
      phone_number: phoneNumber,
      password: hashedPassword,
      personal_info: personalInfo,
      height: height, // Agregar estatura
      weight: weight, // Agregar peso
      imc: weight / (height * height), // Calcular el IMC
      created_at: new Date().toISOString(),
    };

    // Guardar los datos del usuario en Firestore
    await db.collection("users").doc(userRecord.uid).set(newUser);

    return newUser;
  } catch (error) {
    console.error("Error registering user:", error);
    if (error.code === "auth/phone-number-already-exists") {
      throw new Error("Phone number already registered");
    }
    throw new Error("Error registering user");
  }
};

/**
 * Inicia sesión de un usuario validando las credenciales.
 * @param {string} phoneNumber - Número de teléfono del usuario.
 * @param {string} password - Contraseña del usuario.
 * @returns {object} - Datos del usuario autenticado.
 */
exports.loginUser = async (phoneNumber, password) => {
  try {
    const usersCollection = db.collection("users");
    const querySnapshot = await usersCollection.where("phone_number", "==", phoneNumber).get();

    if (querySnapshot.empty) {
      throw new Error("User not found");
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    // Validar la contraseña
    const isPasswordValid = await bcrypt.compare(password, userData.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    return userData;
  } catch (e) {
    console.error("Error logging in user:", e);
    if (e.message === "User not found") {
      throw new Error("User not found");
    }
    throw new Error("Error logging in user", e.message);
  }
};
