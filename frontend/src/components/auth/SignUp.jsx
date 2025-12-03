import React from 'react'
import { Heading } from '../layout/heading'
import { logo } from '../../images'
import { Button } from '../layout/button'
import { useNavigate } from 'react-router-dom'

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import httpClient from '../../lib/httpClient'

// Zod Schema
const signupSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required")
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});

const SignUp = () => {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(signupSchema)
    });
    const onSubmit = async (formData) => {
        try {
            const { data } = await httpClient.post("/auth/register", formData);

            if (!data?.email) {
                throw new Error("Registration failed. No email returned.");
            }

            alert("Account created successfully! Please log in.");
            navigate("/sign-in", { replace: true });

        } catch (err) {
            const message =
                err?.response?.data?.message ||
                err?.message ||
                "Registration failed. Please try again.";
            alert(message);
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
                            max-w-[380px]
                            w-full
                            px-6 py-8
                            rounded-xl
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
                                    className="
                w-full bg-transparent border border-white 
                rounded-full px-4 py-2.5 
                text-white placeholder-gray-300 text-sm
            "
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
                                    className="
                w-full bg-transparent border border-white 
                rounded-full px-4 py-2.5 
                text-white placeholder-gray-300 text-sm
            "
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
                                className="
            w-full bg-transparent border border-white 
            rounded-full px-4 py-2.5 
            text-white placeholder-gray-300 text-sm
        "
                            />
                            {errors.email && (
                                <p className="absolute -bottom-4 left-2 text-red-400 text-xs">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <div className="relative w-full mb-4">
                            <input
                                type="password"
                                placeholder="Password"
                                {...register("password")}
                                className="
            w-full bg-transparent border border-white 
            rounded-full px-4 py-2.5 
            text-white placeholder-gray-300 text-sm
        "
                            />
                            {errors.password && (
                                <p className="absolute -bottom-4 left-2 text-red-400 text-xs">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>
                        <div className="relative w-full mb-6">
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                {...register("confirmPassword")}
                                className="
            w-full bg-transparent border border-white 
            rounded-full px-4 py-2.5 
            text-white placeholder-gray-300 text-sm
        "
                            />
                            {errors.confirmPassword && (
                                <p className="absolute -bottom-4 left-2 text-red-400 text-xs ">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>


                        <Button
                            className="h-11 shadow-[0px_0px_21.9px_5px_#000000] w-full"
                            variant="alpha"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Processing..." : "Sign Up"}
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
    )
}

export default SignUp
