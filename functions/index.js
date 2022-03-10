const functions = require("firebase-functions");
const cors = require("cors");
const { login, signup } = require("./handler/user");
const { addTree, getTree, getTreeDetail } = require("./handler/tree");
const { patchRecord, delRecord } = require("./handler/record");
const app = require("express")().use(cors());


exports.api = functions.region("asia-southeast1").https.onRequest(app);

app.post("/login", login);
app.post("/signup", signup);

app.get("/tree", getTree)
app.get("/tree/detail", getTreeDetail)
app.post("/tree", addTree)

app.patch("/record", patchRecord)
app.delete("/record", delRecord)