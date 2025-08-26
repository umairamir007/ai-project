import React, { useEffect, useRef, useState } from "react";
import "./textupload.css";
import { getStorage, ref, getDownloadURL, listAll } from "firebase/storage";
import { getDoc, doc, collection } from "firebase/firestore";
import { db } from "../google/firebase";
import TextToSpeech from "../../api/textToSpeech";

function TextUpload({ selectedArtist }) {
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [text, setText] = useState("");
  const [audioURL, setAudioURL] = useState("");
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false); // New state to track if audio is being generated

  useEffect(() => {
    console.log("Effect running for artist:", selectedArtist); // Log when the effect runs
    if (selectedArtist) {
      const storage = getStorage();
      const audioStorageRef = ref(storage, `${selectedArtist.id}/Vocalize/`);

      listAll(audioStorageRef)
        .then((res) => {
          console.log("Files found:", res.items.length); // Log the number of files found
          if (res.items.length > 0) {
            getDownloadURL(res.items[0])
              .then((url) => {
                setAudioURL(url);
                console.log("URL fetched", url);
                setLoading(false);
              })
              .catch((error) => {
                console.error("Error fetching audio files:", error);
                setLoading(false);
              });
          } else {
            console.log("No audio files found for artist");
            setLoading(false);
          }
        })
        .catch((error) => {
          console.error("Error listing audio files:", error);
          setLoading(false);
        });
    }
  }, [selectedArtist]);

  const generateAudio = () => {
    setIsGenerating(true);
    const artistRef = doc(db, "users", selectedArtist.id);

    getDoc(artistRef)
      .then((docSnapshot) => {
        if (docSnapshot.exists()) {
          const voice_id = docSnapshot.data().voice_id;
          console.log("Requesting text-to-speech with voice_id:", voice_id);

          TextToSpeech({ voice_id, text })
            .then((audioData) => {
              const audioBlob = new Blob([audioData], { type: "audio/mpeg" });
              const audioUrl = URL.createObjectURL(audioBlob);
              setAudioURL(audioUrl);
              console.log("Audio generated:", audioUrl);
            })
            .catch((error) => {
              console.error("Error generating text-to-speech:", error);
            });
        }
      })
      .catch((error) => {
        console.error("Error fetching artist data:", error);
      });
  };

  const handlePlaySnippet = () => {
    if (audioRef.current) {
      setIsPlaying(true);
      audioRef.current.currentTime = 0;
      audioRef.current.play();

      setTimeout(() => {
        audioRef.current.pause();
        setIsPlaying(false);
      }, 10000);
    }
  };

  const handlePlayAudio = () => {
    if (audioRef.current) {
      audioRef.current.src = audioURL;
      console.log("audi0", audioURL);
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((error) => {
          console.error("Playback failed:", error);
          console.error("Current audio src:", audioRef.current.src);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="app-frame">
      <div className="container">
        <div className="languages">
          Click on a language to generate random speech:{" "}
          <span>{selectedLanguage}</span>
          <button onClick={() => setSelectedLanguage("English")}>
            English
          </button>
          <div className="text-bubble">More languages coming soon.</div>
          <div className="media-player">
            <button onClick={handlePlaySnippet}>
              {isPlaying ? "⏸ Pause" : "▶ Play Sample Of Talent"}
            </button>
            <audio ref={audioRef} src={audioURL} preload="none"></audio>
          </div>
        </div>
        <div className="input-area">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type in your text here..."
          ></textarea>

          <button type="button" onClick={generateAudio}>
            {isGenerating ? "Generating..." : "Generate Audio"}
          </button>
          {isGenerating && <div>Generating audio, please wait...</div>}
          {audioURL && (
            <div className="media-player">
              <button onClick={handlePlayAudio}>
                {isPlaying ? "⏸ Pause" : "▶ Play"}
              </button>
              <a href={audioURL} download="test.mp3">
                Download Audio File
              </a>
              <audio
                ref={audioRef}
                src={audioURL}
                preload="auto"
                onCanPlayThrough={() => setIsGenerating(false)}
                onEnded={() => setIsPlaying(false)}
                onError={(e) => console.error("Audio error:", e)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TextUpload;
