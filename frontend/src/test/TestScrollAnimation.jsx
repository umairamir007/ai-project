"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { Heading } from "../components/layout/heading";
import FadeContent from "../components/animation/fade";

const steps = [
    {
        title: "Write or Upload Your Script",
        description:
            "Produce ready-to-publish podcasts or videos instantly, with automatic captions and visuals.",
    },
    {
        title: "Select or Clone a Voice",
        description:
            "Pick from our library of natural-sounding voices or clone your own voice in minutes.",
    },
    {
        title: "Generate Audio & Video",
        description:
            "Produce ready-to-publish podcasts or videos instantly, with automatic captions and visuals.",
    },
    {
        title: "Publish Everywhere",
        description:
            "Schedule or export content to Spotify, YouTube, Apple Podcasts, or social channels.",
    },
];

export default function ScrollSteps() {
    const ref = useRef(null);
    const [active, setActive] = useState(-1);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start center", "end center"],
    });

    const fill = useSpring(scrollYProgress, {
        stiffness: 80,
        damping: 25,
    });

    useEffect(() => {
        return scrollYProgress.on("change", (p) => {
            const stepProgress = p * (steps.length + 1);
            setActive(Math.min(steps.length - 1, Math.max(-1, Math.floor(stepProgress) - 1)));
        });
    }, [scrollYProgress]);

    return (
        <section
            ref={ref}
            className="bg-[#040404] text-white relative py-10 ">
            <div className="space-y-10" >
                <FadeContent >
<Heading
                    size="large"
                    className="
                        w-[70%] md:w-[80%] lg:w-[50%]
                        mx-auto font-bold 
                        text-center 
                        text-2xl sm:text-5xl 
                    "
                    title={'High-Quality Content Made Easy'}
                />
</FadeContent>

                <div className="flex items-center justify-center">
                    <div className="max-w-3xl w-full px-6 space-y-0">

                        {steps.map((step, index) => (
                            <div
                                key={step.title}
                                className="grid grid-cols-[minmax(0,1.4fr)_auto_minmax(0,1.4fr)] sm:gap-10 gap-4 items-start  "
                            >
                                {/* LEFT TITLE */}
                                <motion.div
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={index <= active ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                                    transition={{ duration: 0.6, ease: "easeOut" }}
                                    className="text-left"
                                >
                                    <h3 className="sm:text-2xl text-base font-semibold leading-snug">
                                        {step.title}
                                    </h3>
                                </motion.div>

                                {/* CENTER LINE + STEP */}
                                <div className="flex flex-col items-center">
                                    <div className="relative h-24 flex items-stretch">
                                        <div className="w-[5px] h-full bg-[#303030] rounded-full overflow-hidden">
                                            <motion.div
                                                animate={{ scaleY: index <= active ? 1 : 0 }}
                                                transition={{ duration: 0.6, ease: "easeInOut" }}
                                                className="w-[5px] h-full bg-neutral-200 origin-top rounded-full"
                                            />
                                        </div>
                                    </div>

                                    <motion.div
                                        animate={
                                            index <= active
                                                ? { opacity: 1, y: 0 }
                                                : { opacity: 0.2, y: 4 }
                                        }
                                        transition={{ duration: 0.4 }}
                                        className="justify-center h-full flex items-center gap-2  text-white  sm:my-14 my-10"
                                    >
                                        <span className="flex h-6 w-6 items-center justify-center rounded-full">
                                            <FontAwesomeIcon
                                                icon={faCircleCheck}
                                                style={{
                                                    color:
                                                        index === active ? "#22C55E" : "#D5D5D5",
                                                }}
                                            />
                                        </span>
                                        <span className="text-base 2xl:text-lg">Step {index + 1}</span>
                                    </motion.div>
                                </div>

                                {/* RIGHT DESCRIPTION */}
                                <motion.div
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={index <= active ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                                    transition={{ duration: 0.6, ease: "easeOut" }}
                                    className="text-left max-w-sm"
                                >
                                    <p className="text-[#DEDEDE] sm:text-lg text-xs leading-relaxed">
                                        {step.description}
                                    </p>
                                </motion.div>
                            </div>
                        ))}

                    </div>
                </div>
            </div>
        </section>
    );
}