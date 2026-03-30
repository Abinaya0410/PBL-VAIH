const express = require("express");
const router = express.Router();
const { completeProfile, getUserPoints, getUser, updateProfile } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/me", authMiddleware, getUser);
router.put("/update-profile", authMiddleware, updateProfile);
router.post("/complete-profile", completeProfile);
router.get("/points", authMiddleware, getUserPoints);

module.exports = router;
