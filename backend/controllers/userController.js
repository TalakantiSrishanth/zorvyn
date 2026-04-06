import User from '../models/User.js';

export const createUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    if (!name || !email) {
      return res.status(400).json({error:'Name and email are required'});
    }

    const user = new User({ name, email, role });
    await user.save();

    res.status(201).json(user);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({error:'Email already exists'});
    }
    console.error('Error creating user:', err);
    res.status(500).json({error:'Failed to create user'});
  }
};

export const listUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({error:'Failed to fetch users'});
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, status } = req.body;

    const patch = {};
    if (role) patch.role = role;
    if (status) patch.status = status;

    const updated = await User.findByIdAndUpdate(id, patch, { new: true });

    if (!updated) {
      return res.status(404).json({error:'User not found'});
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({error:'Failed to update user'});
  }
};

export async function deleteUser(req, res) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({error:'User not found'});
    }

    res.json({message:'User deleted successfully'});
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({error:'Invalid user ID format'});
    }
    res.status(500).json({error:'Failed to delete user'});
  }
}
