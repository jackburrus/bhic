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
  [body("title").not().isEmpty().withMessage("Title is required")],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title } = req.body;

    console.log('title', title)

    const human = Human.build({
      title,
    });

    await human.save();

    res.status(201).send(human);
  }
);

export { router as createHumanRouter };
