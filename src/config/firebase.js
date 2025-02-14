const admin = require("firebase-admin");
const serviceAccount = require("../../secrets/firebase.json");

const firebaseConfig = process.env.FIREBASE_CONFIG
  ? JSON.parse(process.env.FIREBASE_CONFIG)
  : serviceAccount;

admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
});

const db = admin.firestore();
const auth = admin.auth();

module.exports = { db, auth };
