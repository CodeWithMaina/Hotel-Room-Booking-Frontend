import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { loginSchema, type LoginData } from "../validation/login.validation";
import { authApi } from "../features/api/authApi";
import { Loading } from "../components/common/Loading";
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center px-4 py-8"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1501117716987-c8e6fca29c9d?auto=format&fit=crop&w=1470&q=80')",
      }}
    >
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />

      <div className="w-full max-w-md bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl shadow-xl p-8 animate-fade-in border border-gray-200">
        <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-2">
          Lux<span className="text-[#fca311]">Hotels</span>
        </h1>
        <p className="text-center text-gray-600 text-sm mb-6">
          Sign in to your account
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#fca311] focus:border-[#fca311]"
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#fca311] focus:border-[#fca311]"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-[#fca311]"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
            <div className="text-right mt-1">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-sm text-[#fca311] hover:underline"
              >
                Forgot Password?
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#fca311] hover:bg-[#fca311]/90 text-white font-semibold py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 transition-all duration-200"
          >
            <LogIn className="w-5 h-5" />
            Log In
          </button>
        </form>

        {/* Register */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/register")}
            className="text-sm text-gray-600 hover:text-[#fca311] transition"
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
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};
