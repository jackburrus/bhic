import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  NotAuthorizedError,
  requireAuth,
  validateRequest,
} from "@thesaas/common-payacrew";
import { Human } from "../models/human";

const router = express.Router();

router.post(
  "/api/human",
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("emotion").not().isEmpty().withMessage("Title is required"),
    body("age").not().isEmpty().withMessage("Title is required"),
    body("gender").not().isEmpty().withMessage("Title is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, emotion, age, gender, mintedToAddress, value } = req.body;

    const human = Human.build({
      title,
      emotion,
      age,
      gender,
      mintedToAddress: mintedToAddress || null,
      value: value || null,
    });

    await human.save();

    res.status(201).send(human);
  }
);

export { router as newHumanRouter };
