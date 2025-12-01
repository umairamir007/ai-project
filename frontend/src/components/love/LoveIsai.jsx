import React from 'react'
import { Heading } from '../layout/heading'
import { Card } from '../layout/card'
import HoverSlideCard from '../animation/HoverSlideCard'

const cards = [
    {
        id: 1,
        title: "High Performance",
        number: "01",
        description: "From one episode per week to daily content without extra overhead.",
        className: "sm:col-start-2"
    },
    {
        id: 2,
        title: "Global Expansion",
        number: "03",
        description: "From one episode per week to daily content without extra overhead.",
        className: "sm:row-start-2"
    },
    {
        id: 3,
        title: "Multi-Chain Support",
        number: "04",
        description: "From one episode per week to daily content without extra overhead.",
        className: "sm:col-start-3 sm:row-start-2"
    },
    {
        id: 4,
        title: "Advanced Security",
        number: "05",
        description: "From one episode per week to daily content without extra overhead.",
        className: "sm:col-start-2 sm:row-start-3"
    }
]

const LoveIsai = () => {
    return (
        <Card className="bg-theme max-w-7xl mx-auto py-0 px-4  gap-0  ">
            <Heading
                size="large"
                className="text-white text-center "
                title={"Why Choose Our Platform"}
            />

            <div className="grid sm:grid-cols-3 grid-cols-1 gap-5 py-28 bg-[url('/lines.png')] bg-cover bg-center">
                {cards.map((card) => (
                    <HoverSlideCard
                        key={card.id}
                        heading={card.title}
                        users={card.number}
                        description={card.description}
                        className={card.className}
                    />
                ))}
            </div>
        </Card>
    )
}

export default LoveIsai
