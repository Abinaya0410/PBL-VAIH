const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const auth = require("../middleware/authMiddleware");

// ======================================================
// 🟢 GET ALL NOTIFICATIONS (USER)
// ======================================================
router.get("/", auth, notificationController.getNotifications);

// ======================================================
// 🟢 MARK NOTIFICATION AS READ (USER)
// ======================================================
router.patch("/:notificationId/read", auth, notificationController.markAsRead);

// ======================================================
// 🟢 MARK ALL AS READ (USER)
// ======================================================
router.patch("/read-all", auth, notificationController.markAllAsRead);

module.exports = router;
