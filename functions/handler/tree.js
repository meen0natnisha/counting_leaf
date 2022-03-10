const { async } = require("@firebase/util");
const { db, admin } = require("../util/admin");
const { validateInput } = require("../util/helper");

exports.getTree = async (req, res) => {
  const dataList = [];
  const data = (
    await db
      .collection("trees")
      .where("userId", "==", req.query.userId)
      .orderBy("date", "desc")
      .get()
  ).docs.map((doc) => {
    dataList.push({ ...doc.data(), id: doc.id });
  });
  return res.send(dataList);
};

exports.getTreeDetail = async (req, res) => {
  const dataList = [];
  const data = (
    await db
      .collection("records")
      .where("userId", "==", req.query.userId)
      .where("name", "==", req.query.treeName)
      .orderBy("date", "desc")
      .get()
  ).docs.map((doc) => {
    dataList.push({ ...doc.data(), id: doc.id });
  });
  return res.send(dataList);
};

exports.addTree = async (req, res) => {
  const newTree = {
    name: req.body.name.toString().toLowerCase(),
    leaf: req.body.leaf,
    date: req.body.date,
    note: req.body.note,
    imgList: req.body.imgList,
    userId: req.body.userId,
    action: req.body.action,
  };
  if (validateInput(newTree).length != 0)
    return res.status(404).json(`${validateInput(newTree)} is missing`);
  db.collection("trees")
    .where("name", "==", newTree.name)
    .where("userId", "==", newTree.userId)
    .get()
    .then(async (doc) => {
      if (doc.empty) {
        await db
          .collection("trees")
          .add({
            name: newTree.name,
            userId: newTree.userId,
            date: new Date(),
          });
        await db.collection("records").add(newTree);
        return res.send({ success: "Create new tree success!" });
      } else {
        if (newTree.action === "addTree")
          return res.send({ failed: "Tree already exist!" });
        await db
          .collection("trees")
          .doc(doc.docs[0].id)
          .update({ date: new Date(), });
        await db
          .collection("records")
          .add(newTree)
          .then(() => {
            return res.send({ success: "Add new record success!" });
          })
          .catch((err) => {
            res.status(500).json({ failed: "something went wrong" });
            console.error(err);
          });
      }
    });
};
