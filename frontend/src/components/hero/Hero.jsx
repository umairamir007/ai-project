import React from "react";

const Hero = () => {
    return (
        <div className="flex flex-col items-center text-center gap-6 py-20 px-4 max-w-5xl mx-auto">

            <p className="font-[Satoshi] font-bold text-white 
                text-2xl sm:text-4xl md:text-5xl leading-snug md:leading-[3.5rem]">
                Turn your ideas into polished podcasts and YouTube videos—no studio needed.
            </p>

            <p className="font-[Satoshi] font-medium text-[#DEDEDE] 
                text-base sm:text-lg md:text-2xl leading-relaxed md:leading-[2.2rem] max-w-2xl">
                iSai uses AI voice cloning and ElevenLabs tech to create lifelike audio — fast, high-quality, and studio-free.
            </p>

            <button className="magic-btn rounded-full px-8 py-3  font-bold  text-xl text-black bg-white border-none">
                Get Started
            </button>

        </div>
    );
};

export default Hero;
