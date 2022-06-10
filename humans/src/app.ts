import express from "express";
import "express-async-errors";
import { json } from "body-parser";

import {
  errorHandler,
  NotFoundError,
} from "@thesaas/common-payacrew";

import { createHumanRouter } from "./routes/create";
import {  updateHumanRouter } from "./routes/update";
import {  deleteHumanRouter } from "./routes/delete";
import { indexHumanRouter } from "./routes";

const app = express();

app.set("trust proxy", true);

app.use(json());

app.use(createHumanRouter);
app.use(updateHumanRouter);
app.use(deleteHumanRouter);
app.use(indexHumanRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
