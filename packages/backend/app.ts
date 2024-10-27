import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/auth";
import adminRoutes from "./routes/admin";
import hotelRoutes from "./routes/hotels";
import paymentRoutes from "./routes/payment";
import bookingRoutes from "./routes/bookings";
import errorMiddleware from "./middleware/errorMiddleware";

import { config } from "dotenv";

config();

const app = express();

app.use(
  cors({
    optionsSuccessStatus: 204,
    origin: "http://localhost:4200",
    allowedHeaders: "Content-Type,Authorization",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  })
);

// Middleware for parsing JSON data
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.DB_URI as string)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Error connecting to MongoDB:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/bookings", bookingRoutes);

// Error handling middleware (register at the end of all routes)
app.use(errorMiddleware);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
