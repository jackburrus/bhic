import { NotFoundError } from "@thesaas/common-payacrew";
import express, { Request, Response } from "express";
import { Human } from "../models/human";
import { Image } from "../models/image";

const router = express.Router();

router.get("/api/human/:humanId", async (req: Request, res: Response) => {
  const { humanId } = req.params;
  const human = await Human.findById(humanId);
  const image = await Image.findOne({ humanId });

  if (!human || !image) {
    throw new NotFoundError();
  }

  res.status(200).send({ human, image });
});

export { router as showHumanRouter };
