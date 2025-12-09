const User = require('../models/user.model');
const bcrypt = require('bcryptjs');


exports.uploadProfilePic = (req, res) => {
  if(!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  // Save image path to user profile in DB
  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

  User.findByIdAndUpdate(req.user.id, { profilePic: imageUrl }, { new: true })
  .then(user => {
    res.json({
      message: 'Profile picture updated successfully ✅',
      profilePic: user.profilePic  // ✅ return explicitly
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

// exports.getUserById = async (req, res) => {
//   try {
//     const userId = req.params.id;
    
//     const user = await User.findById(userId).select('-password'); // don’t send password

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// exports.updateProfile = async (req, res) => {
//   const userId = req.user.id; // 🔧 use `id`, not `_id`
//   const { fullName, email, password, bio, phone } = req.body;

//   if (!userId) {
//     return res.status(400).json({ message: 'Invalid user ID in token' });
//   }

//   try {
//     const updateData = {
//       ...(fullName && { fullName }),
//       ...(email && { email }),
//       ...(phone && { phone }),
//       ...(phone && { phone }),
//     };

//     // Optional: If you want to allow password change, handle it here
//     if (password && password.trim() !== "") {
//       const hashedPassword = await bcrypt.hash(password, 10);
//       updateData.password = hashedPassword;
//     }

//     if (req.file) {
//       req.body.profilePic = `/uploads/${req.file.filename}`;
//     }

//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       { $set: updateData },
//       { new: true, runValidators: true }
//     );

//     res.status(200).json({ user: updatedUser });
//   } catch (error) {
//     console.error(error); // Log actual error
//     res.status(500).json({ message: 'Failed to update profile', error: error.message });
//   }
// };

exports.updateProfile = async (req, res) => {
  const userId = req.user.id;

  const { fullName, email, password, bio, phone } = req.body;

  if(!userId) {
    return res.status(400).json({ message: "Invalid user ID in token" });
  }

  try {
    const updateData = {};

    if(fullName) updateData.fullName = fullName.trim();
    if(email) updateData.email = email.trim();
    if(bio) updateData.bio = bio.trim();
    if(phone) updateData.phone = phone.trim();

    if(password && password.trim() !== "") {
      updateData.password = await bcrypt.hash(password, 10);
    }
    if(req.file) {
      updateData.profilePic = `/uploads/${req.file.filename}`;
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