import { Router, Request, Response, NextFunction } from "express";
import Booking from "../models/Booking";
import adminMiddleware from "../middleware/adminMiddleware";
import authMiddleware from "../middleware/authMiddleware";
import Hotel from "../models/Hotel";
import User from "../models/User";

const router = Router();

const BASE_PATH = "/api/admin";

router.post("/hotels", authMiddleware, adminMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const hotel = new Hotel(req.body);
    await hotel.save();
    res.status(201).json(hotel);
  } catch (error) {
    next(error);
  }
});

router.delete("/hotels/:id", authMiddleware, adminMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const hotel = await Hotel.findByIdAndDelete(req.params.id);
    if (!hotel) {
      return next(new Error("Hotel not found"));
    }
    res.json({ message: "Hotel deleted" });
  } catch (error) {
    next(error);
  }
});

router.get("/users", authMiddleware, adminMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.delete("/users/:id", authMiddleware, adminMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return next(new Error("User not found"));
    }

    res.json({ message: "User deleted" });
  } catch (error) {
    next(error);
  }
});

router.get("/bookings", authMiddleware, adminMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookings = await Booking.find().populate("user hotel");
    res.json(bookings);
  } catch (error) {
    next(error);
  }
});

router.put("/bookings/:id", authMiddleware, adminMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!booking) {
      return next(new Error("Booking not found"));
    }
    res.json(booking);
  } catch (error) {
    next(error);
  }
});

router.delete("/bookings/:id", authMiddleware, adminMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await Booking.findByIdAndDelete(req.params.id);
    if (!result) {
      return next(new Error("Booking not found"));
    }

    res.json({ message: "Booking deleted" });
  } catch (error) {
    next(error);
  }
});

export default router;
