import Threads from "../animation/Threads";
import { WavyBackground } from "../animation/WavyBackground";

export default function Hero() {
  return (
  <div className="relative w-full overflow-hidden h-screen rounded-xl">

    {/* CONTENT */}
    <div className="sm:w-[60%] w-[90%] mx-auto text-center mt-16 z-20 relative top-[300px]">
        <p className="text-white font-semibold sm:text-5xl text-xl sm:leading-[68px]">
            Turn your ideas into polished podcasts and YouTube videos—no studio needed.
        </p>

        <p className="sm:text-2xl text-base text-[#DEDEDE] font-medium sm:mt-6 max-w-2xl text-center mx-auto my-10 sm:leading-9">
            iSai uses AI voice cloning and ElevenLabs tech to create lifelike audio — fast, high-quality, and studio-free.
        </p>

        <button className="bg-white text-black py-4 px-14 text-lg font-black magic-btn rounded-full my-4 2xl:text-xl">
            Get Started
        </button>
    </div>

    {/* SPLINE BACKGROUND */}
    <iframe
        src="https://my.spline.design/claritystream-PLXVd1pUc5MN8dwP26y8g6Aw/"
        frameBorder="0"
        className="absolute top-0 left-0 w-full h-screen z-0 pointer-events-none"
    ></iframe>

    {/* BLACK COVER — hides the “Built with Spline” badge */}
    <div className="absolute bottom-0 right-0 w-40 h-16 bg-black z-30 pointer-events-none"></div>
</div>

  );
}
