import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Send } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useForgotPasswordMutation } from "../features/api/authApi";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

const ForgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof ForgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const onSubmit: SubmitHandler<ForgotPasswordFormValues> = async (data) => {
    try {
      await forgotPassword(data).unwrap();
      toast.success("Password reset link sent to your email.");
    } catch (error: unknown) {
      const err = error as FetchBaseQueryError;
      const errorMessage =
        "data" in err && typeof err.data === "object" && err.data !== null
          ? (err.data as { error?: string }).error || "Something went wrong"
          : "Network error or unknown error";
      toast.error(errorMessage);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center px-4 py-12"
      style={{
        backgroundImage:
          "url('https://media.istockphoto.com/id/1467742991/photo/tourist-resort-at-sunset.jpg?s=612x612&w=0&k=20&c=xROsYFdlXHyphRpgL4_rHwfY36VgSpCaMQU5qjYOvmM=')",
      }}
    >
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />

      <div className="w-full max-w-md bg-white/90 backdrop-blur-md shadow-2xl border border-slate-200 rounded-2xl p-10 animate-fade-in">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Reset<span className="text-[#c89d25]">Password</span>
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Enter your email to receive reset instructions
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email Field */}
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">
              Email Address
            </label>
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

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2.5 bg-[#c89d25] hover:bg-[#b6891f] text-white font-semibold rounded-lg text-sm flex items-center justify-center gap-2 transition-all duration-200"
            disabled={isLoading}
          >
            <Send className="w-5 h-5" />
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="text-center mt-6">
          <a
            href="/login"
            className="text-sm text-slate-600 hover:text-[#c89d25] transition"
          >
            Back to Login
          </a>
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
}
