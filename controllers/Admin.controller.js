import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';





// Get all admins
export const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "All fields are required"
      });
    }
    // Check if email already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({
        status: "fail",
        message: "Email already in use"
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newAdmin = new Admin({ name, email, password: hashedPassword });
    await newAdmin.save();

    return res.status(201).json({
      status: "success",
      message: "Admin created successfully",
      admin: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email
      }
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    return res.status(500).json({
      status: "error",
      message: "Error creating admin"
    });




  }
};



export const getAllUsers = async (req, res) => {
  try {
    const users = await Admin.find();
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


// Update user
export const updateUser = async (req, res) => {
  try {
    const { name, email, status } = req.body;

    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (status !== undefined) updates.status = status;

    const user = await Admin.findByIdAndUpdate(
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
    const user = await Admin.findByIdAndDelete(req.params.id);

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



export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find the admin user by email
    const user = await Admin.findOne({ email });
    if (!user) {
      return res.status(401).json({ status: "error", message: "Invalid email or password" });
    }

    // 2. Verify password (assuming you hash passwords with bcrypt)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ status: "error", message: "Invalid email or password" });
    }

    // 3. Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // 4. Send response
    return res.status(200).json({
      status: "success",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Error logging in admin:', error);
    return res.status(500).json({
      status: "error",
      message: "Error logging in admin"
    });
  }
};

export const logoutAdmin = (req, res) => {
  try {
    // 1. Clear the HTTP-only cookie if using cookies
    res.clearCookie('token');

    // 2. If using express-session, destroy it
    if (req.session) {
      req.session.destroy();
    }

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: "Logout failed" });
  }
};

