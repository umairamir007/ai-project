"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
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

export default function StepsScroll() {
    return (
        <section className=" text-white py-24">
            <div className="max-w-3xl mx-auto px-4 space-y-16">
                {steps.map((step, index) => (
                    <div
                        key={step.title}
                        className="grid grid-cols-[minmax(0,1.4fr)_auto_minmax(0,1.4fr)] gap-10 items-start"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.6, delay: index * 0.15 }}
                            className="text-left"
                        >
                            <h3 className="text-2xl font-semibold leading-snug">
                                {step.title}
                            </h3>
                        </motion.div>
                        <div className="flex flex-col items-center">
                            {/* Vertical line segment */}
                            <div className="relative h-24 flex items-stretch">
                                {/* grey base line */}
                                <div className="w-[5px] h-full bg-[#303030] rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ scaleY: 0 }}
                                        whileInView={{ scaleY: 1 }}
                                        viewport={{ once: true, amount: 0.6 }}
                                        transition={{
                                            duration: 0.9,
                                            delay: index * 0.2,
                                            ease: "easeInOut",
                                        }}
                                        className="w-[5px] h-full bg-neutral-200 origin-top rounded-full"
                                    />
                                </div>
                            </div>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.6 }}
                                transition={{ duration: 0.5, delay: index * 0.2 + 0.2 }}
                                className="mt-4 flex items-center gap-2 text-sm text-white"
                            >
                                <span className="flex h-6 w-6 items-center justify-center rounded-full text-black font-bold text-xl">
                                    <FontAwesomeIcon icon={faCircleCheck} style={{ color: "#D5D5D5" }} />

                                </span>
                                <span>Step {index + 1}</span>
                            </motion.div>
                        </div>
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.6, delay: index * 0.2 + 0.1 }}
                            className="text-left max-w-sm"
                        >
                            <p className="text-[#DEDEDE] text-lg leading-relaxed">
                                {step.description}
                            </p>
                        </motion.div>
                    </div>
                ))}
            </div>
        </section>
    );
}
