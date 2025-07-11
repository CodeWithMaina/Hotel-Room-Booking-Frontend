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
      if (response.userType === "admin") {
        navigate("/admin/dashboard");
      } else {
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-[#03071e] text-white px-4 py-12">
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />

      <div className="w-full max-w-6xl mx-auto grid md:grid-cols-2 bg-[#14213d] rounded-2xl shadow-2xl overflow-hidden animate-fade-in border border-[#fca311]/20">
        {/* Image Side */}
        <div className="hidden md:block relative">
          <img
            src="https://images.unsplash.com/photo-1517840901100-8179e982acb7?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" // Replace with your image path
            alt="Luxury hotel entrance"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center">
            <h2 className="text-3xl font-bold text-[#fca311] px-6 text-center">
              Indulge in Class. <br />
              Log In & Relax.
            </h2>
          </div>
        </div>

        {/* Login Form */}
        <div className="w-full p-8 md:p-12 bg-[#14213d] text-white">
          <h1 className="text-4xl font-extrabold text-center mb-1 text-[#fca311] tracking-wide">
            Lux<span className="text-white">Hotels</span>
          </h1>
          <p className="text-center text-[#e5e5e5] mb-6 text-sm">
            Sign in to continue your luxurious journey.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1 text-[#e5e5e5]">Email</label>
              <div className="flex items-center bg-black rounded-lg px-3 py-2 border border-[#fca311]/40 focus-within:ring-2 focus-within:ring-[#fca311]">
                <Mail className="w-5 h-5 text-[#fca311] mr-2" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="bg-transparent w-full text-sm placeholder-[#e5e5e5]/60 text-white outline-none"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-1 text-[#e5e5e5]">Password</label>
              <div className="flex items-center bg-black rounded-lg px-3 py-2 border border-[#fca311]/40 focus-within:ring-2 focus-within:ring-[#fca311] relative">
                <Lock className="w-5 h-5 text-[#fca311] mr-2" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="bg-transparent w-full text-sm placeholder-[#e5e5e5]/60 text-white outline-none pr-8"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 text-[#e5e5e5]/60 hover:text-[#fca311] transition"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>
              )}
              <div className="text-right mt-1">
                <button
                  type="button"
                  onClick={() =>
                    Swal.fire("Reset link sent!", "Check your inbox.", "info")
                  }
                  className="text-sm text-[#fca311] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-[#fca311] hover:bg-[#fca311]/90 text-black font-semibold py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 transition-all duration-200"
            >
              <LogIn className="w-5 h-5" />
              Log In
            </button>
          </form>

          {/* Register */}
          <div className="text-center mt-6">
            <button
              onClick={() => navigate("/register")}
              className="text-sm text-[#e5e5e5] hover:text-[#fca311] transition"
            >
              Don’t have an account? <span className="font-medium">Register</span>
            </button>
          </div>
        </div>
      </div>

      {/* Animation */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};
