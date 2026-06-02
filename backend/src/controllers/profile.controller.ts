import { Response } from 'express';
import { AsyncHandler } from '../utils/handlers';
import { ApiResponse } from '../@types/type';


// get Profile details
const viewProfile = AsyncHandler(async (req , res: Response<ApiResponse>) => {
    // Getting loggedIn user's data
    const loggedInUser = req?.user;

    // excluding sensitive data
    loggedInUser.password = undefined!;

    // Return the response
    res.status(200).json({
        success: true,
        message: "Profile Details fetched successfully",
        data: loggedInUser
    })
})

export { viewProfile }