import { useLocation, useNavigate } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import "./cta.css";
import { TextUpload, AudioRecorder } from "../../components/index";
import { fetchVoices } from "../../api/elevenlabs";
import { TextToSpeech, SpeechToText } from "../../api/textToSpeech";
import { Loader2, Copy, Check, CircleChevronLeft, ChevronRight, Play, Pause, EllipsisVertical, RotateCcw, RotateCw, RedoDot, UndoDot } from "lucide-react";
import { Button } from "../layout/button";
import { profile, record, upload } from "../../images";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../layout/sheet";

const CTA = ({
  voiceSelector,
  showContent,
  handleSelectedArtist,
  selectedArtist,
  onBack,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isUserDashboard = location.pathname === "/user-dashboard";
  const isLanding = location.pathname === "/";

  const [voices, setVoices] = useState([]);
  const [voiceLoading, setVoiceLoading] = useState(true);

  const [ttsText, setTtsText] = useState(
    ""
  );
  const [audioSrc, setAudioSrc] = useState("");
  const [heroProgress, setHeroProgress] = useState(0);
  const [isHeroGenerating, setIsHeroGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState("");
  const [generatedVoiceId, setGeneratedVoiceId] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  const [sttLoading, setSttLoading] = useState(false);
  const [sttError, setSttError] = useState(null);

  const [copied, setCopied] = useState(false)

  const audioRefs = useRef({});
  const heroAudioRef = useRef(null);

  // Drag & drop + click-to-browse (STT right column)
  const [isDragging, setIsDragging] = useState(false);
  const [droppedFile, setDroppedFile] = useState(null);
  const fileInputRef = useRef(null);

  const onDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = () => setIsDragging(false);
  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      setDroppedFile(file);
    }
  };
  const onFilePick = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setDroppedFile(file);
    }
    e.target.value = "";
  };
  const openFilePicker = () => fileInputRef.current?.click();

  // Fetch voices as soon as we enter TTS
  useEffect(() => {
    if (showContent !== 2) return;

    let mounted = true;
    (async () => {
      try {
        setVoiceLoading(true);
        const data = await fetchVoices();
        if (!mounted) return;
        setVoices(data?.voices || data || []);
      } catch (e) {
        console.error(e);
        if (mounted) setVoices([]);
      } finally {
        if (mounted) setVoiceLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [showContent]);

  const handlePlay = (voice_id) => {
    Object.entries(audioRefs.current).forEach(([id, audio]) => {
      if (id !== voice_id && audio && !audio.paused) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
  };

  const handleTTS = async () => {
    if (!selectedArtist) return alert("Please select a voice first.");
    if (!ttsText.trim()) return alert("Please enter some text to speak.");

    try {
      const url = await TextToSpeech(ttsText, selectedArtist.voice_id);
      setAudioSrc(url);
      return url;
    } catch (err) {
      console.error("TTS failed:", err);
      alert("Failed to convert text to speech");
    }
  };

  const handleHeroGenerate = async () => {
    if (!selectedArtist || !ttsText.trim() || isHeroGenerating) return;
    
    const audio = heroAudioRef.current;
    const currentText = ttsText.trim();
    const currentVoiceId = selectedArtist.voice_id;
    
    // Check if audio already exists for current text and voice
    const audioExists = audioSrc && 
                        generatedText === currentText && 
                        generatedVoiceId === currentVoiceId;
    
    if (audioExists && audio) {
      // Audio already generated - just play/pause
      if (audio.paused) {
        await audio.play();
      } else {
        audio.pause();
      }
      return;
    }
    
    // Need to generate new audio
    setIsHeroGenerating(true);
    setHeroProgress(0);
    try {
      const url = await TextToSpeech(currentText, currentVoiceId);
      setAudioSrc(url);
      setGeneratedText(currentText);
      setGeneratedVoiceId(currentVoiceId);
      if (heroAudioRef.current) {
        heroAudioRef.current.src = url;
        await heroAudioRef.current.play();
      }
    } catch (err) {
      console.error("Hero TTS failed:", err);
      alert("Failed to convert text to speech");
    } finally {
      setIsHeroGenerating(false);
    }
  };

  useEffect(() => {
    const audio = heroAudioRef.current;
    if (!audio) return;
    const update = () => {
      if (!audio.duration) return;
      setHeroProgress((audio.currentTime / audio.duration) * 100);
    };
    const reset = () => {
      setHeroProgress(0);
      setIsPlaying(false);
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", update);
    audio.addEventListener("ended", reset);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("timeupdate", update);
      audio.removeEventListener("ended", reset);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, [audioSrc]);

  // Reset playing state when text or voice changes
  useEffect(() => {
    if (showContent === 2) {
      const currentText = ttsText.trim();
      const currentVoiceId = selectedArtist?.voice_id;
      
      // If text or voice changed, reset playing state
      if (currentText !== generatedText || currentVoiceId !== generatedVoiceId) {
        setIsPlaying(false);
        if (heroAudioRef.current) {
          heroAudioRef.current.pause();
          heroAudioRef.current.currentTime = 0;
        }
      }
    }
  }, [ttsText, selectedArtist?.voice_id, showContent, generatedText, generatedVoiceId]);

  const handleSTT = async (incoming) => {
    if (sttLoading) return; // guard
    setSttError(null);
    setSttLoading(true);
    try {
      let f = incoming;
      if (Array.isArray(incoming)) {
        f = incoming[0];
      } else if (incoming && typeof incoming === "object" && "length" in incoming && incoming.length > 0) {
        f = incoming[0];
      }

      const result = await SpeechToText(f);
      const text = result?.text ?? "";
      setTtsText(text);

      if (selectedArtist && text.trim()) {
        const url = await TextToSpeech(text, selectedArtist.voice_id);
        setAudioSrc(url);
      }
    } catch (err) {
      console.error("STT failed:", err);
      setSttError(err?.message || "Failed to transcribe speech");
    } finally {
      setSttLoading(false);
    }
  };

  const confirmTranscribe = () => {
    if (!droppedFile || sttLoading) return;
    handleSTT(droppedFile);
  };

  // Clear any existing transcription when recorder starts
  const handleRecorderStart = () => {
    setTtsText("");
    setSttError(null);
    setAudioSrc("");
    setDroppedFile(null);
    setCopied(false);
  };

  // ⬅️ Copy logic
  const copyText = async () => {
    try {
      const text = ttsText || "";
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (e) {
      console.error("Copy failed:", e);
    }
  };

  // Download audio handler
  const handleDownload = async () => {
    if (!audioSrc) {
      alert("No audio available to download. Please generate speech first.");
      return;
    }

    try {
      const response = await fetch(audioSrc);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `speech-${Date.now()}.mp3`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download audio");
    }
  };

  return (
    <>

      {/* Show container for TTS and STT without voiceSelector gate */}
      {isUserDashboard && showContent && (
        <div className="w-full min-h-screen flex justify-center items-center px-4 ">

          {showContent === 2 && (
            <div className="max-w-6xl 2xl:max-w-7xl w-full 
          mx-auto rounded-[32px] 
          h-auto lg:h-[500px] 
          flex flex-col">

              {/* HEADER */}
              <div className="h-auto lg:h-[20%] bg-white rounded-t-[32px] px-6 py-5 flex items-center gap-4">
                <div className="h-10 w-10 ">
                  <button
                    type="button"
                    onClick={() => {
                      navigate({ search: "" }, { replace: true });
                      onBack?.();
                    }}
                    aria-label="Go back"
                    className="h-full w-full  flex items-center justify-center text-gray-700 hover:text-gray-900"
                  >
                    <CircleChevronLeft className="h-8 w-8"  />
                  </button>
                </div>

                {/* Text Section */}
                <div className="flex flex-col">
                  <h3 className="text-black font-semibold sm:text-xl text-lg 3xl:text-2xl">
                    Text To Speech
                  </h3>
                  <p className="text-[#3C3C3C] sm:text-lg text-sm 3xl:text-xl">
                    From text to natural speech — effortlessly.
                  </p>
                </div>
              </div>

              {/* BODY */}
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
                    placeholder="Type in your text here ..."
                    className="
                w-full bg-transparent text-white 
                font-semibold 
                sm:text-xl text-lg 
                outline-none resize-none
              "
                    rows={5}
                    value={ttsText}
                    onChange={(e) => setTtsText(e.target.value)}
                  />

                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">

                    {/* SELECT VOICE BUTTON */}
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button className="max-w-48 py-1 w-full sm:w-auto" variant="alpha">
                          <img className="h-12 w-12" src={profile} alt={selectedArtist?.name || 'Select Voice'} />
                          <p>{selectedArtist?.name || 'Select Voice'}</p>
                          <ChevronRight />
                        </Button>
                      </SheetTrigger>

                      {/* SHEET CONTENT */}
                      <SheetContent
                        side="right"
                        className="
                    bg-[#000000bf] 
                    backdrop-blur-xl 
                    border-l border-white/10 
                    4xl:max-w-lg
                    rounded-[32px]
                    rounded-b-none
                    p-0 
                    text-white
                  "
                      >
                        {/* HEADER */}
                        <div className="p-5 pb-3">
                          <h2 className="text-lg font-semibold">Pick a Voice</h2>
                          <div className="mt-3">
                            <input
                              type="text"
                              placeholder="Search Voices"
                              className="
                          w-full h-11 rounded-[75px] bg-[#DEDEDE] 
                          placeholder-[#3C3C3C] px-4 text-base 
                          outline-none focus:ring-2 focus:ring-white/20 text-black
                        "
                            />
                          </div>
                        </div>

                        {/* VOICE LIST */}
                   <div className="px-3 space-y-1 overflow-y-auto max-h-[85vh] pb-4 custom-scrollbar">

                          {voices?.length ? (
                            voices.map((voice) => (
                              <div
                                key={voice.voice_id}
                                className="
                            flex items-center justify-between 
                            px-3 py-5 cursor-pointer
                            transition border-b-2 border-white
                          "
                                onClick={() => handleSelectedArtist(voice)}
                              >
                                <div className="flex items-center gap-3">
                                  <img src={profile} className="w-11 h-11 rounded-full" alt={voice.name} />
                                  <div>
                                    <p className="font-medium">{voice.name}</p>
                                    <p className="text-xs text-white/60">
                                      {voice.description && voice.description.length > 80
                                        ? voice.description.slice(0, 80) + "..."
                                        : voice.description || "No description available"}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3">
                                  {/* PLAY BUTTON */}
                                  <button
                                    className="p-2 hover:bg-white/10 rounded-full"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const audio = audioRefs.current[voice.voice_id];
                                      if (!audio) return;
                                      if (audio.paused) {
                                        handlePlay(voice.voice_id);
                                        audio.play();
                                      } else {
                                        audio.pause();
                                        audio.currentTime = 0;
                                      }
                                    }}
                                  >
                                    <Play size={18} />
                                  </button>

                                  <EllipsisVertical />
                                </div>

                                <audio
                                  ref={(el) => (audioRefs.current[voice.voice_id] = el)}
                                  src={voice.preview_url}
                                  className="hidden"
                                  onPlay={() => handlePlay(voice.voice_id)}
                                />
                              </div>
                            ))
                          ) : (
                            <p className="px-3 py-4 text-sm text-white/60">No voices found.</p>
                          )}
                        </div>
                      </SheetContent>
                    </Sheet>

                    {/* PROGRESS + PLAY BUTTONS */}
                    {selectedArtist && (
                      <div className="flex flex-col items-center gap-2 w-full sm:w-auto">
                        <div className="w-[200px] h-[6px] bg-white/20 rounded-full overflow-hidden">
                          <div
                            className={`
                        h-full bg-white rounded-full transition-all duration-300 
                        ${isHeroGenerating ? "animate-pulse" : ""}
                      `}
                            style={{
                              width: `${Math.min(heroProgress || (isHeroGenerating ? 30 : 0), 100)}%`
                            }}
                          />
                        </div>

                        <div className="flex items-center gap-4 mt-2">
                          <button className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow">
                            <UndoDot className="w-5 h-5" />
                          </button>

                          <button
                            className={`
                        w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow 
                        transition 
                        ${!selectedArtist || !ttsText.trim()
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:bg-white/90"}
                      `}
                            onClick={handleHeroGenerate}
                            disabled={!selectedArtist || !ttsText.trim() || isHeroGenerating}
                          >
                            {isHeroGenerating ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : isPlaying ? (
                              <Pause className="w-5 h-5" />
                            ) : (
                              <Play className="w-5 h-5" />
                            )}
                          </button>

                          <button className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow">
                            <RedoDot className="w-5 h-5" />
                          </button>
                        </div>

                        <audio ref={heroAudioRef} className="hidden" />
                      </div>
                    )}

                    {/* DOWNLOAD BUTTON */}
                    <Button 
                      className={`max-w-48 w-full sm:w-auto magic-btn ${!audioSrc ? "opacity-50 cursor-not-allowed" : ""}`}
                      variant="alpha"
                      onClick={handleDownload}
                      disabled={!audioSrc}
                    >
                      Download Speech
                    </Button>

                  </div>
                </div>
              </div>

            </div>
          )}

          {showContent === 3 &&
            <div className="flex w-full max-w-5xl gap-6 ">
              <div class="h-80 w-full rounded-[32px] border-2 border-white/20 
    bg-[linear-gradient(180deg,rgba(0,0,0,0.6)_0%,rgba(12,66,48,0.34)_100%)]
    flex flex-col items-center justify-center text-center gap-4 p-6  cursor-pointer"
    onClick={()=>navigate('/speech-to-text')}
    >
                <div class="h-40 flex items-center justify-center">
                  <img
                    src={record}
                    alt="Record Voice"
                    class="h-full w-auto object-contain"
                  />
                </div>
                <h3 class="text-white sm:text-xl text-lg 2xl:text-2xl font-bold">
                  Record Voice
                </h3>
                <p class="text-[#DEDEDE] sm:text-lg text-base 2xl:text-xl font-medium">
                  Good afternoon, everyone.
                </p>
              </div>
              <div class="h-80 w-full rounded-[32px] 
    bg-[linear-gradient(180deg,rgba(0,0,0,0.6)_0%,rgba(12,66,48,0.34)_100%)]
    flex flex-col items-center justify-center text-center gap-4 p-6 border-2 border-white/20 cursor-pointer">
                <div class="h-40 flex items-center justify-center ">
                  <img
                    src={upload}
                    alt="Record Voice"
                    class="h-full w-auto object-contain"
                  />
                </div>
                <h3 class="text-white sm:text-xl text-lg 2xl:text-2xl font-bold">
                  Upload Audio
                </h3>
                <p class="text-[#DEDEDE] sm:text-lg text-base 2xl:text-xl font-medium">
                  Good afternoon, everyone.
                </p>
              </div>

            </div>}
        </div>
      )}

    </>
  );
};

export default CTA;
