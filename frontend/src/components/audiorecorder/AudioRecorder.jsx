// AudioRecorder.js
import { useState, useRef } from "react";
import "./audiorecorder.css";

function AudioRecorder({ isLoading, handleSave, cardText }) {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioChunksRef.current = []; // reset before each new recording
    mediaRecorderRef.current = new MediaRecorder(stream);

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });

      // Always wrap blob in File for upload
      const file = new File([audioBlob], `audio_recording_${Date.now()}.wav`, {
        type: "audio/wav",
      });

      setAudioFile(file);
      setAudioURL(URL.createObjectURL(audioBlob));
      audioChunksRef.current = []; // clear chunks
    };

    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const resetRecording = () => {
    setAudioURL("");
    setAudioFile(null);
    audioChunksRef.current = [];
  };

  const saveRecording = () => {
    if (!audioFile) return;
    console.log("Saving file:", audioFile);
    console.log("cardText:", cardText);
    handleSave([audioFile], cardText); // always pass as File[]
  };

  return (
    <div className="audio-recorder-container">
      <div className="audio-controls">
        {audioURL ? (
          <>
            <button onClick={resetRecording}>Try Again</button>
            <button onClick={saveRecording}>
              {isLoading ? "Saving..." : "Save"}
            </button>
          </>
        ) : recording ? (
          <button className="recording" onClick={stopRecording}>
            Stop Recording
          </button>
        ) : (
          <button onClick={startRecording}>Start Recording</button>
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
