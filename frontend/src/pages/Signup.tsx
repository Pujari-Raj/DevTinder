import { useState } from "react";
import { useForm } from "react-hook-form";
import { IoEyeOff, IoEye } from "react-icons/io5";
import { Link } from "react-router-dom";
import { SignupSchema, type SignupSchemaType } from "../schemas/authSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import useSignUp from "../hooks/useSignup";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);

  // react hook form implementation
  const { register, handleSubmit, watch, formState : {errors, isValid}, reset } = useForm<SignupSchemaType>({
    resolver: yupResolver(SignupSchema),
    defaultValues: {
      gender: "male"
    },
    mode: "onChange"
  })
  
  const { isloading, handleSignup } = useSignUp(reset);

  // const onSubmit : SubmitHandler<SignupSchemaType> = (data) => console.log('data',data);
  // console.log("errors",errors);
  // console.log("isValid",isValid);
  
  const onSubmit = async(data: SignupSchemaType) => {
    await handleSignup(data);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="card bg-gray-950 border border-gray-800 shadow-2xl">
          <div className="card-body">
            <h1 className="card-title text-3xl font-bold text-white mb-2">
              Create your Account
            </h1>
            <p className="text-gray-400 mb-6">
              Join us today! Please fill in your details.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-white">Full Name</span>
                </label>
                <input
                  type="text"
                  {...register("name")}
                  placeholder="Name"
                  className={`input input-bordered w-full bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-sky-500 focus:outline-none ${
                    errors.name ? "border-red-500" : ""
                  }`}
                />
                {errors?.name && (
                  <label className="label">
                    <span className="label-text-alt text-red-500">
                      {errors?.name?.message}
                    </span>
                  </label>
                )}
              </div>

              {/* Email Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-white">Email Address</span>
                </label>
                <input
                  type="email"
                  {...register("email")}
                  placeholder="you@example.com"
                  className={`input input-bordered w-full bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-sky-500 focus:outline-none ${
                    errors.email ? "border-red-500" : ""
                  }`}
                />
                {errors?.email && (
                  <label className="label">
                    <span className="label-text-alt text-red-500">
                      {errors?.email?.message}
                    </span>
                  </label>
                )}
              </div>

              {/* Password Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-white">Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    placeholder="••••••••"
                    className={`input input-bordered w-full bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-sky-500 focus:outline-none pr-10 ${
                      errors.password ? "border-red-500" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-sky-400 transition"
                  >
                    {showPassword ? (
                      <IoEyeOff size={20} />
                    ) : (
                      <IoEye size={20} />
                    )}
                  </button>
                </div>
                {errors?.password && (
                  <label className="label">
                    <span className="label-text-alt text-red-500">
                      {errors?.password?.message}
                    </span>
                  </label>
                )}
              </div>

              {/* Age Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-white">Age</span>
                </label>
                <input
                  type="number"
                  {...register("age")}
                  placeholder="Age"
                  min={18}
                  className={`input input-bordered w-full bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-sky-500 focus:outline-none ${
                    errors.age ? "border-red-500" : ""
                  }`}
                />
                {errors?.age && (
                  <label className="label">
                    <span className="label-text-alt text-red-500">
                      {errors?.age?.message}
                    </span>
                  </label>
                )}
              </div>

              {/* Gender Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-white">Gender</span>
                </label>
                <div className="flex gap-6 mt-2">
                  <label className="label cursor-pointer">
                    <input
                      {...register("gender")}
                      type="radio"
                      value="male"
                      className="radio border-gray-600 checked:bg-sky-500 checked:border-sky-500"
                    />
                    <span className="label-text text-gray-300 ml-2">Male</span>
                  </label>
                  <label className="label cursor-pointer">
                    <input
                      {...register("gender")}
                      type="radio"
                      value="female"
                      className="radio border-gray-600 checked:bg-sky-500 checked:border-sky-500"
                    />
                    <span className="label-text text-gray-300 ml-2">
                      Female
                    </span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isValid || isloading}
                className="btn w-full bg-sky-500 hover:bg-sky-600 border-0 text-white font-semibold mt-6"
              >
                Sign Up
              </button>
            </form>

            {/* Login Link */}
            <p className="text-center text-gray-400 mt-6">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-sky-400 hover:text-sky-300 font-semibold bg-none border-none cursor-pointer"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
