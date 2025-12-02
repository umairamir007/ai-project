import { useLocation } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import "./cta.css";
import { TextUpload, AudioRecorder } from "../../components/index";
import { fetchVoices } from "../../api/elevenlabs";
import { TextToSpeech, SpeechToText } from "../../api/textToSpeech";
import { Loader2, Copy, Check, CircleChevronLeft, ChevronRight, Play, EllipsisVertical, RotateCcw, RotateCw, RedoDot, UndoDot } from "lucide-react";
import { Button } from "../layout/button";
import { profile } from "../../images";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../layout/sheet";

const CTA = ({
  voiceSelector,
  showContent,
  handleSelectedArtist,
  selectedArtist,
  onBack,
}) => {
  const location = useLocation();
  const isUserDashboard = location.pathname === "/user-dashboard";
  const isLanding = location.pathname === "/";

  const [voices, setVoices] = useState([]);
  const [voiceLoading, setVoiceLoading] = useState(true);

  const [ttsText, setTtsText] = useState("");
  const [audioSrc, setAudioSrc] = useState("");

  const [sttLoading, setSttLoading] = useState(false);
  const [sttError, setSttError] = useState(null);

  const [copied, setCopied] = useState(false)

  const audioRefs = useRef({});

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
    } catch (err) {
      console.error("TTS failed:", err);
      alert("Failed to convert text to speech");
    }
  };

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

  return (
    <>
      {isLanding && (
        <div className="gpt3__cta">
          <div className="gpt3__cta-content">
            <p>Request Early Access to Get Started</p>
            <h3>Register Today & start exploring the endless possibilities.</h3>
          </div>
          {/* <div className="gpt3__cta-btn">
              <button type="button">Get Started</button>
            </div> */}
        </div>
      )}

      {/* Show container for TTS and STT without voiceSelector gate */}
      {isUserDashboard && showContent && (
        <div>
          <div className="h-[500px]  max-w-6xl mx-auto rounded-[32px]">
            <div className="h-[20%] bg-white rounded-t-[32px] px-6 py-5 flex items-center gap-4">

              {/* Icon */}
              <div className="h-6 w-6">
                <button
                  type="button"
                  onClick={() => onBack?.()}
                  aria-label="Go back"
                  className="h-full w-full flex items-center justify-center text-gray-700 hover:text-gray-900"
                >
                  <CircleChevronLeft size={22} />
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

            <div
              className="h-[80%]
      bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(12,66,48,0.34)_100%)]
      border border-white/10
      rounded-b-[32px] p-8"
            >
              <div className="flex flex-col justify-between h-full">
                <textarea
                  placeholder="Type in your text here ..."
                  className="w-full bg-transparent text-white font-semibold sm:text-xl text-lg text-3xl:text-2xl outline-none resize-none"
                  rows={5}
                />
                <div className="flex justify-between items-center">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button className="max-w-48 py-1" variant="alpha">
                        <img className="h-12 w-12" src={profile} alt={selectedArtist?.name || "Select Voice"} />
                        <p>{selectedArtist?.name || "Select Voice"}</p>
                        <ChevronRight />
                      </Button>
                    </SheetTrigger>

                    <SheetContent
                      side="right"
                      className="
        bg-[#000000bf] 
        backdrop-blur-xl 
        border-l border-white/10 
        w-[360px] 
        rounded-[32px]
        rounded-b-none
        p-0 
        text-white">
                      {/* HEADER */}
                      <div className="p-5 pb-3">
                        <h2 className="text-lg font-semibold">Pick a Voice</h2>
                        <div className="mt-3">
                          <input
                            type="text"
                            placeholder="Search Voices"
                            className="w-full h-11 rounded-[75px] bg-[#DEDEDE] placeholder-[#3C3C3C] px-4
              text-base outline-none focus:ring-2 focus:ring-white/20 text-black"/>
                        </div>
                      </div>
                      {/* LIST */}
                      <div className="px-3 space-y-1 overflow-y-auto max-h-[85vh] pb-4">
                        {voices?.length ? (
                          voices.map((voice) => (
                            <div
                              key={voice.voice_id}
                              className={`
              flex items-center justify-between 
              px-3 py-5 cursor-pointer
              transition border-b-2 border-white`}
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
                  {selectedArtist && (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-[200px] h-[6px] bg-white/20 rounded-full overflow-hidden">
                        <div className="w-[40%] h-full bg-white rounded-full" />
                      </div>
                      <div className="flex items-center gap-4 mt-2">
                        <button className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow">
                          <UndoDot className="w-5 h-5" />
                        </button>

                        <button className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow">
                          <Play className="w-5 h-5" />
                        </button>

                        <button className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow">
                          <RedoDot className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}

                  <Button className='max-w-48' variant='alpha'>
                    Download Speech
                  </Button>
                </div>
              </div>
            </div>

          </div>
          <div className="gpt3__cta-user section__margin">
            {/* TTS: show voice grid immediately if no voice selected */}
            {showContent === 2 && !selectedArtist ? (
              <>
                {voiceLoading ? (
                  <Loader2 size={40} className="animate-loader loading-spinner" />
                ) : (
                  <div className="voice-grid">
                    {voices?.length ? (
                      voices.map((voice) => (
                        <div
                          key={voice.voice_id}
                          className="voice-card"
                          onClick={() => handleSelectedArtist(voice)}
                        >
                          <h4>{voice.name}</h4>
                          <p className="description">
                            {voice.description && voice.description.length > 200
                              ? voice.description.slice(0, 200) + "..."
                              : voice.description}
                          </p>
                          <audio
                            ref={(el) => (audioRefs.current[voice.voice_id] = el)}
                            controls
                            src={voice.preview_url}
                            onPlay={() => handlePlay(voice.voice_id)}
                          />
                        </div>
                      ))
                    ) : (
                      <p>No voices found.</p>
                    )}
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Content heading row */}
                <div
                  className="gpt3__cta-content-user"
                  style={{ display: "flex", alignItems: "center", gap: 12 }}
                >
                  <h2 style={{ margin: 0 }}>
                    {showContent === 2
                      ? `Upload Your Text for a Stunning Voice Over${selectedArtist?.name ? ` with ${selectedArtist.name}` : ""}`
                      : `Upload or Record Audio to Transcribe`}
                  </h2>
                  {showContent === 2 && selectedArtist && (
                    <button style={{ marginLeft: "20px" }} onClick={() => handleSelectedArtist(null)}>
                      Choose Again
                    </button>
                  )}
                </div>

                {/* TTS flow */}
                {showContent === 2 && selectedArtist && (
                  <div>
                    <TextUpload
                      selectedArtist={selectedArtist}
                      onGenerate={(text) => setTtsText(text)}
                    />
                    {ttsText && (
                      <div style={{ marginTop: "20px" }}>
                        <textarea
                          value={ttsText}
                          onChange={(e) => setTtsText(e.target.value)}
                          rows={5}
                          style={{ width: "100%" }}
                        />
                        <button onClick={handleTTS} disabled={!ttsText.trim()}>
                          Speak
                        </button>
                        {audioSrc && <audio controls src={audioSrc}></audio>}
                      </div>
                    )}
                  </div>
                )}

                {/* STT flow (speech section) */}
                {showContent === 3 && (
                  <>
                    <div className="stt-grid">
                      {/* Left: Record Voice */}
                      <div className="stt-cell">
                        <div className="stt-card">
                          <h3 style={{ marginTop: 0 }}>Record Voice</h3>
                          <AudioRecorder
                            isLoading={sttLoading}
                            handleSave={handleSTT}
                            cardText="Speech To Text"
                            onStart={handleRecorderStart}
                            onReset={() => {
                              setSttError(null);
                              setAudioSrc("");
                              setTtsText("");
                              setSttLoading(false);
                              setDroppedFile(null);
                              setCopied(false);
                            }}
                          />
                        </div>
                      </div>

                      {/* Right: Drag & Drop (click opens file picker) */}
                      <div
                        className="stt-cell"
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop}
                      >
                        <div className="stt-card">
                          <h3 style={{ marginTop: 0, marginBottom: 10 }}>Upload Audio</h3>

                          {/* Clickable dropzone */}
                          <div
                            role="button"
                            tabIndex={0}
                            onClick={openFilePicker}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") openFilePicker();
                            }}
                            style={{
                              border: isDragging ? "2px dashed rgba(0,0,0,0.5)" : "2px dashed rgba(0,0,0,0.25)",
                              borderRadius: 12,
                              padding: 16,
                              textAlign: "center",
                              transition: "border-color 0.2s ease",
                              cursor: "pointer",
                              outline: "none",
                            }}
                            aria-label="Drop an audio file here or click to choose a file"
                          >
                            <div style={{ fontSize: 22, marginBottom: 8 }}>📥</div>
                            <div style={{ fontWeight: 600 }}>Drop file to select</div>
                            <div style={{ fontSize: 12, opacity: 0.75 }}>MP3, WAV, M4A, or WEBM</div>
                          </div>

                          {/* Hidden file input (opened when the dropzone is clicked) */}
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="audio/*"
                            onChange={onFilePick}
                            style={{ display: "none" }}
                          />

                          {droppedFile && (
                            <div
                              style={{
                                marginTop: 12,
                                padding: "10px 12px",
                                borderRadius: 10,
                                background: "#fff",
                                border: "1px solid #e5e7eb",
                                color: "#0f172a",
                              }}
                            >
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                                <div>
                                  <strong>{droppedFile.name}</strong>
                                  <span> • {(droppedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                                </div>
                                <div style={{ display: "flex", margin: '2px auto', gap: 8 }}>
                                  <button
                                    onClick={confirmTranscribe}
                                    disabled={sttLoading}
                                    style={{
                                      background: "#5570FF",
                                      color: "#fff",
                                      borderRadius: 8,
                                      padding: "6px 12px",
                                      border: "1px solid rgba(0,0,0,0.15)",
                                      cursor: sttLoading ? "not-allowed" : "pointer",
                                    }}
                                    title="Confirm and transcribe"
                                  >
                                    {sttLoading ? "Transcribing…" : "Transcribe"}
                                  </button>
                                  <button
                                    onClick={() => {
                                      setDroppedFile(null);
                                      setTtsText("");
                                      setSttError(null);
                                      setCopied(false);
                                    }}
                                    style={{
                                      background: "red",
                                      color: "white",
                                      borderRadius: 8,
                                      padding: "6px 12px",
                                      cursor: "pointer",
                                    }}
                                    title="Remove file"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Transcribed text + optional TTS */}
                    {(sttLoading || ttsText) && (
                      <div className="input-area" style={{ marginTop: "20px" }}>

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                          <h3 style={{ margin: 0 }}>Transcribed Text</h3>

                          {!sttLoading && !!ttsText?.trim() && (
                            <button
                              type="button"
                              onClick={copyText}
                              aria-label={copied ? "Copied" : "Copy transcribed text"}
                              title={copied ? "Copied" : "Copy"}
                              style={{
                                all: "unset",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 6,
                                padding: "6px 10px",
                                borderRadius: 8,
                                cursor: "pointer",
                                background: "rgba(255,255,255,0.6)",
                                border: "1px dashed rgba(0,0,0,0.12)",
                                color: "#111827",
                                fontWeight: 600,
                              }}
                            >
                              {copied ? <Check size={16} /> : <Copy size={16} />}
                              <span>{copied ? "Copied" : "Copy"}</span>
                            </button>
                          )}
                        </div>

                        {sttLoading ? (
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <Loader2 size={24} className="animate-loader loading-spinner" />
                            <span>Transcribing…</span>
                          </div>
                        ) : (
                          <>
                            {sttError && (
                              <p className="stt-error" style={{ color: "#b00020" }}>{sttError}</p>
                            )}
                            <textarea
                              value={ttsText}
                              onChange={(e) => setTtsText(e.target.value)}
                              placeholder="Type in your text here..."
                            />
                            {selectedArtist ? (
                              <>
                                <button onClick={handleTTS} disabled={!ttsText.trim()}>
                                  Convert to Speech
                                </button>
                                {audioSrc && <audio controls src={audioSrc}></audio>}
                              </>
                            ) : null}
                          </>
                        )}
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div >

      )}
    </>
  );
};

export default CTA;
