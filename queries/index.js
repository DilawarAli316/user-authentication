import Reset from "../models/Reset.js";

const resetVerificationToken = async (email, code) => {
  try {
    const token = await Reset.findOne({ email });

    if (token) await token.remove();

    const newToken = await Reset.create({ email, code });

    return newToken;
  } catch (err) {
    console.error({ message: err.message });
  }
};

const comparePassword = (password, confirmPassword) => {
  if (password === confirmPassword) {
    return true;
  } else {
    return false;
  }
};

export { resetVerificationToken, comparePassword };
