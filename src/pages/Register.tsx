import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast, { Toaster } from "react-hot-toast";
import { Eye, EyeOff, Lock, User, Phone, LogIn, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useCreateUserMutation } from "../features/api";

const registerSchema = z
  .object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().email("Enter a valid email address"),
    phone: z.string().min(10, "Enter a valid phone number"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterData = z.infer<typeof registerSchema>;

export const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [registerUser, { isLoading }] = useCreateUserMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterData) => {
    try {
      const { confirmPassword, ...userData } = data;
      await registerUser(userData).unwrap();
      toast.success("User registered successfully!", {
        style: { fontWeight: "500" },
        iconTheme: {
          primary: "#2563EB",
          secondary: "white",
        },
      });
      navigate("/login");
    } catch (error) {
      toast.error("Registration failed. Please try again.", {
        style: { fontWeight: "500" },
      });
      console.log(error)
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br text-black from-slate-100 to-slate-200 flex items-center justify-center px-4">
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />

      <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-2xl shadow-xl animate-fade-in">
        <h1 className="text-4xl font-extrabold text-center text-blue-600 mb-1">
          Lux<span className="text-gray-900">Hotels</span>
        </h1>
        <p className="text-center text-gray-500 mb-6 text-sm">
          Create your account and enjoy a luxurious experience.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <div className="flex items-center bg-slate-100 rounded-lg px-3 py-2 focus-within:ring-2 ring-blue-600">
              <User className="w-5 h-5 text-blue-600 mr-2" />
              <input
                type="text"
                placeholder="John"
                className="bg-transparent w-full outline-none text-sm"
                {...register("firstName")}
              />
            </div>
            {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <div className="flex items-center bg-slate-100 rounded-lg px-3 py-2 focus-within:ring-2 ring-blue-600">
              <User className="w-5 h-5 text-blue-600 mr-2" />
              <input
                type="text"
                placeholder="Doe"
                className="bg-transparent w-full outline-none text-sm"
                {...register("lastName")}
              />
            </div>
            {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName.message}</p>}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <div className="flex items-center bg-slate-100 rounded-lg px-3 py-2 focus-within:ring-2 ring-blue-600">
              <Phone className="w-5 h-5 text-blue-600 mr-2" />
              <input
                type="tel"
                placeholder="0712345678"
                className="bg-transparent w-full outline-none text-sm"
                {...register("phone")}
              />
            </div>
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
          </div>
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

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="flex items-center bg-slate-100 rounded-lg px-3 py-2 focus-within:ring-2 ring-blue-600 relative">
              <Lock className="w-5 h-5 text-blue-600 mr-2" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="bg-transparent w-full outline-none text-sm pr-8"
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
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <div className="flex items-center bg-slate-100 rounded-lg px-3 py-2 focus-within:ring-2 ring-blue-600">
              <Lock className="w-5 h-5 text-blue-600 mr-2" />
              <input
                type="password"
                placeholder="••••••••"
                className="bg-transparent w-full outline-none text-sm"
                {...register("confirmPassword")}
              />
            </div>
            {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 transition-all duration-200"
          >
            <LogIn className="w-5 h-5" />
            Register
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/login")}
            className="text-sm text-blue-600 hover:underline"
          >
            Already have an account? <span className="font-medium">Login</span>
          </button>
        </div>
      </div>

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
