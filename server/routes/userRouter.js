const express = require('express');
const router = express.Router();

const userModel = require('../models/userModel');
const { isloggedIn } = require('../middlewares/isloggedIn');
const { isAdmin } = require('../middlewares/isAdmin');

// Get all users (Admin Only)
router.get('/allUsers', isloggedIn, isAdmin, async (req, res) => {
  try {
    // fetch all users except password field
    const users = await userModel.find().select('-password').sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      totalUsers: users.length,
      users
    });

  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
});

// ------------------- CHANGE USER ROLE -------------------
router.put('/role/:id', isloggedIn, isAdmin, async (req, res) => {
  try {
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ success: false, message: "Role is required" });
    }

    const user = await userModel.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "Role Updated", user });

  } catch (error) {
    console.error("Role update error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});



// ------------------- BLOCK / UNBLOCK USER -------------------
router.put('/block/:id', isloggedIn, isAdmin, async (req, res) => {
  try {
    const { isBlocked } = req.body;

    const user = await userModel.findByIdAndUpdate(
      req.params.id,
      { isBlocked },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      message: isBlocked ? "User Blocked" : "User Unblocked",
      user
    });

  } catch (error) {
    console.error("Block user error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});



// ------------------- DELETE USER -------------------
router.delete('/:id', isloggedIn, isAdmin, async (req, res) => {
  try {
    const deletedUser = await userModel.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "User deleted successfully" });

  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});




module.exports = router;
