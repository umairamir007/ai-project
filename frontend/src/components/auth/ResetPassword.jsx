import React, { useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { logo } from "../../images";
import { Heading } from "../layout/heading";
import { Button } from "../layout/button";
import httpClient from "../../lib/httpClient";
import { NotifyError, NotifySuccess } from "../lib/common";

const schema = z
  .object({
    newPassword: z.string().min(7, "Password must be at least 7 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const resetToken = useMemo(
    () => searchParams.get("token") || "",
    [searchParams]
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async ({ newPassword }) => {
    if (!resetToken) {
      NotifyError("Reset link is missing or invalid.");
      return;
    }
    try {
      const { data } = await httpClient.post("/auth/reset-password", {
        resetToken,
        newPassword,
      });
      NotifySuccess(data?.message || "Password updated. Please sign in.");
      reset();
      navigate("/sign-in");
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || "Something went wrong.";
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
      <div className="h-16 flex justify-center items-center gap-3 mt-4">
        <img className="h-full object-contain" src={logo} alt="Isai" />
        <Heading size="medium" className="text-white" title="Isai" />
      </div>

      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center">
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
              Reset Password
            </h2>

            <input
              type="password"
              placeholder="New Password"
              {...register("newPassword")}
              className="
                w-full bg-transparent border border-white
                rounded-full px-4 2xl:py-4 py-2.5
                text-white placeholder-gray-300 sm:text-sm text-base 2xl:text-lg
              "
            />
            <p className="text-red-400 text-xs min-h-[18px] mt-1">
              {errors.newPassword?.message || ""}
            </p>

            <input
              type="password"
              placeholder="Confirm Password"
              {...register("confirmPassword")}
              className="
                w-full bg-transparent border border-white
                rounded-full px-4 2xl:py-4 py-2.5
                text-white placeholder-gray-300 sm:text-sm text-base 2xl:text-lg
                mt-2
              "
            />
            <p className="text-red-400 text-xs min-h-[18px] mt-1">
              {errors.confirmPassword?.message || ""}
            </p>

            <Button
              className="h-11 2xl:h-14 shadow-[0px_0px_21.9px_5px_#000000] w-full mt-2"
              variant="alpha"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                "Update Password"
              )}
            </Button>

            <p
              onClick={() => navigate("/sign-in")}
              className="text-center text-[#FAFAFA] sm:text-lg text-sm font-bold cursor-pointer mt-4"
            >
              Back to Sign In
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

