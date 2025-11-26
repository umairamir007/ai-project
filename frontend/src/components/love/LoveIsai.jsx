import React from 'react'
import { Heading } from '../layout/heading'
import { Card, CardContent } from '../layout/card'

const LoveIsai = () => {
    return (
        <Card className={'bg-theme min-h-[900px] w-[95%] mx-auto'}>
            <Heading size='large' className='text-white text-center' title={"Why Choose Our Platform"} />

            <div className="grid sm:grid-cols-3 grid-cols-1 gap-4 py-16">

                {/* center top on desktop, full width mobile */}
                <Card className="sm:col-start-2 w-full h-[200px] rounded-[32px] shadow-[0px_0px_49px_1px_rgba(255,255,255,0.25)] bg-white">
                    <CardContent className="flex flex-col justify-between h-full">
                        <h3 className="sm:text-2xl text-lg font-semibold text-black">Scalable Production</h3>
                        <span className="sm:text-4xl text-3xl md:text-6xl font-semibold leading-none text-black">02</span>
                    </CardContent>
                </Card>

                {/* left bottom - stays full width on mobile */}
                <Card className="sm:row-start-2 w-full h-[200px] rounded-[32px] shadow-[0px_0px_49px_1px_rgba(255,255,255,0.25)] bg-white">
                    <CardContent className="flex flex-col justify-between h-full">
                        <h3 className="sm:text-2xl text-lg font-semibold text-black">Scalable Production</h3>
                        <span className="sm:text-4xl text-3xl md:text-6xl font-semibold leading-none text-black">02</span>
                    </CardContent>
                </Card>

                {/* right bottom */}
                <Card className="sm:col-start-3 sm:row-start-2 w-full h-[200px] rounded-[32px] shadow-[0px_0px_49px_1px_rgba(255,255,255,0.25)] bg-white">
                    <CardContent className="flex flex-col justify-between h-full">
                        <h3 className="sm:text-2xl text-lg font-semibold text-black">Scalable Production</h3>
                        <span className="sm:text-4xl text-3xl md:text-6xl font-semibold leading-none text-black">02</span>
                    </CardContent>
                </Card>

                {/* bottom center */}
                <Card className="sm:col-start-2 sm:row-start-3 w-full h-[200px] rounded-[32px] shadow-[0px_0px_49px_1px_rgba(255,255,255,0.25)] bg-white">
                    <CardContent className="flex flex-col justify-between h-full">
                        <h3 className="sm:text-2xl text-lg font-semibold text-black">Scalable Production</h3>
                        <span className="sm:text-4xl text-3xl md:text-6xl font-semibold leading-none text-black">02</span>
                    </CardContent>
                </Card>

            </div>
        </Card>
    )
}

export default LoveIsai
