const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.put("/", userController.updateUser);
router.get("/id/:id", userController.getUserById);
router.delete('/:id', userController.deleteUser);  //route DELETE
router.post('/topUp', userController.topUp);

module.exports = router;