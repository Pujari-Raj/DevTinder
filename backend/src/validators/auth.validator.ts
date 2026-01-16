import * as yup from "yup";
import { emailSchema, passwordSchema } from "./common.schema";

export const signUpSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Name Field is Reuired")
    .min(6, "Name must be at least 6 characters")
    .max(50, "Name must not exceed 50 characters"),

  email: emailSchema,

  password: passwordSchema,

  age: yup
    .number()
    .required("Age Field is Required")
    .typeError("Please enter a valid age")
    .min(18, "Age must be at least 18"),

  gender: yup
    .string()
    .trim()
    .required("Gender Field is Required")
    .oneOf(["male", "female"]),
});

export type SignUpSchemaType = yup.InferType<typeof signUpSchema>;

// login

export const LoginSchema = yup.object({
    email: emailSchema,
    password: passwordSchema,
});

export type LoginSchemaType = yup.InferType<typeof LoginSchema>;