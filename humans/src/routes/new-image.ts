import express, { Request, Response } from "express";
import {
  BadRequestError,
  currentUser,
  NotAuthorizedError,
  NotFoundError,
  OrderCrmStatus,
  requireAuth,
  validateRequest,
} from "@thesaas/common-payacrew";
import { Image } from "../models/image";
import multer from "multer";

// implements nodejs wrappers for HTMLCanvasElement, HTMLImageElement, ImageData
import * as canvas from "canvas";
import * as faceapi from "face-api.js";

const upload = multer({
  limits: {
    fileSize: 4000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload an image"));
    }

    cb(null, true);
  },
});

const router = express.Router();

router.post(
  "/api/image",
  upload.single("image"),
  async (req: Request, res: Response) => {
    if (!req.file) {
      throw new BadRequestError("image not found");
    }
    const imageUpload = req.file.buffer;

    const regionsToExtract = [new faceapi.Rect(0, 0, 100, 100)];
    // actually extractFaces is meant to extract face regions from bounding boxes
    // but you can also use it to extract any other region
    // const canvases = await faceapi.extractFaces(imageUpload, regionsToExtract)

    const { humanId } = req.body;

    const img = Image.build({
      photo: imageUpload,
      humanId: humanId || null,
    });

    await img.save();

    res.status(201).send(img);
  }
);

export { router as newImageRouter };
