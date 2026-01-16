import * as yup from "yup";

export const signUpSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Name Field is Reuired")
    .min(6, "Name must be at least 6 characters")
    .max(50, "Name must not exceed 50 characters"),

  email: yup
    .string()
    .trim()
    .required("Name Field is Reuired")
    .test("is-email-valid", "Email is not valid", (value) => {
      if (!value) return false;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    }),

  password: yup
    .string()
    .trim()
    .required("Password Field is Required")
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password must not exceed 20 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    ),

  age: yup
    .number()
    .required("Age Field is Required")
    .typeError("Please enter a valid age")
    .min(18, "Age must be at least 18"),

  gender: yup
    .string()
    .trim()
    .required("Please provide the gender")
    .oneOf(["male", "female"]),
});

export type SignUpSchemaType = yup.InferType<typeof signUpSchema>;
