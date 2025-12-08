import Threads from "../animation/Threads";
import { WavyBackground } from "../animation/WavyBackground";

export default function Hero() {
  return (
  <div className="relative w-full overflow-hidden sm:h-screen h-full rounded-xl sm:pt-0 pt-40 sm:pb-0 pb-20">

    {/* CONTENT */}
    <div className="max-w-7xl w-[90%] mx-auto text-center mt-16 z-20 relative sm:pt-60 md:pt-60 xl:pt-56 3xl:pt-52 4xl:pt-80">
        <p className="text-white font-semibold sm:text-3xl md:text-5xl text-2xl sm:leading-[50px] md:leading-[58px] 2xl:leading-[68px]">
            Turn your ideas into polished podcasts and YouTube videos—no studio needed.
        </p>

        <p className="sm:text-2xl text-base text-[#DEDEDE] font-medium sm:mt-6 max-w-2xl text-center mx-auto sm:my-10 my-8 sm:leading-9">
            iSai uses AI voice cloning and ElevenLabs tech to create lifelike audio — fast, high-quality, and studio-free.
        </p>

        <button className="bg-white  sm:py-4 py-3 sm:px-14 px-8 text-lg font-black magic-btn rounded-full my-4 2xl:text-xl">
            Get Started
        </button>
    </div>

    {/* SPLINE BACKGROUND */}
    <iframe
        src="https://my.spline.design/claritystream-ZsYGd1UWKXqbVn7QHQtxOPCq/"
        frameBorder="0"
        className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none"
    ></iframe>
    {/* <iframe src='https://my.spline.design/claritystream-PLXVd1pUc5MN8dwP26y8g6Aw/' frameborder='0' width='100%' height='100%'></iframe> */}

    {/* BLACK COVER — hides the “Built with Spline” badge */}
    <div className="absolute bottom-0 right-0 w-40 h-16 bg-black z-30 pointer-events-none"></div>
</div>

  );
}
