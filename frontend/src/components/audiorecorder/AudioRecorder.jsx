// AudioRecorder.js
import { useState, useRef, useEffect } from "react";
import "./audiorecorder.css";

function AudioRecorder({ isLoading, handleSave, cardText, onReset }) {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");
  const [audioFile, setAudioFile] = useState(null);

  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioChunksRef = useRef([]);
  const fileInputRef = useRef(null);

  // ===== Visualizer (bars) =====
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const freqArrayRef = useRef(null);
  const animationIdRef = useRef(null);

  const BARS = 48; // 32–64 looks best
  const barsRef = useRef([]);
  barsRef.current = [];
  const setBarRef = (el, i) => { if (el) barsRef.current[i] = el; };

  const drawBars = () => {
    const analyser = analyserRef.current;
    const data = freqArrayRef.current;
    if (!analyser || !data) return;

    const render = () => {
      analyser.getByteFrequencyData(data);

      // focus on lower freqs (voice)
      const usable = data.slice(0, Math.floor(data.length * 0.6));
      const bars = barsRef.current;
      if (!bars.length) {
        animationIdRef.current = requestAnimationFrame(render);
        return;
      }
      const step = Math.max(1, Math.floor(usable.length / bars.length));

      for (let i = 0; i < bars.length; i++) {
        const idx = i * step;
        let sum = 0, c = 0;
        for (let j = 0; j < step; j++) {
          const v = usable[idx + j];
          if (v !== undefined) { sum += v; c++; }
        }
        const avg = c ? sum / c : 0;
        const level = Math.pow(avg / 255, 0.9);  // eased 0..1
        const targetHeight = 6 + level * 66;     // px, container ~72

        const el = bars[i];
        if (el) {
          const prev = Number(el.dataset.h || 6);
          const eased = prev + (targetHeight - prev) * 0.35;
          el.style.transform = `scaleY(${Math.max(eased / 72, 0.08)})`;
          el.style.opacity = String(0.65 + Math.min(level, 0.6) * 0.35);
          el.dataset.h = String(eased);
        }
      }

      animationIdRef.current = requestAnimationFrame(render);
    };

    render();
  };

  const setupAnalyzer = (stream) => {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const audioCtx = new Ctx();
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = 0.8;

    const source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyser);

    const freq = new Uint8Array(analyser.frequencyBinCount);
    audioContextRef.current = audioCtx;
    analyserRef.current = analyser;
    sourceRef.current = source;
    freqArrayRef.current = freq;

    drawBars();
  };

  const teardownAnalyzer = () => {
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = null;
    }
    if (audioContextRef.current) {
      try { audioContextRef.current.close(); } catch { }
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    sourceRef.current = null;
    freqArrayRef.current = null;
  };
  // ===== /Visualizer =====

  useEffect(() => {
    return () => {
      teardownAnalyzer();
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
        mediaStreamRef.current = null;
      }
      if (audioURL) URL.revokeObjectURL(audioURL);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startRecording = async () => {
    try {
      if (audioURL) URL.revokeObjectURL(audioURL);
      setAudioURL("");
      setAudioFile(null);
      audioChunksRef.current = [];
      if (fileInputRef.current) fileInputRef.current.value = "";
      onReset?.();

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      setupAnalyzer(stream); // 🔊 start bars

      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = () => {
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((t) => t.stop());
          mediaStreamRef.current = null;
        }
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const file = new File([audioBlob], `audio_recording_${Date.now()}.wav`, {
          type: "audio/wav",
        });
        setAudioFile(file);
        setAudioURL(URL.createObjectURL(audioBlob));
        audioChunksRef.current = [];
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (e) {
      console.error("Microphone access error:", e);
      setRecording(false);
      teardownAnalyzer();
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
        mediaStreamRef.current = null;
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      setRecording(false);
      teardownAnalyzer();
      mediaRecorderRef.current.stop();
    }
  };

  const resetRecording = () => {
    teardownAnalyzer();
    if (recording && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    if (audioURL) URL.revokeObjectURL(audioURL);
    setAudioURL("");
    setAudioFile(null);
    audioChunksRef.current = [];
    if (fileInputRef.current) fileInputRef.current.value = "";
    onReset?.();
  };

  const saveRecording = () => {
    if (!audioFile) return;
    handleSave([audioFile], cardText);
  };

  const handleUploadClick = () => {
    if (!isLoading) fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (recording && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
    teardownAnalyzer();
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    if (audioURL) URL.revokeObjectURL(audioURL);

    setAudioFile(file);
    setAudioURL(URL.createObjectURL(file));
  };

  return (
    <div className="audio-recorder-container">
      <div className="audio-controls">
        {audioURL ? (
          <>
            <button onClick={resetRecording} disabled={isLoading}>Try Again</button>
            <button onClick={saveRecording} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </button>
          </>
        ) : recording ? (
          <button style={{ marginTop: 20 }} className="recording" onClick={stopRecording}>
            Stop Recording
          </button>
        ) : (
          <>
            <button style={{ marginTop: 20 }} onClick={startRecording} disabled={isLoading}>
              Start Recording
            </button>
            {/* <button onClick={handleUploadClick} disabled={isLoading}>Upload Voice</button> */}
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </>
        )}
      </div>

      {recording && (
        <div className="rec-bars-wrap">
          <div className="rec-status">
            <span className="rec-dot" /> Recording…
          </div>
          <div className="rec-bars" role="img" aria-label="Live audio visualizer">
            {Array.from({ length: BARS }).map((_, i) => (
              <div key={i} className="rec-bar" ref={(el) => setBarRef(el, i)} />
            ))}
          </div>
        </div>
      )}

      {audioURL && (
        <div className="audio-playback">
          <audio controls src={audioURL}></audio>
        </div>
      )}
    </div>
  );
}

export default AudioRecorder;
