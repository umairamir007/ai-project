"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
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
    const [active, setActive] = useState(0);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start center", "end center"],
    });

    const fill = useSpring(scrollYProgress, { stiffness: 100, damping: 20 });

    useEffect(() => {
        return scrollYProgress.on("change", (p) => {
            setActive(Math.min(steps.length - 1, Math.floor(p * steps.length)));
        });
    }, [scrollYProgress]);

    return (
        <section
            ref={ref}
            className="bg-[#040404] text-white relative space-y-12"
            style={{ height: `${steps.length * 50}vh` }}
        >
            <div className="sticky top-0">
                <h1
                    className="
    w-[70%] md:w-[80%] lg:w-[50%]
    mx-auto font-bold 
    text-center 
    text-2xl sm:text-5xl 
    leading-8 sm:leading-[58px] py-16
  "
                >
                    High-Quality Content Made Easy
                </h1>


                <div className="flex items-center justify-center">
                    <div className="max-w-3xl w-full px-6 space-y-14 ">

                        {steps.map((step, index) => (
                            <div
                                key={step.title}
                                className="grid grid-cols-[minmax(0,1.4fr)_auto_minmax(0,1.4fr)] sm:gap-10 gap-4 items-start"
                            >
                                {/* LEFT TITLE */}
                                <motion.div
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={index <= active ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.4 }}
                                    className="text-left"
                                >
                                    <h3 className="sm:text-2xl text-base font-semibold leading-snug">{step.title}</h3>
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
                                        animate={index <= active ? { opacity: 1, y: 0 } : { opacity: 0.2, y: 4 }}
                                        transition={{ duration: 0.4 }}
                                        className="mt-4 flex items-center gap-2 text-sm text-white"
                                    >
                                        <span className="flex h-6 w-6 items-center justify-center rounded-full">
                                            <FontAwesomeIcon
                                                icon={faCircleCheck}
                                                style={{
                                                    color: index === active ? "#22C55E" : "#D5D5D5",
                                                }}
                                            />
                                        </span>
                                        <span>Step {index + 1}</span>
                                    </motion.div>
                                </div>

                                {/* RIGHT DESCRIPTION */}
                                <motion.div
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={index <= active ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.45 }}
                                    className="text-left max-w-sm"
                                >
                                    <p className="text-[#DEDEDE] sm:text-lg text-xs leading-relaxed">{step.description}</p>
                                </motion.div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section >
    );
}
