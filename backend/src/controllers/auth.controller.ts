import { Response } from "express";
import { ApiResponse } from "../@types/type";
import { AsyncHandler } from "../utils/handlers";
import { UserModel } from "../models/user.model";
import {
  LoginSchema,
  LoginSchemaType,
  SignUpSchemaType,
  signUpSchema,
} from "../validators/auth.validator";

// signup route
const signUp = AsyncHandler(async (req, res: Response<ApiResponse>) => {
  const { name, email, password, age, gender } = await signUpSchema.validate(
    req.body as SignUpSchemaType,
    {
      abortEarly: false,
      stripUnknown: true,
    },
  );

  // 1. checking if user exists
  const existingUser = await UserModel.findOne({ email });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "User Already Exists",
    });
  }

  // 2. creating new user
  const createNewUser = await UserModel.create({
    name,
    email,
    password,
    age,
    gender,
  });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      name: createNewUser?.name,
      email: createNewUser?.email,
    },
  });
});

// login route
const login = AsyncHandler(async (req, res: Response<ApiResponse>) => {
  const { email, password } = await LoginSchema.validate(
    req.body as LoginSchemaType,
    {
      abortEarly: false,
      stripUnknown: true,
    },
  );

  //1. checking if userExists
  const userExists = await UserModel.findOne({ email }).select("+password");

  if (!userExists) {
    return res.status(401).json({
      success: false,
      message: "User Does not exist",
    });
  }

  // 2. Validating password

  const isValidPassword = await userExists.validatePassword(password);


  if (!isValidPassword) {
    return res.status(401).json({
      success: false,
      message: "Invalid Email or Password",
    });
  }

  // if userExists and password is valid, then generating token

  const token = userExists.generateJWT();

  // 3. setting token as cookie with success code

  res.cookie("devTinderToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none": "lax",
    maxAge: 1 * 24 * 60 * 60 * 1000
  })
  
  .status(200).json({
    success: true,
    message: "Login Successful",
    data: {
      name: userExists.name,
      email: userExists.email,
    },
  });
});

export { signUp, login };