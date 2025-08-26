// AudioRecorder.js
import React, { useState, useRef } from "react";
import "./audiorecorder.css";

function AudioRecorder({ isLoading, handleSave, cardText }) {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");
  const mediaRecorderRef = useRef(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };
    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      const url = URL.createObjectURL(audioBlob);
      setAudioURL(url);
      setAudioBlob(audioBlob); // Save the audioBlob in state
      audioBlob.name = `audio_recording_${Date.now()}.wav`;

      audioChunksRef.current = []; // Clear the chunks
    };
    mediaRecorderRef.current.start();
    setRecording(true);
  };
  const audioData = {
    data: audioBlob,
    name: `audio_recording_${Date.now()}.wav`,
  };
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  return (
    <div className="audio-recorder-container">
      <div className="audio-controls">
        {audioURL ? (
          <>
            <button
              onClick={() => {
                setAudioURL("");
                audioChunksRef.current = [];
              }}
            >
              Try Again
            </button>
            <button
              onClick={() => {
                console.log("Saving blob: ", audioBlob);
                console.log("cardText:", cardText);
                handleSave([audioData], cardText);
              }}
            >
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
