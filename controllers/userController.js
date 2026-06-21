// controllers/userController.js
// Handles profile read/write and password change.
// req.userId is available here because the authMiddleware ran first
// and attached it to the request.

const bcrypt = require("bcryptjs");
const userRepository = require("../repositories/userRepository");

// GET /api/users/me
// Returns the logged-in user's own profile info
const getMyProfile = async (req, res) => {
  try {
    const user = await userRepository.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
    });
  } catch (error) {
    console.error("Get profile error:", error.message);
    res.status(500).json({ message: "Could not fetch profile" });
  }
};

// PUT /api/users/me
// Updates basic profile fields - NOT password (that has its own route below)
const updateMyProfile = async (req, res) => {
  try {
    const { username, phone, avatarUrl } = req.body;

    // Only update fields that were actually sent - build the object dynamically
    const updates = {};
    if (username) updates.username = username;
    if (phone !== undefined) updates.phone = phone;
    if (avatarUrl !== undefined) updates.avatarUrl = avatarUrl;

    const updatedUser = await userRepository.updateUser(req.userId, updates);

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        phone: updatedUser.phone,
        avatarUrl: updatedUser.avatarUrl,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error.message);
    res.status(500).json({ message: "Could not update profile" });
  }
};

// PUT /api/users/me/password
// Changes the password, but ONLY after verifying the old password first
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Both old and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    const user = await userRepository.findById(req.userId);

    // Security check: confirm they actually know the CURRENT password
    // before letting them set a new one
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Old password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    await userRepository.updateUser(req.userId, { password: hashedNewPassword });

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error.message);
    res.status(500).json({ message: "Could not change password" });
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  changePassword,
};
