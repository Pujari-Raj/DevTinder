import { Document, Schema, model, models } from "mongoose";

export interface Chat extends Document {
  participants: string[];
  lastMessage: string;
  lastMessageAt: Date | null;
}

const chatSchema: Schema<Chat> = new Schema(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    lastMessage: {
      type: String,
      default: "",
    },

    lastMessageAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export const ChatModel = models.Chat || model<Chat>("Chat", chatSchema);
