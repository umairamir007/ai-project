import { WavyBackground } from "../animation/WavyBackground";

export default function Hero() {
    return (
        <WavyBackground>
            <div className="max-w-3xl text-center">
                <p className="text-white font-semibold sm:text-4xl text-2xl leading-[58px]">Turn your ideas into polished podcasts and YouTube videos—no studio needed.</p>
                <p className="text-2xl text-[#DEDEDE] font-medium mt-2 max-w-xl text-center mx-auto">
                    iSai uses AI voice cloning and ElevenLabs tech to create
                    lifelike audio — fast, high-quality, and studio-free.
                </p>
                <div>
                    <button className="bg-white text-black px-6 text-lg font-semibold py-3 magic-btn rounded-full mt-6">
                        Get Started
                    </button>
                </div>
            </div>
        </WavyBackground>
    );
}
