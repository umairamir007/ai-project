import React from 'react'
import { Button } from '../layout/button'

const Subscribe = () => {
    return (
        <div className="
            flex flex-col items-center justify-center 
            h-[280px] rounded-[32px] 
            bg-[url('/subs.png')] bg-cover bg-center bg-no-repeat 
            max-w-7xl mx-auto p-4 my-8
        ">
            <p className="text-white sm:text-2xl text-lg text-center mb-6">
                Subscribe to our newsletter
            </p>

            <div className="flex items-center gap-3 w-[600px] max-w-full justify-center">

                {/* INPUT FIELD */}
                <input
                    type="text"
                    placeholder="Enter Your Email"
                    className="
    relative h-[52px] w-full rounded-full px-6 text-white
    bg-[rgba(255,255,255,0.06)]
    backdrop-blur-xl border border-white/60
    placeholder-white/70 focus:outline-none
    /* Corner highlight */
    before:content-[''] before:absolute before:-top-[2px] before:-left-[2px]
    before:h-[60px] before:w-[120px]
    before:rounded-full
    before:bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.25),rgba(255,255,255,0)_60%)]
    before:pointer-events-none
  "
                />




                {/* BUTTON */}
                <Button
                    className="
                        h-[52px] px-8 rounded-full text-black font-semibold
                        bg-white hover:bg-white/90 transition shadow-[0px_0px_21.9px_5px_rgba(0,0,0,1)]
                    "
                >
                    Subscribe
                </Button>
            </div>
        </div>
    )
}

export default Subscribe
