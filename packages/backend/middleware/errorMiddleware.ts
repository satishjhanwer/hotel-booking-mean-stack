import { Request, Response, NextFunction } from "express";

// Custom error handling middleware
const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.message); // Log the error details (optional)

  // Send error response
  // check the status and based on that return error

  res.status(400).json({ message: err.message });
};

export default errorMiddleware;
