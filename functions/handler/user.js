const { db, admin } = require("../util/admin");
const { validateInput } = require("../util/helper");
const { initializeApp } = require("firebase/app");
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");
const config = require("../util/config.js");
const app = initializeApp(config);

exports.signup = async (req, res) => {
  const body = {
    username: req.body.username,
    password: req.body.password,
  };
  if (validateInput(body).length != 0)
    return res.status(404).json(`${validateInput(body)} is missing`);
  const { username, password } = body;
  try {
    const email = `${username}@RoozTech.com`;
    const user = await admin.auth().createUser({ email, password });
    db.collection("users").doc(user.uid).set({ email: user.email, username });
    return res.send({ uid: user.uid, username });
  } catch (err) {
    return res.status(404).json(err);
  }
};

exports.login = async (req, res) => {
  const body = {
    username: req.body.username,
    password: req.body.password,
  };
  if (validateInput(body).length != 0)
    return res.status(404).json(`${validateInput(body)} is missing`);
  const { username, password } = body;
  try {
    const auth = getAuth(app);
    const email = `${username}@RoozTech.com`;
    const user = await signInWithEmailAndPassword(auth, email, password);
    return res.send({ uid: user.user.uid, username });
  } catch (err) {
    return res.status(404).json(err.code);
  }
};
