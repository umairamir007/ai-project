import React from 'react'
import { Heading } from '../layout/heading'
import { logo } from '../../images'
import { Button } from '../layout/button'
import { useNavigate } from 'react-router-dom'

const SignIn = () => {
    const navigate = useNavigate()

    return (
        <div
            className="
                min-h-screen w-full
                bg-[url('/')]
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
                            Log In
                        </h2>

                        <input
                            type="email"
                            placeholder="Your email"
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
                                w-full mb-5
                                bg-transparent
                                border border-white
                                rounded-full px-4 py-2.5
                                text-white placeholder-gray-300 text-sm
                            "
                        />

                        <Button
                            className="h-11 shadow-[0px_0px_21.9px_5px_#000000]"
                            variant="alpha"
                        >
                            Log In
                        </Button>

                        <p className="text-center text-[#FAFAFA] sm:text-lg text-sm font-bold cursor-pointer mt-4">
                            Forgot password?
                        </p>
                    </div>

                    {/* SIGN UP BELOW */}
                    <p className="text-white sm:text-base text-xs mt-6 font-bold text-center">
                        Don't have account?
                        <span
                            onClick={() => navigate('/sign-up')}
                            className="underline cursor-pointer ml-1"
                        >
                            Sign Up
                        </span>
                    </p>

                </div>
            </div>

        </div>
    )
}

export default SignIn
