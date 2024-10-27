import { Router, Request, Response, NextFunction } from "express";
import User from "../models/User";
import authMiddleware from "../middleware/authMiddleware";
import Booking from "../models/Booking";

const router = Router();

router.get("/profile", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById((req as any).user.id);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// Update profile
router.put("/profile", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName } = req.body;
    const user = await User.findById((req as any).user.id);
    if (!user) return next("User not found");
    await user.updateProfile(firstName, lastName);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// Change password
router.put("/password", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById((req as any).user.id);
    if (!user) return next("User not found");

    const isValid = user.validatePassword(currentPassword);
    if (!isValid) return next("Current password is incorrect");

    user.password = user.generateHash(newPassword);
    await user.save();
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
});

// Forgot password
router.post("/forgot-password", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next("User not found");

    const token = user.generatePasswordResetToken();
    await user.save();

    res.json({ message: "Password reset link sent to email", link: `http://localhost:3000/reset-password/${token}` });
  } catch (error) {
    next(error);
  }
});

// Reset password
router.post("/reset-password/:token", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } });
    if (!user) return next("Token is invalid or has expired");

    user.password = user.generateHash(req.body.password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.json({ message: "Password has been successfully reset" });
  } catch (error) {
    next(error);
  }
});

router.get("/bookings", authMiddleware, async (req: Request<any>, res: Response) => {
  const bookings = await Booking.find({ userId: (req as any).user.id });
  res.json({ bookings });
});

router.delete("/bookings/:id", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Booking cancelled successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
