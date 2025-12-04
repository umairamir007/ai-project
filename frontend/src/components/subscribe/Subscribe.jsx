import React from 'react'
import { Button } from '../layout/button'
import PageContainer from '../layout/page-container'

const Subscribe = () => {
    return (
        <PageContainer>
   <div className="
            flex flex-col items-center justify-center 
            2xl:h-[320px] h-[300px] rounded-[32px] 
            bg-[url('/subs.png')] bg-cover bg-center bg-no-repeat 
              py-4 my-8
        ">
            <p className="text-white sm:text-2xl  text-lg text-center mb-8 font-bold">
                Subscribe to our newsletter
            </p>

            <div className="flex items-center gap-3 w-[700px] max-w-full sm:px-0 px-8 justify-center">

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
                         px-12 rounded-full text-black 
                        bg-white hover:bg-white/90 transition shadow-[0px_0px_21.9px_5px_rgba(0,0,0,1)] font-black
                    "
                >
                    Subscribe
                </Button>
            </div>
        </div>
        </PageContainer>
     
    )
}

export default Subscribe
