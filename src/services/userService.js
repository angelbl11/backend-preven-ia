const { admin, db } = require("../config/firebase");

/// Prod otp verification
exports.verifyPhoneNumber = async (idToken) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    return {
      userId: decodedToken.uid,
      phoneNumber: decodedToken.phone_number,
    };
  } catch (error) {
    console.error("Error verifying phone number:", error);
  }
};

exports.registerUser = async (userId, phoneNumber, additionalData) => {
  try {
    const userDoc = await db.collection("users").doc(userId).get();

    if (userDoc.exists) {
      console.error("User already exists");
    }

    const newUser = {
      id: userId,
      phone_number: phoneNumber,
      additional_data: additionalData,
      created_at: new Date().toISOString(),
    };

    await db.collection("users").doc(userId).set(newUser);

    return newUser;
  } catch (error) {
    console.error("Error registering user:", error);
  }
};

exports.loginUser = async (userId) => {
  try {
    const userDoc = await db.collection("users").doc(userId).get();
    if (!userDoc.exists) {
      console.error("User does not exist");
      throw new Error("User does not exist");
    }
    return userDoc.data();
  } catch (e) {
    console.error("Error logging in user:", e);
    throw new Error("Error logging in user", e.message);
  }
};
