import { Request, Response, NextFunction } from "express";
import { RateLimiterMemory, RateLimiterRes } from "rate-limiter-flexible";

// Rate limiter for login attempts
const loginLimiter = new RateLimiterMemory({
  points: 5, // 5 requests
  duration: 15 * 60, // per 15 minutes
});

// Rate limiter for registration attempts
const registerLimiter = new RateLimiterMemory({
  points: 10, // 10 requests
  duration: 15 * 60, // per 15 minutes
});

// Middleware for rate limiting
const rateLimiterMiddleware = (limiter: RateLimiterMemory) => {
  return (req: Request, res: Response, next: NextFunction) => {
    limiter
      .consume(req.ip as string)
      .then(() => {
        next();
      })
      .catch(() => {
        res.status(429).json({ message: "Too many requests, please try again later." });
      });
  };
};

// Export the rate limiter middleware and instances
export { rateLimiterMiddleware, loginLimiter, registerLimiter };
