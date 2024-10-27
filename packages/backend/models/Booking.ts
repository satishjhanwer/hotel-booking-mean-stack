import mongoose, { Document, Schema } from "mongoose";

interface IBooking extends Document {
  creditCardName: string;
  creditCard: string;
  securityCode: number;
  month: number;
  year: number;
  roomType: string;
  checkInDate: Date;
  checkOutDate: Date;
  hotel: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  paymentStatus: "pending" | "paid";
  status: "pending" | "confirmed" | "cancelled";
}

const bookingSchema: Schema = new Schema<IBooking>({
  creditCardName: { type: String, required: true },
  creditCard: { type: String, required: true },
  securityCode: { type: Number, required: true },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  roomType: { type: String, required: true },
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  hotel: { type: Schema.Types.ObjectId, ref: "Hotel", required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid"],
    default: "pending",
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending",
  },
});

export const Booking = mongoose.model<IBooking>("Booking", bookingSchema);
export default Booking;
