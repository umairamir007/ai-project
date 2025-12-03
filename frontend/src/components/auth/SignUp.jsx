import React from 'react'
import { Heading } from '../layout/heading'
import { logo } from '../../images'
import { Button } from '../layout/button'
import { useNavigate } from 'react-router-dom'

const SignUp = () => {
    const navigate = useNavigate()

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
                    <div
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
                        <div className="flex w-full gap-3 mb-4">
                            <input
                                type="text"
                                placeholder="First Name"
                                className="
                                    w-full bg-transparent border border-white 
                                    rounded-full px-4 py-2.5 
                                    text-white placeholder-gray-300 text-sm
                                "
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                className="
                                    w-full bg-transparent border border-white 
                                    rounded-full px-4 py-2.5 
                                    text-white placeholder-gray-300 text-sm
                                "
                            />
                        </div>

                        <input
                            type="email"
                            placeholder="Email"
                            className="
                                w-full mb-4 
                                bg-transparent 
                                border border-white
                                rounded-full px-4 py-2.5 
                                text-white placeholder-gray-300 text-sm
                            "
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            className="
                                w-full mb-4 
                                bg-transparent border border-white 
                                rounded-full px-4 py-2.5 
                                text-white placeholder-gray-300 text-sm
                            "
                        />

                        <input
                            type="password"
                            placeholder="Confirm Password"
                            className="
                                w-full mb-6 
                                bg-transparent border border-white 
                                rounded-full px-4 py-2.5 
                                text-white placeholder-gray-300 text-sm
                            "
                        />

                        <Button
                            className="h-11 shadow-[0px_0px_21.9px_5px_#000000]"
                            variant="alpha"
                        >
                            Sign Up
                        </Button>
                    </div>

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
