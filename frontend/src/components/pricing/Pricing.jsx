import React from "react";
import { Heading } from "../layout/heading";
import { CheckIcon, CircleCheck } from "lucide-react"
import { Button } from "../layout/button";

const Pricing = () => {
    return (
        <div className=" max-w-7xl mx-auto  p-2 ">
            <Heading size="large" title={'Simple, Transparent Pricing'} />
            <div className="flex gap-6 py-14">
                <div
                    className="
    h-[600px] rounded-[32px] p-4 bg-[linear-gradient(180deg,rgba(255,255,255,0.15)_0%,rgba(0,0,0,0.10)_100%)]
    border border-white/20 text-white w-[400px] backdrop-blur-lg bg-transparent ">
                    <div class="bg-[radial-gradient(80.69%_99.7%_at_50%_0.04%,_#0C4230_0%,_#000000_100%)] h-[190px] w-full rounded-[32px] flex flex-col justify-center items-center">
                        <h1 className="font-normal sm:text-2xl text-xl text-white">
                            Starter Plan
                        </h1>
                        <p className="py-6 mt-4 ">
                            <span className="text-white text-5xl"> $19</span>  <span className="text-[#BDBDBD] text-5xl font-normal">/</span><span className="text-[#BDBDBD] font-normal">
                                month
                            </span>
                        </p>
                    </div>
                    <div className="my-6">
                        <div className="flex gap-4 border-b-2 border-[#DEDEDE] py-4 items-center">
                            <CircleCheck />
                            <p className="font-medium text-lg">Up to 2 hours of AI-generated audio or video</p>
                        </div>
                        <div className="flex gap-4 border-b-2 border-[#DEDEDE] py-4 items-center">
                            <CircleCheck />
                            <p className="font-medium text-lg">Access to standard voice agents </p>
                        </div>
                        <div className="flex gap-4 border-b-2 border-[#DEDEDE] py-4 items-center">
                            <CircleCheck />
                            <p className="font-medium text-lg">Script editing and instant updates </p>
                        </div>
                        <div className="flex gap-4 border-b-2 border-[#DEDEDE] py-4 items-center">
                            <CircleCheck />
                            <p className="font-medium text-lg">Publish to major platforms </p>
                        </div>

                    </div>
                    <div>
                        {/* <Button>
                            Hell
                        </Button> */}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Pricing;
