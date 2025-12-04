import Threads from "../animation/Threads";
import { WavyBackground } from "../animation/WavyBackground";

export default function Hero() {
    return (
        <div className="">
            <WavyBackground >
                <div className="sm:w-[70%] w-[90%] mx-auto text-center mt-16">
                    <p className="text-white font-semibold sm:text-4xl text-xl sm:leading-[58px] leading-9">Turn your ideas into polished podcasts and YouTube videos—no studio needed.</p>
                    <p className="sm:text-2xl text-base text-[#DEDEDE] font-medium sm:mt-6 mt-4 max-w-2xl text-center mx-auto">
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
        </div>

        // <div style={{ width: '100%', height: "100vh", position: 'relative' }}>
        //     <Threads
        //         amplitude={1}
        //         distance={0}
        //         enableMouseInteraction={true}
        //     />

        //     <div className="w-[90%] sm:w-[70%] absolute top-[180px] 2xl:top-[320px] left-1/2 -translate-x-1/2 text-center">
        //         <p className="text-white font-semibold sm:text-4xl text-xl sm:leading-[58px] leading-9">
        //             Turn your ideas into polished podcasts and YouTube videos—no studio needed.
        //         </p>

        //         <p className="sm:text-2xl text-base text-[#DEDEDE] font-medium sm:mt-6 mt-4 max-w-2xl mx-auto">
        //             iSai uses AI voice cloning and ElevenLabs tech to create
        //             lifelike audio — fast, high-quality, and studio-free.
        //         </p>

        //         <button className="bg-white text-black px-6 text-lg font-semibold py-3 magic-btn rounded-full mt-6">
        //             Get Started
        //         </button>
        //     </div>
        // </div>


    );
}
