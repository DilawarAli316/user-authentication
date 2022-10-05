import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
// import clients from '../utils/redis.js'

const protect = async (req, res, next) => {
  try {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
      const error = new Error("Not Authenticated");
      error.statucCode = 401;
      throw error;
    }

    const token = req.get("Authorization").split(" ")[1];
    console.log(token);
    let decodedToken = "";
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      err.statusCode = 500;
      throw err;
    }

    if (!decodedToken) {
      const error = new Error("Not Authenticated");
      error.statusCode = 401;
      throw error;
    }

    req.id = decodedToken.id;
    next();
  } catch (err) {
    return res.status(405).json({
      message: err.message,
    });
  }
};

export { protect };
