const { db, admin } = require("../util/admin");
const { validateInput } = require("../util/helper");

exports.patchRecord = async (req, res) => {
  const newRecord = {
    name: req.body.name.toString().toLowerCase(),
    leaf: req.body.leaf,
    date: req.body.date,
    note: req.body.note,
    imgList: req.body.imgList,
    userId: req.body.userId,
    action: req.body.action,
  };
  if (validateInput(newRecord).length != 0)
    return res.status(404).json(`${validateInput(newRecord)} is missing`);
  await db.collection("records").doc(req.query.id).update(newRecord);
  return res.send({ success: "Update record success!" });
};

exports.delRecord = async (req, res) => {
    await db.collection("records").doc(req.query.id).delete();
    return res.send({ success: "Delete record success!" });
  };