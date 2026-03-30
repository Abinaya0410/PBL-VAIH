const User = require("../models/User");

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // ⭐ SECURITY FIX: Explicitly allowed fields only
    // Exclude 'role' and 'email' to prevent unauthorized/accidental changes
    const { 
      name, 
      mobileNumber,
      // Student specific
      collegeName, degree, department, year, interest,
      // Teacher specific
      institutionName, designation, experience, subjectsTeaching, qualification
    } = req.body;

    const updates = {
      name,
      mobileNumber,
      collegeName, degree, department, year, interest,
      institutionName, designation, experience, subjectsTeaching, qualification,
      profileCompleted: true
    };

    // Remove undefined fields to avoid overwriting with null
    Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    console.log(`[PROFILE UPDATE] User ${user.name} (${user.role}) updated their profile securely.`);
    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.completeProfile = async (req, res) => {
  try {
    const { email } = req.body;

    await User.findOneAndUpdate(
      { email },
      {
        ...req.body,
        profileCompleted: true,
      }
    );

    res.json({ message: "Profile saved successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUserPoints = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const points = user.points || 0;
    let level = "Beginner";
    let nextLevel = "Learner";
    let nextLevelPoints = 200;

    if (points >= 2000) {
      level = "Expert";
      nextLevel = "Max Level";
      nextLevelPoints = points;
    } else if (points >= 1000) {
      level = "Advanced";
      nextLevel = "Expert";
      nextLevelPoints = 2000;
    } else if (points >= 500) {
      level = "Intermediate";
      nextLevel = "Advanced";
      nextLevelPoints = 1000;
    } else if (points >= 200) {
      level = "Learner";
      nextLevel = "Intermediate";
      nextLevelPoints = 500;
    }

    res.json({ points, level, nextLevel, nextLevelPoints });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
