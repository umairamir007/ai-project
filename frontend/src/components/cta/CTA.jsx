import { useLocation } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import "./cta.css";
import { TextUpload, AudioRecorder, FileUpload } from "../../components/index";
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

    return () => {
      mounted = false;
    };
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
              {/* Content heading row (optional “Choose Again” only for TTS with a selected voice) */}
              <div className="gpt3__cta-content-user" style={{ display: "flex", alignItems: "center", gap: 12 }}>
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

              {/* STT flow (unchanged) */}
              {showContent === 3 && (
                <div>
                  <AudioRecorder
                    isLoading={sttLoading}
                    handleSave={handleSTT}
                    cardText="Speech To Text"
                    onReset={() => {
                      setSttError(null);
                      setAudioSrc("");
                      setTtsText("");
                      setSttLoading(false);
                    }}
                  />

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
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default CTA;
