import mongoose from "mongoose";

interface ImageAttrs {
  humanId: string;
  photo: Buffer;
}

interface ImageDoc extends mongoose.Document {
  humanId: string;
  photo: Buffer;
}

interface ImageModel extends mongoose.Model<ImageDoc> {
  build(attrs: ImageAttrs): ImageDoc;
}

const imageSchema = new mongoose.Schema(
  {
    photo: {
      type: Buffer,
    },

    humanId: {
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

imageSchema.set("versionKey", "version"); // rename '__v' to 'version'
imageSchema.plugin(updateIfCurrentPlugin);

imageSchema.statics.build = (attrs: ImageAttrs) => {
  return new Image(attrs);
};

const Image = mongoose.model<ImageDoc, ImageModel>(
  "Image",
  imageSchema
);

export { Image };