// AudioRecorder.js
import { useState, useRef } from "react";
import "./audiorecorder.css";

function AudioRecorder({ isLoading, handleSave, cardText, onReset }) {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");
  const [audioFile, setAudioFile] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const fileInputRef = useRef(null);

  const startRecording = async () => {
    try {
      if (audioURL) URL.revokeObjectURL(audioURL);
      setAudioURL("");
      setAudioFile(null);
      audioChunksRef.current = [];
      if (fileInputRef.current) fileInputRef.current.value = ""; // reset input
      onReset?.();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        // Stop mic tracks so permission light turns off
        stream.getTracks().forEach((t) => t.stop());

        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const file = new File([audioBlob], `audio_recording_${Date.now()}.wav`, {
          type: "audio/wav",
        });

        // Revoke previous URL (if any) to avoid memory leaks
        if (audioURL) URL.revokeObjectURL(audioURL);

        setAudioFile(file);
        setAudioURL(URL.createObjectURL(audioBlob));
        audioChunksRef.current = [];
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (e) {
      console.error("Microphone access error:", e);
      setRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const resetRecording = () => {
    if (audioURL) URL.revokeObjectURL(audioURL);
    setAudioURL("");
    setAudioFile(null);
    audioChunksRef.current = [];
    if (fileInputRef.current) fileInputRef.current.value = ""; // reset input
    onReset?.();
  };

  const saveRecording = () => {
    if (!audioFile) return;
    handleSave([audioFile], cardText);
  };

  // NEW: trigger hidden input
  const handleUploadClick = () => {
    if (!isLoading) fileInputRef.current?.click();
  };

  // NEW: when user picks an audio file
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Revoke old object URL to avoid leaks
    if (audioURL) URL.revokeObjectURL(audioURL);

    setRecording(false);
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
          <button style={{ marginTop: 20 }} className="recording" onClick={stopRecording}>Stop Recording</button>
        ) : (
          <>
            <button style={{ marginTop: 20 }} onClick={startRecording} disabled={isLoading}>Start Recording</button>
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

      {audioURL && (
        <div className="audio-playback">
          <audio controls src={audioURL}></audio>
        </div>
      )}
    </div>
  );
}

export default AudioRecorder;
