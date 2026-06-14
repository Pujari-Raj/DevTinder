import { Response } from "express";
import { AsyncHandler } from "../utils/handlers";
import { ApiResponse } from "../@types/type";
import {
  EditProfileSchema,
  EditProfileSchemaType,
} from "../validators/profile.schema";

// get Profile details
const viewProfile = AsyncHandler(async (req, res: Response<ApiResponse>) => {
  // Getting loggedIn user's data
  const loggedInUser = req?.user;

  // excluding sensitive data
  loggedInUser.password = undefined!;

  // Return the response
  res.status(200).json({
    success: true,
    message: "Profile Details fetched successfully",
    data: loggedInUser,
  });
});

// edit profile details

const editProfile = AsyncHandler(async (req, res: Response<ApiResponse>) => {
  // validating the request body
  const validatedData =
    await EditProfileSchema.validate(req?.body, {
      abortEarly: false,
      stripUnknown: true,
    });

  // Getting loggedIn user's data
  const loggedInUser = req?.user;

  // Updating the fields
  Object.assign(loggedInUser, validatedData)

  // saving the updated data against user
  await loggedInUser.save();

  // excluding sensitive data
  loggedInUser.password = undefined!;

  // Returning response
  res.status(200).json({
    success: true,
    message: "Edited Profile Details Successfully",
    data: loggedInUser
  })
});

export { viewProfile, editProfile };
