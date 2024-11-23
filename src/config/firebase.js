const admin = require("firebase-admin");
const path = require("path");

const serviceAccount = require("../../firebase.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const auth = admin.auth();

module.exports = { db, auth };
