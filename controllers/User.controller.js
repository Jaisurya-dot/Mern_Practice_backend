import User from "../models/User.js";
import bcrypt from "bcryptjs";

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json({
      status: "success",
      message: "Users fetched successfully",
      count: users.length,
      users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({
      status: "error",
      message: "Error fetching users"
    });
  }
};

// Create a new user
export const createUser = async (req, res) => {
  try {
    const { name, email, password, passwordConfirm } = req.body;

    // Simple validation
    if (!name || !email || !password || !passwordConfirm) {
      return res.status(400).json({
        status: "fail",
        message: "All fields are required"
      });
    }

    if (password !== passwordConfirm) {
      return res.status(400).json({
        status: "fail",
        message: "Passwords do not match"
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        status: "fail",
        message: "Email already in use"
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);


    // Create new user with hashed password 
    // Create new user
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    return res.status(201).json({
      status: "success",
      message: "User created successfully",
      user: newUser
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({
      status: "error",
      message: "Error creating user"
    });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found"
      });
    }

    return res.status(200).json({
      status: "success",
      user
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({
      status: "error",
      message: "Error fetching user"
    });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { name, email, status } = req.body;

    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (status !== undefined) updates.status = status;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found"
      });
    }

    return res.status(200).json({
      status: "success",
      message: "User updated successfully",
      user
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({
      status: "error",
      message: "Error updating user"
    });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found"
      });
    }

    return res.status(200).json({
      status: "success",
      message: "User deleted successfully"
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({
      status: "error",
      message: "Error deleting user"
    });
  }
};