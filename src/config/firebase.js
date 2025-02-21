const admin = require("firebase-admin");
admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_CONFIG)),
});

const db = admin.firestore();
const auth = admin.auth();

module.exports = { db, auth };
