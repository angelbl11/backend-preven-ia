const { auth, db } = require("../config/firebase");
const bcrypt = require("bcrypt");

exports.registerUser = async (phoneNumber, password, personalInfo) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRecord = await auth.createUser({
      phoneNumber,
    });
    const newUser = {
      id: userRecord.uid,
      phone_number: phoneNumber,
      password: hashedPassword,
      personal_info: personalInfo,
      created_at: new Date().toISOString(),
    };

    await db.collection("users").doc(userRecord.uid).set(newUser);

    return newUser;
  } catch (error) {
    console.error("Error registering user:", error);
    throw new Error("Error registering user");
  }
};

exports.loginUser = async (phoneNumber, password) => {
  try {
    const usersCollection = await db.collection("users");
    const querySnapshot = await usersCollection
      .where("phone_number", "==", phoneNumber)
      .get();
    if (querySnapshot.empty) {
      throw new Error("User not found");
    }
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();
    const isPasswordValid = await bcrypt.compare(password, userData.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }
    return userData;
  } catch (e) {
    console.error("Error logging in user:", e);
    throw new Error("Error logging in user", e.message);
  }
};
