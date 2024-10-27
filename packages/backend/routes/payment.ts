import { Router, Request, Response, NextFunction } from "express";
import Booking from "../models/Booking";

const router = Router();

router.post("/simulate", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookingId, paymentDetails } = req.body;

    // Simulate payment processing logic
    const isPaymentSuccessful = Math.random() > 0.2; // 80% success rate for simulation

    if (!isPaymentSuccessful) {
      return res.status(400).json({ message: "Payment failed. Please try again." });
    }

    // If payment is successful, update booking status to 'confirmed'
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    booking.status = "confirmed"; // Update booking status
    await booking.save();

    return res.status(200).json({ message: "Payment successful and booking confirmed!" });
  } catch (error) {
    next(error);
  }
});

router.post("/:bookingId/payment", (req: Request, res: Response, next: NextFunction) => {
  const bookingId = req.params.bookingId;
  const { paymentMethod, amount } = req.body;

  // Simulate payment success or failure
  const paymentSuccess = true; // For simulation purposes

  if (paymentSuccess) {
    // Update the booking status to 'confirmed'
    Booking.findByIdAndUpdate(bookingId, { status: "confirmed" }, (err: any, booking: any) => {
      if (err) return next(err);
      res.status(200).json({ message: "Payment successful and booking confirmed", booking });
    });
  } else {
    next("Payment failed");
  }
});
export default router;
