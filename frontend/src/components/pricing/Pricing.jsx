import React from "react";
import { Heading } from "../layout/heading";
import { CircleCheck } from "lucide-react";
import { Button } from "../layout/button";
import { Card, CardContent, CardFooter } from "../layout/card";

const plans = [
    {
        name: "Starter Plan",
        price: "19",
        features: [
            "Up to 2 hours of AI-generated audio or video",
            "Access to standard voice agents",
            "Script editing and instant updates",
            "Publish to major platforms"
        ]
    },
    {
        name: "Creator Plan",
        price: "49",
        features: [
            "Up to 10 hours of AI-generated content",
            "Unlimited voice agent selection and cloning",
            "Team collaboration features",
            "Priority email support"
        ]
    },
    {
        name: "Pro Plan",
        price: "99",
        features: [
            "Unlimited content creation",
            "Advanced voice cloning & multi-language support",
            "Premium analytics and audience insights",
            "Dedicated customer success manager"
        ]
    }
];

const Pricing = () => {
    return (
        <div className="max-w-7xl mx-auto p-2">
            <Heading size="large" title={"Simple, Transparent Pricing"} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-14 bg-[url('/layer.png')] bg-cover bg-center bg-no-repeat">

                {plans.map((plan, idx) => (
                    <Card
                        key={idx}
                        className="
    rounded-[32px] p-6 
    bg-[linear-gradient(180deg,rgba(255,255,255,0.15)_0%,rgba(0,0,0,0.10)_100%)]
    border border-white/20 text-white 
    backdrop-blur-lg bg-transparent
    flex flex-col justify-between h-full">
                        <CardContent className="flex flex-col gap-6 flex-1">
                            {/* HEADER */}
                            <div className="bg-[radial-gradient(80.69%_99.7%_at_50%_0.04%,_#0C4230_0%,_#000000_100%)] 
          h-[190px] w-full rounded-[32px] 
          flex flex-col justify-center items-center">
                                <h1 className="font-normal sm:text-2xl text-xl text-white">
                                    {plan.name}
                                </h1>

                                <p className="py-6 mt-4">
                                    <span className="text-white text-5xl">${plan.price}</span>
                                    <span className="text-[#BDBDBD] text-5xl font-normal">/</span>
                                    <span className="text-[#BDBDBD] font-normal">month</span>
                                </p>
                            </div>

                            {/* FEATURES */}
                            <div className="">
                                {plan.features.map((feat, i) => (
                                    <div
                                        key={i}
                                        className="flex gap-4 border-b border-[#DEDEDE]/50 py-4 items-center"
                                    >
                                        <CircleCheck />
                                        <p className="font-medium text-base">{feat}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>

                        <CardFooter className="pt-4">
                            <Button className="magic-btn w-full" variant="alpha">
                                Get Started
                            </Button>
                        </CardFooter>
                    </Card>

                ))}

            </div>
        </div>
    );
};

export default Pricing;
