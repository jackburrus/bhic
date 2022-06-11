import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from "@thesaas/common-payacrew";
import express, { Request, Response } from "express";
import { Human } from "../models/human";

const router = express.Router();

router.get("/api/humans", async (req: Request, res: Response) => {
  const humans = await Human.find();

  if (!humans) {
    throw new NotFoundError();
  }

  res.status(200).send(humans);
});

export { router as indexHumanRouter };
