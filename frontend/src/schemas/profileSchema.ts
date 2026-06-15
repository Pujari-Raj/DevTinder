import * as yup from "yup";

// Edit Profile Schema
export const EditProfileSchema = yup.object({
  age: yup
    .number()
    .optional()
    .min(18, "Age must be at least 18")
    .max(100, "Age must be less than or equal to 100"),
  gender: yup
    .string()
    .trim()
    .optional()
    .oneOf(["male", "female"]),
  photoUrl: yup
    .string()
    .trim()
    .optional()
    .url("Please provide a valid URL"),
  about: yup
    .string()
    .trim()
    .optional()
    .min(10, "About section must be at least 10 characters")
    .max(200, "About section should not exceed 200 characters"),
  skills: yup
    .array()
    .of(yup.string().trim())
    .optional()
    .min(1, "Please provide atleast one skill")
    .max(5, "You can add max 5 skills")
    .test(
      "skill-length",
      "Each skill must be between 2 and 20 characters",
      (skills) => {
        if (!skills) return true;
        return skills.every(
          (skill) => skill && skill.length >= 2 && skill.length <= 20,
        );
      },
    ),
});

export type EditProfileSchemaType = yup.InferType<typeof EditProfileSchema>;
