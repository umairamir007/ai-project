import { useEffect, useRef, useState } from "react";
import "./textupload.css";
import { getStorage, ref, getDownloadURL, listAll } from "firebase/storage";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../google/firebase";
import { TextToSpeech } from "../../api/textToSpeech";

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

  const generateAudio = async () => {
    if (!selectedArtist) return;
    if (!text.trim()) {
      alert("Please type some text first");
      return;
    }

    setIsGenerating(true);
    let oldUrl = audioURL;

    try {
      const artistRef = doc(db, "users", selectedArtist.id);
      const docSnapshot = await getDoc(artistRef);

      if (!docSnapshot.exists()) throw new Error("Selected artist not found");
      const voice_id = docSnapshot.data().voice_id;
      if (!voice_id) throw new Error("Artist has no voice_id saved");

      console.log("Requesting text-to-speech with voice_id:", voice_id);

      // Optional: pick model by language
      const model_id =
        selectedLanguage === "English"
          ? "eleven_turbo_v2"
          : "eleven_multilingual_v2";

      const audioData = await TextToSpeech({ voice_id, text, model_id });
      const blob = new Blob([audioData], { type: "audio/mpeg" });
      const url = URL.createObjectURL(blob);
      setAudioURL(url);
      if (oldUrl) URL.revokeObjectURL(oldUrl);
      console.log("Audio generated:", url);
    } catch (error) {
      console.error("Error generating text-to-speech:", error);
      alert(error?.message ?? "Text-to-speech failed");
    } finally {
      setIsGenerating(false);
    }
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
