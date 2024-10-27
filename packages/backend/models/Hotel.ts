import mongoose, { Document, Schema } from "mongoose";
import Booking from "./Booking";

interface IRoomType {
  type: string;
  price: number;
}

interface IReview {
  user: mongoose.Types.ObjectId;
  rating: number;
  comment?: string;
  date: Date;
}

interface IHotel extends Document {
  name: string;
  address: string;
  zip: string;
  city: string;
  state: string;
  rate: number;
  roomCount: number;
  roomTypes: IRoomType[];
  reviews: IReview[];
  addReview(userId: mongoose.Types.ObjectId, rating: number, comment?: string): Promise<void>;
  checkAvailability(checkInDate: Date, checkOutDate: Date): Promise<boolean>;
  bookHotel(): Promise<IHotel>;
  cancelHotel(): Promise<IHotel>;
}

const hotelSchema: Schema<IHotel> = new Schema<IHotel>({
  name: { type: String, required: true },
  address: { type: String, required: true },
  zip: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  rate: { type: Number, required: true },
  roomCount: { type: Number, required: true },
  roomTypes: [
    {
      type: { type: String, required: true },
      price: { type: Number, required: true },
    },
  ],
  reviews: [
    {
      user: { type: Schema.Types.ObjectId, ref: "User", required: true },
      rating: { type: Number, min: 1, max: 5, required: true },
      comment: { type: String, required: false },
      date: { type: Date, default: Date.now },
    },
  ],
});

hotelSchema.methods.addReview = async function (userId: mongoose.Types.ObjectId, rating: number, comment?: string): Promise<void> {
  this.reviews.push({ user: userId, rating, comment, date: new Date() });
  await this.save();
};

hotelSchema.methods.checkAvailability = async function (checkInDate: Date, checkOutDate: Date): Promise<boolean> {
  const bookings = await Booking.find({
    hotel: this._id,
    checkInDate: { $lt: checkOutDate },
    checkOutDate: { $gt: checkInDate },
  });
  return this.roomCount - bookings.length > 0;
};

hotelSchema.methods.bookHotel = async function (): Promise<IHotel> {
  if (this.roomCount > 0) {
    this.roomCount -= 1;
    return this.save();
  } else {
    throw new Error("No rooms available");
  }
};

hotelSchema.methods.cancelHotel = async function (): Promise<IHotel> {
  this.roomCount += 1;
  return this.save();
};

const Hotel = mongoose.model<IHotel>("Hotel", hotelSchema);
export default Hotel;
