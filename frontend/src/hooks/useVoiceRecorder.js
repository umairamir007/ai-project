import { useState, useRef, useEffect } from "react";
import { SpeechToText } from "../api/textToSpeech";

/**
 * Custom hook for voice recording and speech-to-text conversion
 * @returns {Object} Recording state and control functions
 */
export const useVoiceRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [transcribedText, setTranscribedText] = useState("");
  const [error, setError] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);

  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
      if (audioBlob) {
        URL.revokeObjectURL(URL.createObjectURL(audioBlob));
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Start recording audio from microphone
   */
  const startRecording = async () => {
    try {
      setError(null);
      setTranscribedText("");
      audioChunksRef.current = [];

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      // Create MediaRecorder
      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : MediaRecorder.isTypeSupported("audio/mp4")
        ? "audio/mp4"
        : "audio/webm"; // fallback

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType,
      });

      // Collect audio chunks
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // Handle recording stop
      mediaRecorderRef.current.onstop = () => {
        // Stop all tracks
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((track) => track.stop());
          mediaStreamRef.current = null;
        }

        // Create blob from chunks
        const blob = new Blob(audioChunksRef.current, {
          type: mimeType,
        });
        setAudioBlob(blob);
        audioChunksRef.current = [];
      };

      // Start recording
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error starting recording:", err);
      setError(err.message || "Failed to start recording");
      setIsRecording(false);
      
      // Cleanup on error
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
    }
  };

  /**
   * Stop recording
   */
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  /**
   * Convert recorded audio to text using speech-to-text API
   */
  const convertToText = async () => {
    if (!audioBlob || isConverting) return;

    setIsConverting(true);
    setError(null);

    try {
      // Convert blob to File for API
      const audioFile = new File([audioBlob], `recording_${Date.now()}.webm`, {
        type: audioBlob.type || "audio/webm",
      });

      // Call STT API
      const result = await SpeechToText(audioFile);
      const text = result?.text || "";

      setTranscribedText(text);
      return text;
    } catch (err) {
      console.error("Error converting to text:", err);
      setError(err.message || "Failed to convert speech to text");
      throw err;
    } finally {
      setIsConverting(false);
    }
  };

  /**
   * Reset all recording state
   */
  const reset = () => {
    stopRecording();
    setTranscribedText("");
    setError(null);
    setAudioBlob(null);
    audioChunksRef.current = [];
  };

  return {
    isRecording,
    isConverting,
    transcribedText,
    error,
    audioBlob,
    startRecording,
    stopRecording,
    convertToText,
    reset,
  };
};

