import React, { useState } from "react";
import { Heading } from "../layout/heading";
import { logo } from "../../images";
import { Button } from "../layout/button";
import { useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import httpClient from "../../lib/httpClient";
import { NotifyError, NotifySuccess } from "../lib/common";
import { Eye, EyeOff, Loader2 } from "lucide-react";

// Zod Schema
const signupSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  })
  // .refine((data) => data.password === data.confirmPassword, {
  //   message: "Passwords do not match",
  //   path: ["confirmPassword"],
  // });

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  // WATCH PASSWORD INPUT
  const passwordValue = watch("password");

  const onSubmit = async (formData) => {
    try {
      const { data } = await httpClient.post("/auth/register", formData);

      if (!data?.email) {
        throw new Error("Registration failed. No email returned.");
      }

      NotifySuccess("Account created successfully! Please log in.");
      navigate("/sign-in", { replace: true });
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Registration failed. Please try again.";
      NotifyError(message);
    }
  };

  return (
    <div
      className="
        min-h-screen w-full 
        bg-[url('/login.png')] 
        bg-cover bg-center bg-no-repeat
        flex flex-col
      "
    >
      {/* Header */}
      <div className="h-16 flex justify-center items-center gap-3 mt-4">
        <img className="h-full object-contain" src={logo} alt="Isai" />
        <Heading size="medium" className="text-white" title="Isai" />
      </div>

      {/* Center Content */}
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center">
          {/* SIGN UP BOX */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="
              sm:w-[360px] w-[300px] 2xl:w-[480px] 
              px-6 py-8 rounded-xl
              border border-white/30
              backdrop-blur-[6px]
              bg-[linear-gradient(180deg,rgba(0,0,0,0.6)_0%,rgba(12,66,48,0.34)_100%)]
              shadow-[0_0_80px_rgba(0,255,200,0.15)]
            "
          >
            <h2 className="text-center text-white sm:text-2xl text-xl font-semibold mb-6">
              Sign Up
            </h2>

            {/* First + Last Name */}
            <div className="flex w-full gap-3">
              <div className="relative w-full mb-4">
                <input
                  type="text"
                  placeholder="First Name"
                  {...register("firstName")}
                  className="w-full bg-transparent border border-white rounded-full px-4 2xl:py-4 py-2.5 text-white placeholder-gray-300 sm:text-sm text-base 2xl:text-lg"
                />
                {errors.firstName && (
                  <p className="absolute -bottom-4 left-2 text-red-400 text-xs">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div className="relative w-full mb-4">
                <input
                  type="text"
                  placeholder="Last Name"
                  {...register("lastName")}
                  className="w-full bg-transparent border border-white rounded-full px-4 2xl:py-4 py-2.5 text-white placeholder-gray-300 sm:text-sm text-base 2xl:text-lg"
                />
                {errors.lastName && (
                  <p className="absolute -bottom-4 left-2 text-red-400 text-xs">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="relative w-full mb-4">
              <input
                type="email"
                placeholder="Email"
                {...register("email")}
                className="w-full bg-transparent border border-white rounded-full px-4 2xl:py-4 py-2.5 text-white placeholder-gray-300 sm:text-sm text-base 2xl:text-lg"
              />
              {errors.email && (
                <p className="absolute -bottom-4 left-2 text-red-400 text-xs">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="relative w-full mb-4">
          <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                {...register("password")}
                className="
      w-full
      bg-transparent
      border border-white
      rounded-full px-4 pr-12 2xl:py-4 py-2.5
      text-white placeholder-gray-300 sm:text-sm text-base 2xl:text-lg
    "
              />

              {/* Eye Icon */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-4 flex items-center text-white/70 hover:text-white"
              >
                {showPassword ? <EyeOff size={28} /> : <Eye size={28} />}
              </button>
            </div>

              {/* FIXED — USING watch() INSTEAD OF field */}
              {passwordValue && (
                <PasswordRequirements password={passwordValue} />
              )}

              {errors.password && (
                <p className="absolute -bottom-4 left-2 text-red-400 text-xs">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* <div className="relative w-full mb-6">
              <input
                type="password"
                placeholder="Confirm Password"
                {...register("confirmPassword")}
                className="
                  w-full bg-transparent border border-white 
                  rounded-full px-4 2xl:py-4 py-2.5
                  text-white placeholder-gray-300 sm:text-sm text-base 2xl:text-lg
                "
              />
              {errors.confirmPassword && (
                <p className="absolute -bottom-4 left-2 text-red-400 text-xs">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div> */}

            <Button
              className="h-13 shadow-[0px_0px_21.9px_5px_#000000] w-full"
              variant="alpha"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>

          {/* Already have account */}
          <p className="text-white sm:text-base text-xs mt-6 font-bold text-center">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/sign-in")}
              className="underline cursor-pointer"
            >
              Sign In
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

function PasswordRequirements({ password }) {
  const requirements = [
    { label: "At least 8 characters", test: (pw) => pw.length >= 8 },
    { label: "At least one uppercase letter", test: (pw) => /[A-Z]/.test(pw) },
    { label: "At least one lowercase letter", test: (pw) => /[a-z]/.test(pw) },
    { label: "At least one number", test: (pw) => /[0-9]/.test(pw) },
    {
      label: "At least one special character",
      test: (pw) => /[^A-Za-z0-9]/.test(pw),
    },
  ];

  return (
    <ul className="mt-2 space-y-1 text-sm">
      {requirements.map((req, i) => {
        const valid = req.test(password);
        return (
          <li
            key={i}
            className={`flex items-center gap-2 ${
              valid ? "text-green-600" : "text-red-500"
            }`}
          >
            <span className="text-lg">{valid ? "✔" : "✘"}</span>
            {req.label}
          </li>
        );
      })}
    </ul>
  );
}
