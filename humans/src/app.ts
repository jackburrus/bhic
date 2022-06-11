import express from "express";
import "express-async-errors";
import { json } from "body-parser";

import { errorHandler, NotFoundError } from "@thesaas/common-payacrew";

import { newHumanRouter } from "./routes/new-human";
import { indexHumanRouter } from "./routes";
import { newImageRouter } from "./routes/new-image";
import { mintedHumanRouter } from "./routes/update-on-mint";
import { showHumanRouter } from "./routes/show";

const app = express();

app.set("trust proxy", true);

app.use(json());

app.use(newHumanRouter);
app.use(newImageRouter);
app.use(mintedHumanRouter);
app.use(indexHumanRouter);
app.use(showHumanRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
