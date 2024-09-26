import mongoose from "mongoose";

const cuisinesSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    cuisine: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Cuisines = mongoose.model("Cuisines", cuisinesSchema);

export default Cuisines;
