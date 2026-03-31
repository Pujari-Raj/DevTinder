import validator from "validator";
import * as yup from "yup";

export const emailSchema = yup
  .string()
  .required("Please enter email address")
  .trim()
  .test("validate-email", "Please enter valid email address", (value) =>
    value ? validator.isEmail(value) : false,
  );

export const passwordSchema = yup
  .string()
  .trim()
  .required("Password Field is Required")
  .test(
    "validate-password",
    "Password must be at least 8 characters long and includes at least one uppercase character, one lowercase character, one number and one symbol",
    (value) =>
      validator.isStrongPassword(value, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      }),
  );

export const genderSchema = yup
  .string()
  .trim()
  .required("Gender Field is Required")
  .oneOf(["male", "female"]);

export const ageSchema = yup
  .number()
  .required("Age Field is Required")
  .typeError("Please enter a valid age")
  .min(18, "Age must be at least 18");
