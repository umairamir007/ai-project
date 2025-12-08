import React from "react";
import Navbar from "./navbar/Navbar";

const MyLibrary = () => {
  return (
    <div className="h-screen w-full bg-theme">
      <Navbar />
      <div className="flex w-full h-full py-40">
        <div className="w-[90%] mx-auto  text-[#DEDEDE] p-10 ">
          {/* Top Bar */}
          <div className="flex justify-end mb-10">
            <input
              type="text"
              placeholder="Search"
              className="w-[260px] h-[48px] rounded-full bg-[#D9D9D9] text-black placeholder-black px-5 outline-none font-semibold"
            />
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-3 pb-3 border-b border-[#DEDEDE] 4xl:text-2xl sm:text-xl text-lg font-bold">
            <div>Title</div>
            <div>Created at</div>
            <div></div>
          </div>

          {/* Row 1 */}
          <div className="grid grid-cols-3 py-5 border-b border-[#DEDEDE] sm:text-lg text-sm 4xl:text-xl font-bold">
            <div className="font-semibold">Untitled Project</div>
            <div>28/9/2012</div> 
            <div className="flex items-center justify-end gap-4">
              <button className="text-xl">⋯</button>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-3 py-5 border-b border-[#DEDEDE] sm:text-lg text-sm 4xl:text-xl font-bold">
            <div className="font-semibold">Untitled Project</div>
            <div>28/9/2012</div>
            <div className="flex items-center justify-end gap-4">
              {/* Download icon */}
              <button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
                  />
                </svg>
              </button>
              <button className="text-xl">⋯</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyLibrary;
