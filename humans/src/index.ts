import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  // if (!process.env.MONGO_URI) {
  //   throw new Error("MONGO_URI must be defined.");
  // }

  try {
    await mongoose.connect(
      // process.env.MONGO_URI + "/v1?retryWrites=true&w=majority"
    );
  } catch (error) {
    console.error(error);
  }

  app.listen(3001, () => {
    console.log("Listening on port 3001");
  });
};

start();
