import asyncHandler from "express-async-handler";
import Reset from "../models/Reset.js";
import User from "../models/User.js";
import { comparePassword, resetVerificationToken } from "../queries/index.js";
import generateCode from "../services/generateCode.js";
import generateToken from "../utils/generateToken.js";

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password, phone, address, country } = req.body;

  const userExist = await User.findOne({ email }); // if POST email match with database email

  console.log(userExist);

  if (userExist) {
    res.status(400); // error for bad request
    throw new Error("User already exists");
  } else {
    const user = await User.create({
      fullName,
      email,
      password,
      phone,
      address,
      country,
    });
    if (user) {
      res.status(201).json({
        _id: user._id,
        fullName: user.fullName,
        phone: user.phone,
        email: user.email,
        address: user.address,
        country: user.country,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  }
});

// @desc Get user profile
// @route GET /api/auth/profile
// @access Private

const getUserProfile = async (req, res) => {
  console.log(req.body, req.id);
  try {
    const user = await User.findById(req.id).lean().select("-password");

    if (user) {
      res.json(user);
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

const updateUserProfile = asyncHandler(async (req, res) => {
  const { fullName, email, phone, country, address } = req.body;

  const user = await User.findById({ _id: req.id });

  console.log(req.body);

  if (user) {
    user.fullName = fullName ? fullName : user.fullName;
    user.email = email ? email : user.email;
    user.phone = phone ? phone : user.phone;
    user.country = country ? country : user.country;
    user.address = address ? address : user.address;
  }

  await user.save();

  await res.status(201).json({
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    country: user.country,
    address: user.address,
    token: generateToken(user._id),
  });
});

// @desc Login a user
// @route POST /api/auth/login
// @access Public

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  const user = await User.findOne({ email });
  console.log(user);

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      address: user.address,
      country: user.country,
      token: generateToken(user._id),
    });
    // }
  } else {
    res.status(404).json({ message: "Invalid email and password" });
  }
});

// @desc Recover password by email
// @route POST /api/auth/
// @access Public

const recoverPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const userExisted = await User.findOne({ email });

  if (userExisted) {
    const code = generateCode();
    await resetVerificationToken(email, code);

    return res
      .status(200)
      .json({ message: "Verification email has been sent to your mail" });
  } else {
    return res.status(404).json({ message: "User not found" });
  }
});

// @desc verify code send on mail
// @route POST /api/auth/reset-password
// @access Public

const resetPassword = asyncHandler(async (req, res) => {
  const { email, code, newPassword, newPasswordConfirm } = req.body;

  if (!comparePassword(newPassword, newPasswordConfirm)) {
    res.status(400).json({ message: "Password not matched" });
  } else {
    const resetRequest = await Reset.findOne({ email, code });

    if (resetRequest) {
      const user = await User.findOne({ email });

      user.password = newPassword;

      await user.save();

      res.status(200).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        address: user.address,
        phone: user.phone,
        country: user.country,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "invalid recovery status" });
    }
  }
});

// @desc verify code send on mail
// @route POST /api/auth/verify-code
// @access Public

const verifyCode = asyncHandler(async (req, res) => {
  const { email, code } = req.body;

  const codeVerified = await Reset.findOne({ email, code });

  if (codeVerified) {
    return res.status(200).json({ message: "token successfully verified" });
  } else {
    return res.status(400).json({ message: "invalid token" });
  }
});

export {
  registerUser,
  updateUserProfile,
  loginUser,
  getUserProfile,
  recoverPassword,
  verifyCode,
  resetPassword,
};
