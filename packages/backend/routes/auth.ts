import { Router, Request, Response, NextFunction } from "express";
import Joi from "joi";
import User from "../models/User";
import authMiddleware from "../middleware/authMiddleware";
import { rateLimiterMiddleware, loginLimiter, registerLimiter } from "../middleware/rateLimiter";

const router = Router();

const registerSchema = Joi.object({
  lastName: Joi.string().required(),
  firstName: Joi.string().required(),
  isAdmin: Joi.boolean().default(false),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().email().required(),
});

router.post("/register", rateLimiterMiddleware(registerLimiter), async (req: Request, res: Response, next: NextFunction) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    return next(error);
  }
  try {
    const { email, password, firstName, lastName, isAdmin = false } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next("Email already exists");
    }
    const user = new User({ email, firstName, lastName, isAdmin });
    user.password = user.generateHash(password);
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    next(error);
  }
});

router.post("/login", rateLimiterMiddleware(loginLimiter), async (req: Request, res: Response, next: NextFunction) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return next(error);
  }
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.validatePassword(password)) {
      return next("Invalid email or password");
    }
    res.json({
      token: user.generateJWT(),
      message: "Login successful",
      user: { id: user._id, email: user.email, firstName: user.firstName, isAdmin: user.isAdmin },
    });
  } catch (error) {
    next(error);
  }
});

router.post("/logout", authMiddleware, (req: Request, res: Response) => {
  res.json({ message: "Logout successful. Please discard your JWT token." });
});

export default router;
