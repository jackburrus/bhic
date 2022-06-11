import mongoose from "mongoose";

interface HumanAttrs {
  title: string; // bored human #0000
  emotion: string;
  age: string;
  gender: number;
  mintedToAddress?: string;
  value?: string;
}

interface HumanDoc extends mongoose.Document {
  title: string;
  emotion: string;
  age: string;
  gender: number;
  mintedToAddress: string;
  value: string;
}

interface HumanModel extends mongoose.Model<HumanDoc> {
  build(attrs: HumanAttrs): HumanDoc;
}

const humanSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    emotion: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    mintedToAddress: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

humanSchema.statics.build = (attrs: HumanAttrs) => {
  return new Human(attrs);
};

const Human = mongoose.model<HumanDoc, HumanModel>("Human", humanSchema);

export { Human };
