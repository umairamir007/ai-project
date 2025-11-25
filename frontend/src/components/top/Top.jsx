import React from 'react'
import Navbar from '../navbar/Navbar'
import Hero from '../hero/Hero'
import Threads from '../animation/Threads'

const Top = () => {
    return (
        <section className="relative w-full min-h-screen bg-black text-white overflow-hidden flex flex-col">
            <Navbar />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Threads amplitude={3} distance={0} enableMouseInteraction={true} />
            </div>
            <div className="relative  flex flex-col flex-1 justify-center">
                <Hero />
            </div>

        </section>
    )
}

export default Top
