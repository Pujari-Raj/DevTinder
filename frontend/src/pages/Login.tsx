import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { IoEyeOff, IoEye } from "react-icons/io5";
import { Link } from "react-router-dom";
import { LoginSchema, type LoginSchemaType } from "../schemas/authSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import useLogin from "../hooks/useLogin";
import FormError from "../components/FormError";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors, isValid }, reset } = useForm<LoginSchemaType>({
    resolver: yupResolver(LoginSchema),
    mode: "onChange",
  });

  const { handleLogin, isLoading, error } = useLogin(reset);

  const onSubmit: SubmitHandler<LoginSchemaType> = async (data) => {
    await handleLogin(data);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="card bg-gray-950 border border-gray-800 shadow-2xl">
          <div className="card-body">
            <h1 className="card-title text-3xl font-bold text-white mb-2">
              Login to your Account
            </h1>
            <p className="text-gray-400 mb-6">
              Welcome back! Please enter your details.
            </p>

            {error && (
              <div className="alert alert-error mb-4">
                <span className="text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-white">Email Address</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    {...register("email")}
                    placeholder="you@example.com"
                    className={`input input-bordered w-full bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-sky-500 focus:outline-none ${
                      errors.email ? "border-red-500" : ""
                    }`}
                  />
                  {errors.email && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <FormError message={errors?.email?.message} />
                    </div>
                  )}
                </div>
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
                  {errors.password ? (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <FormError message={errors?.password?.message} />
                    </div>
                  ) : (
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
                  )}
                </div>
              </div>

              {/* Remember Me */}
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text text-gray-400">Remember me</span>
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm border-gray-600 checked:bg-sky-500 checked:border-sky-500"
                  />
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isValid || isLoading}
                className="btn w-full bg-sky-500 hover:bg-sky-600 border-0 text-white font-semibold mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </form>

            {/* Sign Up Link */}
            <p className="text-center text-gray-400 mt-6">
              Not Registered Yet?{" "}
              <Link to="/signup" className="text-sky-400 hover:text-sky-300 font-semibold">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

