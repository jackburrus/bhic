import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
  Roles,
} from "@thesaas/common-payacrew";
import { Human } from "../models/human";

const router = express.Router();

router.put(
  "/api/human/:humanId",
  requireAuth,
  [body("title").not().isEmpty().withMessage("Title is required")],
  validateRequest,
  async (req: Request, res: Response) => {
    const human = await Human.findById(req.params.humanId);

    if (!human) {
      throw new NotFoundError();
    }

    human.set({
      title: req.body.title,
    });

    await human.save();

    res.status(200).send(human);
  }
);

export { router as updateHumanRouter };
