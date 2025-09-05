import { useLocation } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import "./cta.css";
import { TextUpload, AudioRecorder } from "../../components/index";
import { fetchVoices } from "../../api/elevenlabs";
import { TextToSpeech, SpeechToText } from "../../api/textToSpeech";
import { Loader2 } from "lucide-react";

const CTA = ({
  voiceSelector,              // not used for gating anymore
  showContent,
  handleSelectedArtist,
  selectedArtist,
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
      setDroppedFile(file); // stage file only — no auto-transcribe
    }
  };
  const onFilePick = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setDroppedFile(file); // stage file only — no auto-transcribe
    }
    e.target.value = ""; // allow picking the same file again
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

  // NEW: clear any existing transcription when recorder starts
  const handleRecorderStart = () => {
    setTtsText("");     // this hides the "Transcribed Text" panel
    setSttError(null);
    setAudioSrc("");
    setDroppedFile(null);
  };

  return (
    <>
      {isLanding && (
        <div className="gpt3__cta">
          <div className="gpt3__cta-content">
            <p>Request Early Access to Get Started</p>
            <h3>Register Today & start exploring the endless possibilities.</h3>
          </div>
          <div className="gpt3__cta-btn">
            <button type="button">Get Started</button>
          </div>
        </div>
      )}

      {/* Show container for TTS and STT without voiceSelector gate */}
      {isUserDashboard && showContent && (
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
                          onStart={handleRecorderStart}  // <-- clears transcription on Start
                          onReset={() => {
                            setSttError(null);
                            setAudioSrc("");
                            setTtsText("");
                            setSttLoading(false);
                            setDroppedFile(null);
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
                              <div style={{ display: "flex", gap: 8 }}>
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
                                  }}
                                  style={{
                                    background: "red",
                                    color: "white",
                                    // border: "1px solid #e5e7eb",
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
                      <h3>Transcribed Text</h3>

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
      )}
    </>
  );
};

export default CTA;
