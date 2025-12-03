import React from 'react'
import { Card, CardContent } from '../layout/card'
import { Heading } from '../layout/heading'
import { mic, player, speaker, trainer } from '../../images'
import { Para } from '../layout/para'

const useCases = [
    {
        img: mic,
        title: "Podcasters",
        desc: "Create consistent, high-quality episodes at scale",
    },
    {
        img: player,
        title: "Youtuber Creators",
        desc: "Convert blogs or scripts into full-fledged video",
    },
    {
        img: speaker,
        title: "Brands & Marketers",
        desc: "Share projects and work in real-time with your team",
    },
    {
        img: trainer,
        title: "Educators & Trainers",
        desc: "Deliver courses or audio lessons with natural voices.",
    }
]

const Case = () => {
    return (
        <Card className="max-w-7xl  mx-auto bg-[#040404] py-10">
            <CardContent className='p-0 px-6 space-y-10'>
                <Heading size='large' className="text-white text-center " title={"Key Use Cases of Isai"} />

                {/* Responsive Grid */}
                <div className="grid 
            grid-cols-1 sm:grid-cols-4 
            sm:grid-rows-4 gap-6 h-full">

                    {useCases.map((item, index) => (
                        <div
                            key={index}
                            className="
                sm:col-span-2 sm:row-span-2 
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
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

export default Case
