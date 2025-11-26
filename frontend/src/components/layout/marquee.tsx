import Image from "next/image";
import Star from "@/../public/images/svgs/star.svg";

const FastMarquee = () => {
    const text = "Blu Whale Studios";

    const content = (
        <div className="flex items-center gap-3 px-6 shrink-0">
            <Image
                src={Star}
                alt="star"
                width={24}
                height={24}
                className="w-5 h-5 md:w-6 md:h-6 text-primary"
            />
            <span className="text-sm md:text-base lg:text-lg font-semibold text-gray-800">
                {text}
            </span>
        </div>
    );

    return (
        <div className="bg-white/30 backdrop-blur-md py-2 my-6 3xl:my-8 overflow-hidden">
            <div className="marquee-wrapper flex whitespace-nowrap">
                <div className="marquee-track flex animate-marquee">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div key={`1-${i}`}>{content}</div>
                    ))}
                </div>
                <div className="marquee-track flex animate-marquee">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div key={`2-${i}`}>{content}</div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FastMarquee;
