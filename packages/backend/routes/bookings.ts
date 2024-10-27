import { Router, Request, Response, NextFunction } from "express";
import Booking from "../models/Booking";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

// GET: List all bookings by the user
router.get("/", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate("hotel");
    res.json(bookings);
  } catch (error) {
    next(error);
  }
});

// POST: Create a new booking
router.post("/", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const booking = new Booking({ ...req.body, user: req.user.id });
    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
});

// DELETE: Cancel a booking
router.delete("/:id", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return next("Booking not found");
    res.json({ message: "Booking canceled" });
  } catch (error) {
    next(error);
  }
});

// Pay for a booking (this would be integrated with a payment gateway like Stripe)
router.post("/:id/pay", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return next("Booking not found");

    // Payment logic will go here (e.g., Stripe or PayPal)

    booking.paymentStatus = "paid";
    await booking.save();
    res.json({ message: "Payment successful" });
  } catch (error) {
    next(error);
  }
});

// Update the status of a booking
router.put("/:id/status", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!booking) return next("Booking not found");

    res.json(booking);
  } catch (error) {
    next(error);
  }
});

export default router;
