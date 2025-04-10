import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    responded: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);
