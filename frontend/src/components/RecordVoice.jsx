import React, { useState, useEffect } from "react";
import { CircleChevronLeft } from "lucide-react";
import { Button } from "./layout/button";
import Navbar from "./navbar/Navbar";
import { useVoiceRecorder } from "../hooks/useVoiceRecorder";

const RecordVoice = () => {
  const [textCardShow, setTextCardShow] = useState(true);
  const [audioLevels, setAudioLevels] = useState(Array(15).fill(0));
  const animationFrameRef = React.useRef(null);
  const analyserRef = React.useRef(null);
  const [copied, setCopied] = useState(false);

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

  const [openModal, setOpenModal] = useState(false);

  // Audio visualization effect
  useEffect(() => {
    const setupAudioAnalyser = async () => {
      if (isRecording) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });
          const audioContext = new (window.AudioContext ||
            window.webkitAudioContext)();
          const source = audioContext.createMediaStreamSource(stream);
          const analyser = audioContext.createAnalyser();

          analyser.fftSize = 64;
          source.connect(analyser);
          analyserRef.current = analyser;

          const bufferLength = analyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);

          const updateLevels = () => {
            if (!isRecording) {
              setAudioLevels(Array(15).fill(0));
              return;
            }

            analyser.getByteFrequencyData(dataArray);

            // Map frequency data to 15 bars (mirror pattern from center)
            const newLevels = Array(15)
              .fill(0)
              .map((_, i) => {
                let index;
                if (i < 7) {
                  // Left side (0-6)
                  index = 6 - i;
                } else if (i === 7) {
                  // Center
                  index = 0;
                } else {
                  // Right side (8-14)
                  index = i - 7;
                }

                const dataIndex = Math.floor((index / 7) * (bufferLength / 2));
                const value = dataArray[dataIndex] || 0;
                return Math.min(value / 255, 1); // Normalize to 0-1
              });

            setAudioLevels(newLevels);
            animationFrameRef.current = requestAnimationFrame(updateLevels);
          };

          updateLevels();

          return () => {
            if (animationFrameRef.current) {
              cancelAnimationFrame(animationFrameRef.current);
            }
            stream.getTracks().forEach((track) => track.stop());
            audioContext.close();
          };
        } catch (err) {
          console.error("Audio analyser setup failed:", err);
        }
      } else {
        setAudioLevels(Array(15).fill(0));
      }
    };

    setupAudioAnalyser();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRecording]);

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
        setCopied(true);

        setTimeout(() => {
          setCopied(false);
        }, 1500);
      } catch (err) {
        console.error("Failed to copy text:", err);
      }
    }
  };

  const handleBack = () => {
    if (textCardShow) {
      // Already on recording view: go back one page in browser history
      window.history.back();
      return;
    }

    // From text view: reset and return to recording view
    reset();
    setTextCardShow(true);
  };

  return (
    <div className="h-screen w-full bg-theme">
      {/* NAVBAR OUTSIDE FLEX CENTER */}
      <Navbar />

      {/* MAIN CONTENT */}
      <div className="flex items-center justify-center ">
        {textCardShow ? (
          /* RECORDING UI */
          <div className="flex justify-center items-center  h-screen ">
            <div className="bg-[#FAFAFA] rounded-[32px] p-4 4xl:p-8 mt-10">
              <div className="flex items-center pb-4 4xl:pb-8">
                <button
                  onClick={handleBack}
                  className="cursor-pointer hover:opacity-70 transition-opacity"
                  aria-label="Go back"
                >
                  <CircleChevronLeft className="h-6 w-6 4xl:h-8 4xl:w-8" />
                </button>
              </div>

              {/* Outer ring */}
              <div className="4xl:w-[330px] w-[270px] h-[270px] 4xl:h-[330px] rounded-full bg-[#DEDEDE] relative shadow-[0px_0px_36.4px_0px_#FFFFFF33]">
                {/* Middle ring */}
                <div className="4xl:w-[300px] 4xl:h-[300px] w-[250px] h-[250px] rounded-full bg-[#FAFAFA] absolute inset-0 m-auto">
                  {/* Inner ring */}
                  <div className="bg-[#FAFAFA] 4xl:h-[250px] 4xl:w-[250px] h-[200px] w-[200px] rounded-full absolute inset-0 m-auto shadow-[0px_0px_7.4px_3px_#00000040] flex items-center justify-center">
                    {isRecording ? (
                      <div className="flex gap-1 items-center justify-center h-[60px]">
                        {audioLevels.map((level, i) => (
                          <div
                            key={i}
                            className="w-[4px] bg-black rounded-full transition-all duration-75"
                            style={{
                              height: `${20 + level * 40}px`,
                            }}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-black sm:text-sm 4xl:text-lg text-base font-bold">
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
                    className="shadow-none bg-[#0C4230] text-white hover:bg-[#0C4230]/90 sm:h-13 h-11 4xl:h-14 text-base sm:text-lg"
                    onClick={handleStopRecording}
                  >
                    Stop Recording
                  </Button>
                ) : (
                  <Button
                    variant="alpha"
                    className="shadow-none bg-black text-white sm:h-13 h-11 4xl:h-14 text-base sm:text-lg"
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
          </div>
        ) : (
          /* SPEECH-TO-TEXT UI */
          <div className="w-full h-screen  flex flex-col justify-center">
            <div
              className="
                max-w-6xl 2xl:max-w-7xl w-full mx-auto 
                rounded-[32px] 
                flex flex-col h-[500px] mt-16 4xl:mt-0"
            >
              <div className="h-auto  bg-white rounded-t-[32px] px-6 py-5 flex items-center gap-4">
                <div className="h-8 w-8">
                  <button
                    type="button"
                    onClick={handleBack}
                    aria-label="Go back"
                    className="h-full w-full flex items-center justify-center text-gray-700 hover:text-gray-900"
                  >
                    <CircleChevronLeft className="h-8 w-8" />
                  </button>
                </div>

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
                  p-5 sm:p-8
                "
              >
                <div className="flex flex-col justify-between h-full">
                  <textarea
                    value={transcribedText}
                    readOnly
                    placeholder={
                      isConverting
                        ? "Converting speech to text..."
                        : "Your transcribed text will appear here..."
                    }
                    className="
                      w-full bg-transparent text-white 
                      font-semibold 
                      sm:text-xl text-lg 
                      outline-none resize-none
                    "
                    rows={5}
                    disabled={isConverting}
                  />

                  <div className="flex flex-col sm:flex-row sm:justify-end justify-between items-center gap-4 mt-6">
                    {transcribedText ? (
                      <Button
                        variant="alpha"
                        className="max-w-48 w-full sm:w-auto"
                        onClick={() => setOpenModal(true)}
                      >
                        Save Project
                      </Button>
                    ) : (
                      <Button
                        className="max-w-48 w-full sm:w-auto"
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
          </div>
        )}
      </div>
      {openModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-[90%] max-w-md rounded-3xl shadow-none p-6  text-center space-y-6">
            {/* Title */}
            <h2 className="text-2xl font-semibold text-black">
              Do you want to save this project?
            </h2>

            {/* Input */}
            <input
              type="text"
              placeholder="Project Name"
              className="
          w-full px-5 py-3 
          border border-[#3C3C3C] 
          rounded-full 
          text-gray-700 placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-black/20
        "
            />

            {/* Buttons */}
            <div className="flex items-center justify-center gap-4 ">
              {/* Don't Save Button */}
              <Button
                onClick={() => setOpenModal(false)}
                variant="alpha"
                className="
            px-6 py-3 
            rounded-full 
            bg-[#0C3B28] 
            text-white font-medium
            text-sm sm:text-base
            shadow-none">
                Dont Save it
              </Button>

              {/* Save Button */}
              <Button
                onClick={() => {
                  console.log("Saving project...");
                  setOpenModal(false);
                }}
                variant="alpha"
                className="
            px-6 py-3 
            rounded-full 
            bg-[#4A4A4A] 
            text-white font-medium
            text-sm sm:text-base shadow-none">
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecordVoice;
