const express = require("express");
const {registerUser, loginUser, findUser, getUser, updateUser,deleteUser} = require("../controllers/userController");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/find/:userId", findUser);
router.get("/", getUser);
router.post("/update/:userId",updateUser);
router.delete("/delete/:userId",deleteUser);
module.exports = router