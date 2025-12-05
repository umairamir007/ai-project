
import React from 'react'
import Navbar from './navbar/Navbar'
import { ChevronLeft } from 'lucide-react'

const RecordVoice = () => {
  return (
    <div>
    <Navbar />
    <div className="flex items-center justify-center min-h-screen bg-black p-4">
      <div className="h-[540px] w-full max-w-sm bg-gray-100 rounded-[32px] p-8 flex flex-col items-center justify-between shadow-2xl">
        {/* Back button */}
        <div className="w-full">
          <button className="w-10 h-10 rounded-full border-2 border-gray-800 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </button>
        </div>

        {/* Waveform circle */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative">
            {/* Outer ring */}
            <div className="w-72 h-72 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 shadow-xl flex items-center justify-center">
              {/* Inner white circle */}
              <div className="w-64 h-64 rounded-full bg-white shadow-inner flex items-center justify-center">
                {/* Waveform */}
                <div className="flex items-center gap-[3px]">
                  {[4, 12, 8, 16, 6, 14, 10, 18, 8, 16, 6, 12, 8, 14, 10, 16, 8, 12, 6, 14].map((height, i) => (
                    <div
                      key={i}
                      className="w-[3px] bg-black rounded-full transition-all duration-150"
                      style={{ height: `${height * 2}px` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Start Recording button */}
        <button className="w-full bg-black text-white py-4 rounded-full text-lg font-semibold hover:bg-gray-900 transition-colors shadow-lg">
          Start Recording
        </button>
      </div>
    </div>
    </div>
  )
}

export default RecordVoice
