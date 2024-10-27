import { Router, Request, Response, NextFunction } from "express";
import Hotel from "../models/Hotel";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

router.get("/", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const hotels = await Hotel.find();
    res.json(hotels);
  } catch (error) {
    next(error);
  }
});

router.get("/search", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10, query } = req.body;
    const parsedPage = parseInt(page as string);
    const parsedLimit = parseInt(limit as string);

    if (!query || typeof query !== "string") {
      return next(new Error("Invalid query parameter"));
    }

    const hotels = await Hotel.find({ name: new RegExp(query as string, "i") })
      .limit(parsedLimit)
      .skip((parsedPage - 1) * parsedLimit);

    res.json(hotels);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return next(new Error("Hotel not found"));
    }
    res.json(hotel);
  } catch (error) {
    next(error);
  }
});

export default router;
