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
      navigate(response.userType === "admin" ? "/admin/dashboard" : "/user/dashboard");
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
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center px-4 py-12"
      style={{
        backgroundImage:
          "url('https://media.istockphoto.com/id/104731717/photo/luxury-resort.jpg?s=612x612&w=0&k=20&c=cODMSPbYyrn1FHake1xYz9M8r15iOfGz9Aosy9Db7mI=')",
      }}
    >
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />

      <div className="w-full max-w-md bg-white/90 backdrop-blur-md shadow-2xl border border-slate-200 rounded-2xl p-10 animate-fade-in">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
            Stay<span className="text-[#c89d25]">Cloud</span>
          </h1>
          <p className="text-sm text-slate-600 mt-1">Sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email Field */}
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
              <input
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#c89d25] focus:border-[#c89d25]"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password")}
                className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-10 pr-10 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#c89d25] focus:border-[#c89d25]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-3.5 text-slate-400 hover:text-[#c89d25]"
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
                onClick={() => navigate("/forgot-password")}
                className="text-sm text-[#c89d25] hover:underline"
              >
                Forgot Password?
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2.5 bg-[#c89d25] hover:bg-[#b6891f] text-white font-semibold rounded-lg text-sm flex items-center justify-center gap-2 transition-all duration-200"
          >
            <LogIn className="w-5 h-5" />
            Log In
          </button>
        </form>

        {/* Register Redirect */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/register")}
            className="text-sm text-slate-600 hover:text-[#c89d25] transition"
          >
            Don’t have an account? <span className="font-semibold">Register</span>
          </button>
        </div>
      </div>

      {/* Fade-in Animation */}
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
