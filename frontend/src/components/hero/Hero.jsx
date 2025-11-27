
export default function Hero() {
    return (
        <section className="relative w-full h-[550px] flex items-center justify-center overflow-hidden">

            <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-60"
            >
                <source src="/videos/hero.mp4" type="video/mp4" />
            </video>

            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black"></div>

            <div className="relative z-10 flex flex-col items-center text-center max-w-4xl px-6 gap-6">
                <p className="font-[Satoshi] font-bold text-white 
                    text-2xl sm:text-4xl md:text-5xl leading-snug md:leading-[3.5rem]">
                    Turn your ideas into polished podcasts and YouTube videos—no studio needed.
                </p>

                <p className="font-[Satoshi] font-medium text-[#DEDEDE] 
                    text-base sm:text-lg md:text-2xl leading-relaxed md:leading-[2.2rem] max-w-2xl">
                    iSai uses AI voice cloning and ElevenLabs tech to create lifelike audio — fast, high-quality, and studio-free.
                </p>

                <button className="magic-btn rounded-full px-8 py-3 font-bold text-xl bg-white text-black hover:bg-[#f1f1f1] transition">
                    Get Started
                </button>
            </div>
        </section>
    );
}
