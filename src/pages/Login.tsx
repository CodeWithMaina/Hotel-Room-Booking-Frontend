import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
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

  const [loginUser, { isLoading }] = authApi.useLoginUserMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginData) => {
    try {
      const response = await loginUser(data).unwrap();
      dispatch(persistCredentials(response));
      toast.success(`Welcome back, ${response.firstName}!`);
      if(response.userType === "admin"){
      navigate("/admin/dashboard");
      }else if(response.userType === "user"){
      navigate("/user/dashboard");
      }
    } catch (error: any) {
      const status = error?.status;
      if (status === 401) toast.error("Invalid email or password");
      else if (status === 400) toast.error("Invalid input, check your form");
      else if (status === 500) toast.error("Server error, try again later");
      else if (status === "FETCH_ERROR") toast.error("Network error");
      else toast.error("Login failed. Please try again");
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-br text-black from-slate-100 to-slate-200 flex items-center justify-center px-4">
      {/* Toast */}
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />

      <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-2xl shadow-xl animate-fade-in">
        {/* Logo */}
        <h1 className="text-4xl font-extrabold text-center text-blue-600 mb-1">
          Lux<span className="text-gray-900">Hotels</span>
        </h1>
        <p className="text-center text-gray-500 mb-6 text-sm">
          Sign in to access your account.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="flex items-center bg-slate-100 rounded-lg px-3 py-2 focus-within:ring-2 ring-blue-600">
              <Mail className="w-5 h-5 text-blue-600 mr-2" />
              <input
                type="email"
                placeholder="you@example.com"
                className="bg-transparent w-full outline-none text-sm placeholder-gray-400"
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="flex items-center bg-slate-100 rounded-lg px-3 py-2 focus-within:ring-2 ring-blue-600 relative">
              <Lock className="w-5 h-5 text-blue-600 mr-2" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="bg-transparent w-full outline-none text-sm placeholder-gray-400 pr-8"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 text-gray-500 hover:text-blue-600 transition"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
            )}
            <div className="text-right mt-1">
              <button
                type="button"
                onClick={() =>
                  Swal.fire("Reset link sent!", "Check your inbox.", "info")
                }
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 transition-all duration-200"
          >
            <LogIn className="w-5 h-5" />
            Log In
          </button>
        </form>

        {/* Register Redirect */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/register")}
            className="text-sm text-blue-600 hover:underline"
          >
            Don’t have an account? <span className="font-medium">Register</span>
          </button>
        </div>
      </div>

      {/* Animation */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};
