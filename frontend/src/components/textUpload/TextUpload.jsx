import { useEffect, useRef, useState } from "react";
import "./textupload.css";
import { getStorage, ref, getDownloadURL, listAll } from "firebase/storage";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../google/firebase";
import { TextToSpeech } from "../../api/textToSpeech";

function TextUpload({ selectedArtist }) {
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [text, setText] = useState("");
  const [sampleURL, setSampleURL] = useState(""); // separate for previews
  const [ttsURL, setTtsURL] = useState(""); // separate for generated audio
  console.log("🚀 ~ TextUpload ~ ttsURL:", ttsURL)
  const [loading, setLoading] = useState(true);
  const [isPlayingSample, setIsPlayingSample] = useState(false);
  const [isPlayingTts, setIsPlayingTts] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const sampleRef = useRef(null);
  const ttsRef = useRef(null);

  // Load preview (ElevenLabs preview_url OR Firebase file)
  useEffect(() => {
    if (!selectedArtist) return;
    setSampleURL("");
    setLoading(true);

    if (selectedArtist.preview_url) {
      setSampleURL(selectedArtist.preview_url);
      setLoading(false);
      return;
    }

    const storage = getStorage();
    const audioStorageRef = ref(storage, `${selectedArtist.id}/Vocalize/`);

    listAll(audioStorageRef)
      .then((res) => {
        if (res.items.length > 0) {
          getDownloadURL(res.items[0])
            .then((url) => {
              setSampleURL(url);
              setLoading(false);
            })
            .catch((err) => {
              console.error("Error fetching Firebase audio:", err);
              setLoading(false);
            });
        } else {
          console.log("No audio files found for artist");
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error listing audio files:", err);
        setLoading(false);
      });
  }, [selectedArtist]);

  // Generate audio from text using ElevenLabs + selected voice_id
  const generateAudio = async () => {
    if (!selectedArtist) return;
    if (!text.trim()) {
      alert("Please type some text first");
      return;
    }

    setIsGenerating(true);
    try {
      const voice_id = selectedArtist.voice_id;
      if (!voice_id) throw new Error("Selected artist has no voice_id");

      console.log("Generating TTS with voice_id:", voice_id);

      // const model_id =
      //   selectedLanguage === "English"
      //     ? "eleven_turbo_v2"
      //     : "eleven_multilingual_v2";

      const url = await TextToSpeech(text, voice_id);
      setTtsURL(url);
    } catch (err) {
      console.error("Error generating text-to-speech:", err);
      alert(err?.message ?? "TTS failed");
    } finally {
      setIsGenerating(false);
    }
  };

  // Play snippet preview (first 10s)
  const handlePlaySnippet = () => {
    if (sampleRef.current) {
      sampleRef.current.currentTime = 0;
      sampleRef.current.play();
      setIsPlayingSample(true);

      setTimeout(() => {
        sampleRef.current.pause();
        setIsPlayingSample(false);
      }, 10000);
    }
  };

  // Play full generated TTS
  const handlePlayAudio = () => {
    if (ttsRef.current) {
      if (isPlayingTts) {
        ttsRef.current.pause();
      } else {
        ttsRef.current
          .play()
          .catch((err) => console.error("Playback failed:", err));
      }
      setIsPlayingTts(!isPlayingTts);
    }
  };

  return (
    <div className="app-frame">
      <div className="container">
        {/* Preview sample */}
        {sampleURL && (
          <div className="media-player">
            <button onClick={handlePlaySnippet}>
              {isPlayingSample ? "⏸ Pause" : "▶ Play Sample Of Talent"}
            </button>
            <audio ref={sampleRef} src={sampleURL} preload="none" />
          </div>
        )}

        {/* Text input & generate */}
        <div className="input-area">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type in your text here..."
          />
          <button type="button" onClick={generateAudio} disabled={isGenerating}>
            {isGenerating ? "Generating..." : "Generate Audio"}
          </button>
        </div>

        {/* Generated TTS playback */}
        {ttsURL && (
          <div className="media-player">
            <button onClick={handlePlayAudio}>
              {isPlayingTts ? "⏸ Pause" : "▶ Play Generated Audio"}
            </button>
            <a href={ttsURL} download="tts.mp3">
              Download
            </a>
            <audio
              ref={ttsRef}
              src={ttsURL}
              preload="auto"
              onEnded={() => setIsPlayingTts(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default TextUpload;
