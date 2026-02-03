import { Document, model, models, Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import {env} from '../config/config'
export interface User extends Document {
  name: string;
  email: string;
  password: string;
  age: number;
  gender: string;
  about?: string;
  skills?: string[];
  photoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  validatePassword: (password: string) => Promise<Boolean>;
  generateJWT: () => string;
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
      index: true,
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

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Validating pasword 
userSchema.methods.validatePassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

// Function for generating JWT Token
userSchema.methods.generateJWT = function () {
  return jwt.sign(
    {
      _id: this._id
    },
      env.JWT_SECRET,
    {
      issuer: "DevTinder", expiresIn : "1d"
    }
  )
}

export const UserModel = models.User || model<User>("User", userSchema);
