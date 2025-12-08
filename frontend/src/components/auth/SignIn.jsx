import React, { useState } from "react";
import { Heading } from "../layout/heading";
import { logo } from "../../images";
import { Button } from "../layout/button";
import { useNavigate } from "react-router-dom";
import httpClient from "../../lib/httpClient";
import { setAuthSession } from "../../utils/authStorage";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { NotifyError } from "../lib/common";
import { Eye, EyeOff, Loader2 } from "lucide-react";

// Zod Schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  // Submit Handler
  const onSubmit = async (formData) => {
    try {
      const { data } = await httpClient.post("/auth/login", formData);

      if (!data?.accessToken?.token || !data?.refreshToken?.token) {
        throw new Error("Invalid login response");
      }

      setAuthSession({
        email: data.email,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });

      navigate("/user-dashboard", { replace: true });
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Login failed. Please try again.";
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
      {/* Logo Header */}
      <div className="h-16 flex justify-center items-center gap-3 mt-4">
        <img className="h-full object-contain" src={logo} alt="Isai" />
        <Heading size="medium" className="text-white" title="Isai" />
      </div>

      {/* Center Content */}
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center">
          {/* LOGIN BOX */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="
                            sm:w-[360px] w-[300px]  2xl:w-[480px] 
                            px-6 py-8
                            rounded-xl
                            border border-white/30
                            backdrop-blur-[6px]
                            bg-[linear-gradient(180deg,rgba(0,0,0,0.6)_0%,rgba(12,66,48,0.34)_100%)]
                            shadow-[0_0_80px_rgba(0,255,200,0.15)]
                        "
          >
            <h2 className="text-center text-white sm:text-2xl text-xl font-semibold mb-6">
              Log In
            </h2>

            {/* EMAIL */}
            <input
              type="email"
              placeholder="Your email"
              {...register("email")}
              className="
                                w-full
                                bg-transparent
                                border border-white
                                rounded-full px-4 2xl:py-4 py-2.5
                                text-white placeholder-gray-300 sm:text-sm text-base 2xl:text-lg
                            "
            />
            <p className="text-red-400 text-xs min-h-[18px] mt-1 ">
              {errors.email ? errors.email.message : ""}
            </p>

            {/* PASSWORD */}
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

            <p className="text-red-400 text-xs min-h-[18px] mt-1 mb-2">
              {errors.password ? errors.password.message : ""}
            </p>

            <Button
              className="h-11 2xl:h-14 shadow-[0px_0px_21.9px_5px_#000000] w-full"
              variant="alpha"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                "Log In"
              )}
            </Button>

            <p className="text-center text-[#FAFAFA] sm:text-lg text-sm font-bold cursor-pointer mt-4">
              Forgot password?
            </p>
          </form>

          {/* SIGN UP BELOW */}
          <p className="text-white sm:text-base text-xs mt-6 font-bold text-center">
            Don't have account?
            <span
              onClick={() => navigate("/sign-up")}
              className="underline cursor-pointer ml-1"
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
