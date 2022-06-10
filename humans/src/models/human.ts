import mongoose from "mongoose";

interface HumanAttrs {
  title: string;
  mintedToAddress?: string;
  // image, other metadata to do
}

interface HumanDoc extends mongoose.Document {
  title: string;
  mintedToAddress: string;
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
