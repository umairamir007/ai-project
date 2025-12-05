import React from "react";
import { CircleChevronLeft } from "lucide-react";
import { Button } from "./layout/button";
import Navbar from "./navbar/Navbar";

const RecordVoice = () => {
  // Delay pattern (mirrored left → center → right)
  const delays = [
    0.5, 0.4, 0.3, 0.2, 0.1, 0,0, // left
    0, 0,                       // center
    0, 0.1, 0.2, 0.3, 0.4, 0.5, // right
  ];

  return (
    <div className="flex h-screen items-center justify-center">
      <Navbar />

      <div className="bg-[#FAFAFA] rounded-[32px] p-8">
        <div className="flex items-center pb-8">
          <CircleChevronLeft size={30} />
        </div>

        {/* Outer ring */}
        <div className="w-[330px] h-[330px] rounded-full bg-[#DEDEDE] relative shadow-[0px_0px_36.4px_0px_#FFFFFF33]">
          {/* Middle ring */}
          <div className="w-[300px] h-[300px] rounded-full bg-[#FAFAFA] absolute inset-0 m-auto">
            
            {/* Inner ring */}
            <div className="bg-[#FAFAFA] h-[250px] w-[250px] rounded-full absolute inset-0 m-auto shadow-[0px_0px_7.4px_3px_#00000040] flex items-center justify-center">

              <style>{`
                @keyframes waveFromCenter {
                  0%, 100% { height: 20px; }
                  50% { height: 60px; }
                }
              `}</style>

              {/* WAVEFORM (optimized) */}
              <div className="flex gap-1 items-center">
                {delays.map((delay, i) => (
                  <div
                    key={i}
                    className="h-[20px] w-[4px] bg-black rounded-full"
                    style={{
                      animation: `waveFromCenter 0.8s ease-in-out infinite ${delay}s`,
                    }}
                  ></div>
                ))}
              </div>

            </div>
          </div>
        </div>

        <div className="mt-8">
          <Button variant="alpha" className="shadow-none bg-black text-white">
            Start Recording
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecordVoice;
