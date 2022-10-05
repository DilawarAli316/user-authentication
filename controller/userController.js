import User from "../models/User.js";

// @desc Get user profile
// @route GET /api/user/profile
// @access Private

const getUserProfile = async (req, res) => {
  console.log(req.body, req.id);
  try {
    let res = await User.findById(req.id);
    console.log(res);

    res.json(docs);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

export { getUserProfile };
