import express, { Request, Response } from "express";
import {
  requireAuth,
  NotFoundError
} from "@thesaas/common-payacrew";
import { Human } from "../models/human";

const router = express.Router();

router.delete(
  "/api/human/:humanId",
  requireAuth,
  async (req: Request, res: Response) => {
/* don't delete.. but update onSuccess of mint with an "owner address field" in database... we can clean up later if db fills

    */
    const human = await Human.findById(req.params.humanId);

    if (!human) {
      throw new NotFoundError();
    }

    await human.deleteOne();


    res.status(204).send(human);
  }
);

export { router as deleteHumanRouter };
