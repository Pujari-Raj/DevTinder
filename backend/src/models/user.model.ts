import { Document, model, models, Schema } from "mongoose";

export interface User extends Document {
  name: string;
  email: string;
  password: string;
  age: number;
  gender: string;
  about: string;
  skills: string[];
  photoUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema: Schema<User> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female"],
        message: `{VALUE} is not a valid gender`,
      },
    },
    about: {
      type: String,
      default: "This is the default about section",
    },
    skills: [String],
    photoUrl: {
      type: String,
      default:
        "https://wallpapers.com/images/hd/netflix-profile-pictures-1000-x-1000-qo9h82134t9nv0j0.jpg",
    },
  },
  {
    timestamps: true,
  }
);

export const UserModel = models.User || model<User>("User", userSchema);
