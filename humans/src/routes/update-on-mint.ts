import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@thesaas/common-payacrew";
import { Human } from "../models/human";

const router = express.Router();

router.post(
  "/api/human/mint",
  [
    body("mintedToAddress").not().isEmpty().withMessage("Title is required"),
    body("value").not().isEmpty().withMessage("Title is required"),
    body("id").not().isEmpty().withMessage("Title is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { mintedToAddress, value, id } = req.body;

    const human = await Human.findById(id);

    if (!human) {
      throw new NotFoundError();
    }

    human.set({
      value,
      mintedToAddress,
    });

    await human.save();

    res.status(200).send(human);
  }
);

export { router as mintedHumanRouter };
