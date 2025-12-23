const User = require('../models/user.model');
const bcrypt = require('bcryptjs');


exports.uploadProfilePic = (req, res) => {
  if(!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const profilePicPath = `/uploads/profilePics/${req.file.filename}`;

  User.findByIdAndUpdate(req.user.id, { profilePic: profilePicPath }, { new: true })
  .then(user => {
    res.json({
      message: 'Profile picture updated successfully ✅',
      profilePic: user.profilePic
    });
  })
  .catch(err => res.status(500).json({ message: 'Error uploading profile picture', error: err.message }));
}

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('school');
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user data', error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  const userId = req.user.id;

  if(!userId) {
    return res.status(400).json({ message: "Invalid user ID in token" });
  }

  try {
    let updateData = {...req.body};

    if(updateData.password && updateData.password.trim() !== "") {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    } else {
      delete updateData.password;
    }

    if(req.file) {
      updateData.profilePic = `/uploads/profilePics/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      {  new: true, runValidators: true }
    );

    if(!updatedUser) {
      return res.status(404).json({message: "User not found"})
    }
    
    res.status(200).json({
      user: updatedUser
    });
  } catch (error) {
    console.error("Update Profile error:", error.message);
    res.status(500).json({
      message: "Failed to update profile",
    });
  }
}