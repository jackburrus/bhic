import {
    NotAuthorizedError,
    NotFoundError,
    requireAuth,
  } from "@thesaas/common-payacrew";
  import express, { Request, Response } from "express";
import { Human } from "../models/human";
  
  const router = express.Router();
  
  router.get("/api/humans", async (req: Request, res: Response) => {
    try {
      const humans = await Human.find();
  
      res.status(200).send(humans);
    } catch (error) {
      res.send({ error });
    }
  });
  
  export { router as indexHumanRouter };