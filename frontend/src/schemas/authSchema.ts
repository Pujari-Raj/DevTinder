import * as yup from "yup";
import { ageSchema, emailSchema, genderSchema, passwordSchema } from "./commonSchema";

export const SignupSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Name Field is Required")
    .min(6, "Name must be at least 6 characters")
    .max(50, "Name must not exceed 50 characters"),
  email: emailSchema,
  password: passwordSchema,
  age: ageSchema,
  gender: genderSchema,
});

export type SignupSchemaType = yup.InferType<typeof SignupSchema>;

export const LoginSchema = yup.object({
  email: emailSchema,
  password: passwordSchema,
});

export type LoginSchemaType = yup.InferType<typeof LoginSchema>;