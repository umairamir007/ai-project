
import typeWriter from '../../assets/type.png'
import { Heading } from '../layout/heading'
import { collaboration, instant, platform, script } from '../../images'
import { Para } from '../layout/para'

const WhyIsai = () => {
    return (
        <div >
            <Heading className='text-white text-center py-20' size='large' title={"Why You'll Love Isai"} />
            <div className="grid grid-cols-8 grid-rows-7 gap-6 w-[87%]  mx-auto">
                <div className="col-span-3 row-span-4  bg-[linear-gradient(180deg,rgba(255,255,255,0.1491)_0%,rgba(0,0,0,0.0994)_100%)] rounded-[32px]  py-6 px-6 flex flex-col justify-between  border border-white/20 ">

                    <Heading className='text-white' size='why_heading' title={"Custom Voice Agents & Cloning"} />
                    <div className="flex justify-center items-center py-6">
                        <img
                            src={typeWriter}
                            alt="Voice Cloning"
                            className="w-100 h-100"
                        />
                    </div>
                    <Para size={'why'} para={"Schedule or export content to Spotify, YouTube, Apple Podcasts, or social channels"} />

                </div>

                <div className="col-span-5 row-span-2 col-start-4 row-start-1 rounded-[32px] bg-[linear-gradient(180deg,rgba(255,255,255,0.1491)_0%,rgba(0,0,0,0.0994)_100%)] border border-white/20 w-full  flex  px-4">

                    <div className="py-10">
                        <Heading size='why_heading' title="AI Scriptwriting" className="text-white font-semibold " />
                        <Para className="mt-2" size='why' para={" Generate attention-grabbing scripts and episode outlines."} />
                    </div>
                    <div className="ml-auto flex items-center">
                        <img src={script} alt="script logo" className="w-[200px] h-[180px] object-contain" />
                    </div>

                </div>

                <div className="col-span-5 row-span-2 col-start-4 row-start-3 rounded-[32px] bg-[linear-gradient(180deg,rgba(255,255,255,0.1491)_0%,rgba(0,0,0,0.0994)_100%)] border border-white/20 w-full gap-4  flex  px-4">
                    <div className="py-10">
                        <Heading size='why_heading' title="Instant Editing" className="text-white font-semibold " />
                        <Para className="mt-2" size='why' para={"Edit any text and instantly regenerate the matching audio or video."} />
                    </div>

                    <div className="ml-auto flex items-center">
                        <img src={instant} alt="script logo" className="w-[200px] h-[180px] object-contain" />
                    </div>
                </div>
                <div className="col-span-4 row-span-3 col-start-1 row-start-5 flex items-center justify-between rounded-[32px] bg-[linear-gradient(180deg,rgba(255,255,255,0.15)_0%,rgba(0,0,0,0.10)_100%)] py-4 px-6 border border-white/20 h-[270px]">
                    <div>
                        <Heading className={"text-white font-bold"} size='why_heading' title={"Multi-Platform Publishing"} />
                        <Para size='why' para={"Publish to all major platforms  with a single click."} />
                    </div>
                    <div className="w-[220px]">
                        <img src={platform} alt="Publishing" className="w-full h-auto" />
                    </div>
                </div>
                <div className="col-span-4 row-span-3 col-start-5 row-start-5 flex items-center justify-between rounded-[32px] bg-[linear-gradient(180deg,rgba(255,255,255,0.15)_0%,rgba(0,0,0,0.10)_100%)] py-4 px-6 border border-white/20 h-[270px]">
                    <div>
                        <Heading className={"text-white font-bold"} size='why_heading' title={"Collaboration Tools"} />
                        <p className="text-gray-300 mt-3 text-[15px]">

                        </p>
                        <Para size='why' para={"Share projects and work in real-time with your team"} />
                    </div>
                    <div className="w-[220px]">
                        <img src={collaboration} alt="Collaboration Tools" className="w-full " />
                    </div>
                </div>
            </div>

        </div>
    )
}

export default WhyIsai
