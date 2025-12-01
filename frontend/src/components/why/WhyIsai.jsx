
import typeWriter from '../../assets/type.png'
import { Heading } from '../layout/heading'
import { collaboration, instant, platform, script } from '../../images'
import { Para } from '../layout/para'
import { Card, CardContent } from '../layout/card'

const WhyIsai = () => {
    return (
        <Card className='bg-[#040404] max-w-6xl p-0 mx-auto'>
            <CardContent>
                <div>
                    <Heading
                        className="text-white text-center "
                        size="large"
                        title={"Why You'll Love Isai"}
                    />

                    {/* GRID WRAPPER */}
                    <div
                        className="
      mx-auto
      grid gap-6
      grid-cols-1
      lg:grid-cols-8 lg:grid-rows-7 py-28
    "
                    >
                        <div
                            className="
        bg-[linear-gradient(180deg,rgba(255,255,255,0.1491)_0%,rgba(0,0,0,0.0994)_100%)]
        rounded-[32px] py-6 px-6 border border-white/20
        flex flex-col justify-between
        h-auto
        lg:col-span-3 lg:row-span-4
      "
                        >
                            <Heading className="text-white" size="why_heading" title={"Custom Voice Agents & Cloning"} />

                            <div className="flex justify-center items-center py-6">
                                <img src={typeWriter} alt="Voice Cloning" className="w-[180px] sm:w-[220px] h-auto object-contain" />
                            </div>

                            <Para size={"why"} para={"Schedule or export content to Spotify, YouTube, Apple Podcasts, or social channels"} />
                        </div>

                        {/* 2️⃣ Scriptwriting */}
                        <div
                            className="
        bg-[linear-gradient(180deg,rgba(255,255,255,0.1491)_0%,rgba(0,0,0,0.0994)_100%)]
        rounded-[32px] border border-white/20 px-4
        flex flex-col sm:flex-row items-center
        h-auto
        lg:col-span-5 lg:row-span-2 lg:col-start-4 lg:row-start-1 sm:py-0 py-4
      "
                        >
                            <div className="py-6">
                                <Heading size="why_heading" title="AI Scriptwriting" className="text-white font-semibold" />
                                <Para className="mt-2" size="why" para={"Generate attention-grabbing scripts and episode outlines."} />
                            </div>

                            <div className="ml-auto flex items-center">
                                <img src={script} alt="script" className="w-full sm:w-[200px] h-auto object-contain" />
                            </div>
                        </div>
                        <div
                            className="
        bg-[linear-gradient(180deg,rgba(255,255,255,0.1491)_0%,rgba(0,0,0,0.0994)_100%)]
        rounded-[32px] border border-white/20 px-4
        flex flex-col sm:flex-row items-center
        h-auto
        lg:col-span-5 lg:row-span-2 lg:col-start-4 lg:row-start-3 py-4 sm:py-0
      "
                        >
                            <div className="py-6">
                                <Heading size="why_heading" title="Instant Editing" className="text-white font-semibold" />
                                <Para className="mt-2" size="why" para={"Edit any text and instantly regenerate the matching audio or video."} />
                            </div>

                            <div className="ml-auto flex items-center">
                                <img src={instant} alt="instant" className="w-full sm:w-[200px] h-full object-contain" />

                            </div>
                        </div>

                        <div
                            className="
        bg-[linear-gradient(180deg,rgba(255,255,255,0.15)_0%,rgba(0,0,0,0.10)_100%)]
        rounded-[32px] border border-white/20 py-4 px-6
        flex items-center justify-between
        h-auto
        lg:col-span-4 lg:row-span-3 lg:col-start-1 lg:row-start-5 flex-col sm:flex-row 
      "
                        >
                            <div>
                                <Heading className="text-white font-bold" size="why_heading" title={"Multi-Platform Publishing"} />
                                <Para size="why" para={"Publish to all major platforms with a single click."} />
                            </div>

                            <div className="w-[150px] sm:w-[220px]">
                                <img src={platform} alt="platform" className="w-full h-auto" />
                            </div>
                        </div>

                        <div
                            className="
        bg-[linear-gradient(180deg,rgba(255,255,255,0.15)_0%,rgba(0,0,0,0.10)_100%)]
        rounded-[32px] border border-white/20 py-4 px-6
        flex items-center justify-between
        h-auto
        lg:col-span-4 lg:row-span-3 lg:col-start-5 lg:row-start-5 flex-col sm:flex-row 
      "
                        >
                            <div>
                                <Heading className="text-white font-bold" size="why_heading" title={"Collaboration Tools"} />
                                <Para size="why" para={"Share projects and work in real-time with your team."} />
                            </div>

                            <div className="w-[150px] sm:w-[220px] mt-4 sm:pt-0">
                                <img src={collaboration} alt="collaboration" className="w-full h-auto" />
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>


    )
}

export default WhyIsai
