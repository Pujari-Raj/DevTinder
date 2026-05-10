import { Types } from "mongoose";
import * as yup from "yup";

export const sendConnectionRequestSchema = yup.object({
    userId: yup.string().required("Please Provide userId").test("is-valid-objectId", "Please provide valid user Id", (value) => {
        if (!value) return false;
        return Types.ObjectId.isValid(value)
    }),
    status: yup.string().required("Please provide the status value").oneOf(["interested", "ignored"], "Status must be either 'interested' or 'ignored' ")
})

export type SendConnectionRequestSchemaType = yup.InferType<typeof sendConnectionRequestSchema>

// Review connection request schema
export const ReviewConnectionRequestSchema = yup.object({
    requestId: yup
        .string()
        .required("Please provide the request id")
        .test("is-valid-objectId", "Please provide a valid request ID", (value) => {
            if (!value) return false;
            return Types.ObjectId.isValid(value);
        }),
    status: yup.string().required("Please provide the status").oneOf(["accepted", "rejected"], "Status must be either 'accepted' or 'rejected'")
});
export type ReviewConnectionRequestSchemaType = yup.InferType<typeof ReviewConnectionRequestSchema>;
