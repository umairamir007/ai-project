import React from 'react'
import { Card, CardContent } from '../layout/card'
import { Heading } from '../layout/heading'
import { Para } from '../layout/para'
import PageContainer from '../layout/page-container'
import FadeContent from '../animation/fade'
import AnimatedContent from '../animation/Animated'

const useCases = [
    {
        img: "https://ik.imagekit.io/nvxedozet/player.png",
        title: "Podcasters",
        desc: "Create consistent, high-quality episodes at scale",
    },
    {
        img: "https://ik.imagekit.io/nvxedozet/player.png",
        title: "Youtuber Creators",
        desc: "Convert blogs or scripts into full-fledged video",
    },
    {
        img: "https://ik.imagekit.io/nvxedozet/speaker.png",
        title: "Brands & Marketers",
        desc: "Share projects and work in real-time with your team",
    },
    {
        img: "https://ik.imagekit.io/nvxedozet/trainer.png",
        title: "Educators & Trainers",
        desc: "Deliver courses or audio lessons with natural voices.",
    }
]

const Case = () => {
    return (
        <PageContainer>
            <Card className="p-0 bg-[#040404]">
                <CardContent className='p-0 space-y-10'>
                    <FadeContent>
                        <Heading size='large' className="text-white text-center" title={"Key Use Cases of Isai"} />
                    </FadeContent>

                    {/* Responsive Grid */}
                    <div className="grid 
                        grid-cols-1 sm:grid-cols-4 
                        sm:grid-rows-4 gap-12 h-full">

                        {useCases.map((item, index) => (
                            <AnimatedContent
                                key={index}
                                distance={150}
                                direction="horizontal"
                                reverse={false}
                                duration={1.2}
                                ease="power3.out"
                                initialOpacity={0}
                                animateOpacity
                                scale={0.8}
                                threshold={0.2}
                                delay={index * 0.2}
                                className="sm:col-span-2 sm:row-span-2"
                                once={true}
                            >
                                <div
                                    className="
                                        bg-[radial-gradient(59.6%_100%_at_50%_0%,#0C4230_0%,#090909_100%)]
                                        rounded-[32px] 
                                        p-6 sm:p-0 
                                        [border-width:1px] 
                                        [border-image-source:radial-gradient(47.24%_84.18%_at_50%_15.82%,#FFFFFF_0%,#000000_100%)]
                                        [border-image-slice:1]
                                        h-[210px] sm:h-[237px]
                                        flex flex-col items-center justify-center text-center
                                    "
                                >
                                    <div className="h-20 w-20 sm:h-28 sm:w-28 mx-auto">
                                        <img src={item.img} alt="" className="w-full h-full object-contain" />
                                    </div>

                                    <div className="mt-2">
                                        <Heading className="text-white p-0 sm:text-xl md:text-2xl text-lg" title={item.title} />
                                        <Para className="text-center mt-2" size="why" para={item.desc} />
                                    </div>
                                </div>
                            </AnimatedContent>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </PageContainer>
    )
}

export default Case