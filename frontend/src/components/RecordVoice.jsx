import React, { useState, useEffect } from "react";
import { CircleChevronLeft } from "lucide-react";
import { Button } from "./layout/button";
import Navbar from "./navbar/Navbar";
import { useVoiceRecorder } from "../hooks/useVoiceRecorder";

const RecordVoice = () => {
  const [textCardShow, setTextCardShow] = useState(false);
  
  const {
    isRecording,
    isConverting,
    transcribedText,
    error,
    audioBlob,
    startRecording,
    stopRecording,
    convertToText,
    reset,
  } = useVoiceRecorder();

  // Auto-convert to text when recording stops and we have audio
  useEffect(() => {
    if (!isRecording && audioBlob && transcribedText === "" && !isConverting) {
      // Small delay to ensure audio blob is fully ready
      const timer = setTimeout(async () => {
        try {
          await convertToText();
          setTextCardShow(false); // Show text view after conversion
        } catch (err) {
          console.error("Auto-convert failed:", err);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isRecording, audioBlob, transcribedText, isConverting, convertToText]);

  const handleStartRecording = async () => {
    setTextCardShow(true);
    reset();
    await startRecording();
  };

  const handleStopRecording = () => {
    stopRecording();
  };

  const handleCopyText = async () => {
    if (transcribedText) {
      try {
        await navigator.clipboard.writeText(transcribedText);
        // You could add a toast notification here
      } catch (err) {
        console.error("Failed to copy text:", err);
      }
    }
  };

  const handleBack = () => {
    reset();
    setTextCardShow(false);
  };

  // Delay pattern (mirrored left → center → right)
  const delays = [
    0.5,
    0.4,
    0.3,
    0.2,
    0.1,
    0,
    0, // left
    0,
    0, // center
    0,
    0.1,
    0.2,
    0.3,
    0.4,
    0.5, // right
  ];

  return (
    <div className="flex h-screen items-center justify-center">
      <Navbar />

      {textCardShow ? (
        <div className="bg-[#FAFAFA] rounded-[32px] p-8">
          <div className="flex items-center pb-8">
            <button
              onClick={handleBack}
              className="cursor-pointer hover:opacity-70 transition-opacity"
              aria-label="Go back"
            >
              <CircleChevronLeft size={30} />
            </button>
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

                {/* WAVEFORM (optimized) - only animate when recording */}
                {isRecording ? (
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
                ) : (
                  <div className="text-black text-sm font-medium">
                    {isConverting ? "Converting..." : "Ready to record"}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8">
            {isRecording ? (
              <Button
                variant="alpha"
                className="shadow-none bg-red-600 text-white hover:bg-red-700"
                onClick={handleStopRecording}
              >
                Stop Recording
              </Button>
            ) : (
              <Button
                variant="alpha"
                className="shadow-none bg-black text-white"
                onClick={handleStartRecording}
                disabled={isConverting}
              >
                {isConverting ? "Converting..." : "Start Recording"}
              </Button>
            )}
          </div>
          {error && (
            <div className="mt-4 text-red-600 text-sm text-center">
              {error}
            </div>
          )}
        </div>
      ) : (
        <div
          className="max-w-6xl 2xl:max-w-7xl w-full 
          mx-auto rounded-[32px] 
          h-auto lg:h-[500px] 
          flex flex-col"
        >
          <div className="h-auto lg:h-[20%] bg-white rounded-t-[32px] px-6 py-5 flex items-center gap-4">
            <div className="h-6 w-6">
              <button
                type="button"
                onClick={handleBack}
                aria-label="Go back"
                className="h-full w-full flex items-center justify-center text-gray-700 hover:text-gray-900"
              >
                <CircleChevronLeft size={22} />
              </button>
            </div>

            {/* Text Section */}
            <div className="flex flex-col">
              <h3 className="text-black font-semibold sm:text-xl text-lg 3xl:text-2xl">
                Speech to Text
              </h3>
              <p className="text-[#3C3C3C] sm:text-lg text-sm 3xl:text-xl">
              From text to natural speech — effortlessly.
              </p>
            </div>
          </div>
              <div
                className="
            flex-1
            bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(12,66,48,0.34)_100%)]
            border border-white/10
            rounded-b-[32px] 
            p-5 sm:p-8">
                <div className="flex flex-col justify-between h-full">
                  <textarea
                    value={transcribedText}
                    readOnly
                    placeholder={isConverting ? "Converting speech to text..." : "Your transcribed text will appear here..."}
                    className="
                w-full bg-transparent text-white 
                font-semibold 
                sm:text-xl text-lg 
                outline-none resize-none
              "
                    rows={5}
                    disabled={isConverting}
                  />

                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
                    {transcribedText ? (
                      /* COPY BUTTON - shown when text exists */
                      <Button 
                        className={`max-w-48 w-full sm:w-auto magic-btn `}
                        variant="alpha"
                        onClick={handleCopyText}
                        disabled={isConverting}
                      >
                        Copy text
                      </Button>
                    ) : (
                      /* START RECORDING BUTTON - shown when no text */
                      <Button 
                        className={`max-w-48 w-full sm:w-auto magic-btn `}
                        variant="alpha"
                        onClick={handleStartRecording}
                        disabled={isRecording || isConverting}
                      >
                        {isRecording ? "Recording..." : "Start Recording"}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
        </div>
      )}
    </div>
  );
};

export default RecordVoice;
