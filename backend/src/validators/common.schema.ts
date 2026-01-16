import * as yup from "yup";
import validator from "validator";

export const emailSchema = yup
  .string()
  .trim()
  .required("Email Field is Required")
  .test("is-email-valid", "Please provide a valid email address", (value) => {
    return validator.isEmail(value);
  });

export const passwordSchema = yup
  .string()
  .trim()
  .required("Password Field is Rqeuired")
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
