import React from "react";
import { logo } from "../../images";
import { Heading } from "../layout/heading"; // correct import
import { Button } from "../layout/button";
import { useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import httpClient from "../../lib/httpClient";
import { NotifyError, NotifySuccess } from "../lib/common";
import { Loader2 } from "lucide-react";

// Validation Schema
const forgotSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

const ForgotPassword = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async ({ email }) => {
    try {
      const { data } = await httpClient.post("/auth/forgot-password", {
        email,
      });

      NotifySuccess(
        data?.message || "Reset link sent to your email if it exists."
      );
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong.";
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

          {/* FORGOT PASSWORD BOX */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="
              sm:w-[360px] w-[300px] 2xl:w-[480px] 
              px-6 py-8
              rounded-xl
              border border-white/30
              backdrop-blur-[6px]
              bg-[linear-gradient(180deg,rgba(0,0,0,0.6)_0%,rgba(12,66,48,0.34)_100%)]
              shadow-[0_0_80px_rgba(0,255,200,0.15)]
            "
          >
            <h2 className="text-center text-white sm:text-2xl text-xl font-semibold mb-6">
              Forgot Password
            </h2>

            {/* EMAIL */}
            <input
              type="email"
              placeholder="Your Email"
              {...register("email")}
              className="
                w-full bg-transparent border border-white
                rounded-full px-4 2xl:py-4 py-2.5
                text-white placeholder-gray-300 sm:text-sm text-base 2xl:text-lg
              "
            />
            <p className="text-red-400 text-xs min-h-[18px] mt-1">
              {errors.email?.message || ""}
            </p>

            <Button
              className="h-11 2xl:h-14 shadow-[0px_0px_21.9px_5px_#000000] w-full mt-2"
              variant="alpha"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                "Send Reset Link"
              )}
            </Button>

            <p
              onClick={() => navigate("/sign-in")}
              className="text-center text-[#FAFAFA] sm:text-lg text-sm font-bold cursor-pointer mt-4"
            >
              Back to Sign In
            </p>
          </form>

          {/* SIGN UP OPTION */}
          <p className="text-white sm:text-base text-xs mt-6 font-bold text-center">
            Don't have an account?
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

export default ForgotPassword;
