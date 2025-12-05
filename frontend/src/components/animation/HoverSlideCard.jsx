export default function HoverSlideCard({ heading, users, description, className }) {
    return (
        <div className={`relative h-50 cursor-pointer group w-full ${className}`}>
            {/* Back Card  */}
            <div className="absolute inset-x-0 bottom-0 h-0 bg-gradient-to-br from-[#0C4230] to-emerald-950 overflow-hidden transition-all duration-500 ease-out group-hover:h-[180px] mb-20 rounded-[32px] hidden sm:block">
              <div className="p-6 text-white">
                <p className="sm:text-lg text-sm 3xl:text-LG font-medium">
                  {description}
                </p>
              </div>
            </div>

            {/* Front Card  */}
            <div className="relative bg-white h-48 rounded-[32px] shadow-[0px_0px_49px_5px_rgba(255,255,255,0.25)] transition-transform duration-500 ease-out sm:group-hover:translate-y-10 group-hover:translate-y-0 p-0 sm:p-6">
                <div className="flex flex-col justify-between h-full">
                    {/* Heading with padding on mobile only */}
                    <h3 className="sm:text-2xl text-lg font-semibold text-black px-6 pt-6 pb-3 sm:px-0 sm:pt-0 sm:pb-0">
                        {heading}
                    </h3>

                    {/* Mobile: full green card fills remaining space left/right/bottom */}
                    <div className="flex-1 bg-gradient-to-br from-[#0C4230] to-emerald-950 sm:hidden rounded-[32px] rounded-t-2xl px-6 py-4 flex items-center">
                        <p className="text-base text-white font-medium">
                            {description}
                        </p>
                    </div>
                    {/* Desktop / tablet: show big number, hide on mobile */}
                    <span className="sm:text-4xl text-3xl md:text-6xl font-bold leading-none text-black hidden sm:inline">
                        {users}
                    </span>
                </div>
            </div>
        </div>
    );
}