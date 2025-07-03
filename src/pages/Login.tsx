import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react";
import { toast, Toaster } from "sonner";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import { loginSchema, type LoginData } from "../validation/login.validation";
import { authApi } from "../features/api/authApi";
import { Loading } from "./Loading";
import { useDispatch } from "react-redux";
import { persistCredentials } from "../features/auth/authSlice";

export const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();

  const [loginUser, { isLoading: isLoginUserLoading }] =
    authApi.useLoginUserMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginData) => {
    const loginData = {
      email: data.email,
      password: data.password,
    };

    try {
      const response = await loginUser(loginData).unwrap();
      console.log(response)

      if (!response) {
        toast.error("Invalid response from server");
        return;
      }

      if (response?.userType === "admin") {
        navigate("/user/dashboard");
        await dispatch(persistCredentials(response));
        toast.success("Welcome to LuxHotel");
      } else if (response?.userType === "user") {
        navigate("/user/dashboard");
        await dispatch(persistCredentials(response));
        toast.success("Welcome to LuxHotel");
      } else {
        navigate("/");
      }
    } catch (error: unknown) {
      console.error("Login error:", error);

      // Handle specific error cases
      if (typeof error === "object" && error !== null && "status" in error) {
        const status = (error as { status?: number | string }).status;
        if (status === 401) {
          toast.error("Invalid email or password");
        } else if (status === 400) {
          toast.error("Validation error. Please check your inputs");
        } else if (status === 500) {
          toast.error("Server error. Please try again later");
        } else if (status === "FETCH_ERROR") {
          toast.error("Network error. Please check your connection");
        } else {
          toast.error("Login failed. Please try again");
        }
      } else {
        toast.error("Login failed. Please try again");
      }
    }
  };

  // if (isLoginUserError) {
  //   return <Error/>
  // }

  if (isLoginUserLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center px-4">
      <Toaster
        position="top-center"
        richColors
        closeButton
        duration={4000}
        visibleToasts={3}
        toastOptions={{
          style: {
            fontSize: "0.875rem",
            maxWidth: "400px",
          },
          unstyled: false,
        }}
      />

      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl border border-gray-100">
        {/* Branding */}
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-4 tracking-tight">
          LuxHotels
        </h1>
        <p className="text-center text-gray-500 mb-6 text-sm">
          Book your next stay with comfort and luxury.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium text-gray-700">
                Email
              </span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-5 h-5 text-blue-600" />
              <input
                type="email"
                placeholder="example@email.com"
                className={`input input-bordered w-full pl-10 py-2.5 focus:ring-2 ring-blue-600 rounded-lg ${
                  errors.email ? "border-red-500" : ""
                }`}
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium text-gray-700">
                Password
              </span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-blue-600" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`input input-bordered w-full pl-10 pr-10 py-2.5 focus:ring-2 ring-blue-600 rounded-lg ${
                  errors.password ? "border-red-500" : ""
                }`}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-3 text-gray-600 hover:text-blue-600"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}

            {/* Forgot Password */}
            <div className="text-right mt-1">
              <button
                type="button"
                className="text-sm text-blue-600 hover:underline"
                onClick={() =>
                  Swal.fire(
                    "Reset link sent!",
                    "Check your email inbox.",
                    "info"
                  )
                }
              >
                Forgot Password?
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white border-none text-lg"
          >
            <LogIn className="w-5 h-5" />
            Log In
          </button>
        </form>

        {/* Register link */}
        <div className="text-center mt-5">
          <button
            onClick={() => navigate("/register")}
            className="btn btn-link text-blue-600 hover:text-blue-700"
          >
            Don't have an account? Register
          </button>
        </div>
      </div>
    </div>
  );
};
