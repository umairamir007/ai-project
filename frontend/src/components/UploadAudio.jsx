import React, { useState } from "react";
import Navbar from "./navbar/Navbar";
import { CircleChevronLeft, CloudUpload } from "lucide-react";
import { Button } from "./layout/button";
import { useVoiceRecorder } from "../hooks/useVoiceRecorder";

const UploadAudio = () => {
  const [textCardShow, setTextCardShow] = useState(true);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [copied, setCopied] = useState(false);

  const { transcribedText, isConverting, error, convertFileToText, reset } =
    useVoiceRecorder();

  const handleFile = async (file) => {
    if (!file) return;
    setSelectedFileName(file.name);
    try {
      await convertFileToText(file);
      setTextCardShow(false);
    } catch (err) {
      console.error("Upload convert failed:", err);
    }
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    handleFile(file);
    // allow uploading same file twice
    e.target.value = "";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
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
      <Navbar />
      <div className="flex items-center justify-center ">
        {textCardShow ? (
          <div className="w-full h-screen  flex flex-col justify-center">
            <div className="min-h-screen bg-black flex items-center justify-center p-4">
              <label
                htmlFor="audio-upload"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`w-full max-w-4xl rounded-[32px] bg-[linear-gradient(180deg,rgba(0,0,0,0.6)_0%,rgba(12,66,48,0.34)_100%)] flex flex-col items-center justify-center gap-6 p-8 cursor-pointer border border-white/30 transition ring-2 ${
                  dragActive ? "ring-[#0c4230]" : "ring-transparent"
                }`}
              >
                <input
                  id="audio-upload"
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={handleInputChange}
                  disabled={isConverting}
                />
                <div className="h-16 w-16 bg-[#0c4230] rounded-full flex items-center justify-center shadow-lg">
                  <CloudUpload
                    className="text-white"
                    size={32}
                    strokeWidth={2}
                  />
                </div>

                <div className="text-center space-y-2">
                  <p className="text-white sm:text-2xl text-xl 4xl:text-3xl font-bold">
                    {isConverting
                      ? "Converting..."
                      : "Click to upload, or drag and drop"}
                  </p>
                  <p className="text-gray-300 sm:text-lg text-base 4xl:text-xl font-medium pt-4">
                    Audio files up to 50MB each
                  </p>
                  {selectedFileName && (
                    <p className="text-white text-sm sm:text-base opacity-90">
                      {selectedFileName}
                    </p>
                  )}
                  {error && (
                    <p className="text-red-400 text-sm sm:text-base">{error}</p>
                  )}
                </div>
              </label>
            </div>
          </div>
        ) : (
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

                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
                    {transcribedText ? (
                      <Button
                        className="max-w-48 w-full sm:w-auto"
                        variant="alpha"
                        onClick={handleCopyText}
                        disabled={isConverting}
                      >
                        {copied ? "Copied!" : "Copy Text"}
                      </Button>
                    ) : (
                      <Button
                        className="max-w-48 w-full sm:w-auto "
                        variant="alpha"
                        onClick={() => setTextCardShow(true)}
                        disabled={isConverting}
                      >
                        {isConverting ? "Converting..." : "Upload another file"}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadAudio;
