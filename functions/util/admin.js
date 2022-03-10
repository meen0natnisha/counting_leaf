const admin = require("firebase-admin");
const firebase = require("firebase/auth");
const config = require("../util/config.js");

admin.initializeApp(config);
const db = admin.firestore();

module.exports = { admin, db, firebase };
