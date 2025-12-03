export default function HoverSlideCard({ heading, users, description, className }) {
    return (
        <div className={`relative h-50 cursor-pointer group w-full ${className}`}>
            {/* Back Card  */}
            <div className="absolute inset-x-0 bottom-0 h-0 bg-gradient-to-br from-[#0C4230] to-emerald-950 overflow-hidden transition-all duration-500 ease-out group-hover:h-[180px] mb-20 rounded-[32px]">
                <div className="p-6 text-white">
                    <p className="sm:text-lg text-sm 3xl:text-3xl font-medium">
                        {description}
                    </p>
                </div>
            </div>

            {/* Front Card  */}
            <div className="relative bg-white p-6 h-48 rounded-[32px] shadow-[0px_0px_49px_5px_rgba(255,255,255,0.25)] transition-transform duration-500 ease-out group-hover:translate-y-10">
                <div className="flex flex-col justify-between h-full">
                    <h3 className="sm:text-2xl text-lg font-semibold text-black">{heading}</h3>
                    <span className="sm:text-4xl text-3xl md:text-6xl font-bold leading-none text-black">{users}</span>
                </div>
            </div>
        </div>
    );
}