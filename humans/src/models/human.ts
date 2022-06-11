import mongoose from "mongoose";

interface HumanAttrs {
  title: string; // bored human #0000
  emotion: string;
  age: string;
  gender: number;
  mintedToAddress?: string;
  value?: string;
}

/*

angry: 0.42737677693367004
disgusted: 0.0006860005087219179
fearful: 0.00022193275799509138
happy: 0.005289583932608366
neutral: 0.2347700148820877
sad: 0.3312387466430664
surprised: 0.0004170015745330602

age: 36.14389419555664
gender: "male"
genderProbability: 0.9285446405410767

*/

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
