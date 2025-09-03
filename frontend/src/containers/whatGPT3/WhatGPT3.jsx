import Feature from "../../components/feature/Feature";
import "./whatgpt3.css";
import { useLocation } from "react-router-dom";
import { AudioRecorder, FileUpload } from "../../components";
import { useState } from "react";
import { auth, db } from "../../components/google/firebase";
import { doc, setDoc } from "firebase/firestore";
import { uploadAudioToBackend } from "../../api/storage";
import { signInAnonymously } from "firebase/auth";
import { cloneMiniMaxVoice } from "../../api/minimax";
import { TextToSpeech } from "../../api/textToSpeech";

const WhatGPT3 = ({
  selectedCard,
  showContent,
  voiceLab,
  voiceSelector,
  handleVoiceSelection,
  selectedArtist,
}) => {
  const location = useLocation();
  const isTalentDashboard = location.pathname === "/talent-dashboard";
  const isUserDashboard = location.pathname === "/user-dashboard";
  const isLanding = location.pathname === "/";
  const [isLoading, setIsLoading] = useState(false);

  const [ttsText, setTtsText] = useState("");
  const [audioSrc, setAudioSrc] = useState("");

  const handleSave = async (items, cardText) => {
    setIsLoading(true);
    try {
      const files = (Array.isArray(items) ? items : [items]).filter(Boolean);

      let user = auth.currentUser;
      if (!user) {
        const cred = await signInAnonymously(auth);
        user = cred.user;
      }
      const uid = user.uid;

      for (const item of files) {
        const file =
          item instanceof File
            ? item
            : item instanceof Blob
            ? new File([item], `upload_${Date.now()}.wav`, {
                type: item.type || "audio/wav",
              })
            : item?.data instanceof Blob
            ? new File([item.data], item.name || `upload_${Date.now()}.wav`, {
                type: item.data.type || "application/octet-stream",
              })
            : null;

        if (!file) continue;

        // upload to your backend -> Storage
        const { downloadURL } = await uploadAudioToBackend(file, cardText);
        console.log("Stored in Firebase Storage:", downloadURL);

        // mark user types in Firestore (client SDK; your rules allow anon user to update own doc)
        const userRef = doc(db, "users", uid);
        await setDoc(userRef, { types: { [cardText]: true } }, { merge: true });

        // add voice to ElevenLabs via your backend wrapper
        // await addVoice({ cardText, uploadedFile: file }); // TODO: comment becuse Eleven Labs API key is paid

        // Clone voice model on Fish Audio (only if cardText === "Vocalize")
        if (cardText === "Vocalize") {
          const voiceId = await cloneMiniMaxVoice(file);
          console.log("MiniMax voice cloned:", voiceId);
        }
      }
    } catch (e) {
      const msg =
        e?.response?.data?.error ||
        e?.response?.data ||
        e?.message ||
        String(e);
      console.error("Save failed:", e);
      alert(`Upload failed: ${msg}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTTS = async () => {
    try {
      const url = await TextToSpeech(ttsText, selectedArtist.voice_id);
      setAudioSrc(url);
    } catch (err) {
      console.error("handleTTS failed:", err);
      alert("handleTTS failed");
    }
  };

  const handleSelected = () => {
    if (!selectedArtist && showContent === 2) {
      return <p>Select from our talent pool below</p>;
    } else {
      return <p>Select</p>;
    }
  };

  let cardText = "";
  switch (selectedCard) {
    case 1:
      cardText = "Vocalize";
      break;
    case 2:
      cardText = "Text To Speech";
      break;
    case 3:
      cardText = "Speech To Text";
      break;
    default:
      cardText = "";
  }

  let headingText = "";
  switch (showContent) {
    case 1:
      headingText = "Voice Lab : Discover voices from our talent pool";
      break;
    case 2:
      headingText = "Script Lab : Discover scripts from our talent pool";
      break;
    case 3:
      headingText = "Art Lab : Discover artwork from our talent pool";
      break;
    default:
      headingText = "";
  }

  console.log("cardText", cardText);

  if (isTalentDashboard && !cardText) return null;

  return (
    <>
      {isLanding && (
        <div className="gpt3__whatgpt3 section__margin" id="wgpt3">
          <div className="gpt3__whatgpt3-feature">
            <Feature
              title="What is iSai"
              text="Experience the future of content creation, where AI-powered wizardy meets blockchain-powered royalties! Our user-friendly platform empowers artists to upload their original content seamlessly integrates AI enhancements,mints NFTsfor unique creations, tracks content distribution acorss platforms effortlessly calculates artist royalties, and ensures transparent and efficient royalty distribution through blockchain technology"
            />
          </div>
          <div className="gpt3__whatgpt3-heading">
            <h1 className="gradient__text">
              Welcome to the future of content, where creativity meets
              innovation!
            </h1>
            <p>Explore the Library</p>
          </div>
          <div className="gpt3__whatgpt3-container">
            <Feature title="Ethical Architecture" />
            <Feature title="AI Driven Content Generation" />
            <Feature title="Blockchain and Smart Contract" />
          </div>
        </div>
      )}

      {isTalentDashboard && (
        <div className="gpt3__whatgpt3 section__margin" id="wgpt3">
          <div className="gpt3__whatgpt3-heading">
            {/* {cardText === "Vocalize" && (
              <>
                <h1 className="gradient__text">{cardText}</h1>
                <AudioRecorder
                  isLoading={isLoading}
                  handleSave={handleSave}
                  cardText={cardText}
                />
                <FileUpload
                  isLoading={isLoading}
                  handleSave={handleSave}
                  cardText={cardText}
                />
              </>
            )} */}
            {cardText === "Text To Speech" && (
              <>
                <h1 className="gradient__text">{cardText}</h1>
                <FileUpload
                  isLoading={isLoading}
                  handleSave={handleSave}
                  cardText={cardText}
                  onExtractedText={async (text) => {
                    console.log("Extracted text:", text);
                    const url = await TextToSpeech(
                      text,
                      "OrvTmw7J3whxVXkEvMBj"
                    );
                    setAudioSrc(url);
                  }}
                />

                {/* NEW: MiniMax TTS section */}
                <div style={{ marginTop: "20px" }}>
                  <h3>Try MiniMax TTS</h3>
                  <input
                    type="text"
                    value={ttsText}
                    onChange={(e) => setTtsText(e.target.value)}
                    placeholder="Enter text"
                  />
                  <button onClick={handleTTS}>Speak</button>
                  {audioSrc && <audio controls src={audioSrc}></audio>}
                </div>
              </>
            )}
            {cardText === "Speech To Text" && (
              <>
                <h1 className="gradient__text">{cardText}</h1>
                <FileUpload
                  isLoading={isLoading}
                  handleSave={handleSave}
                  cardText={cardText}
                  onExtractedText={async (text) => {
                    setTtsText(text);
                    const url = await TextToSpeech(
                      text,
                      "OrvTmw7J3whxVXkEvMBj"
                    );
                    setAudioSrc(url);
                  }}
                />
              </>
            )}
          </div>
        </div>
      )}

      {voiceLab && isUserDashboard && (
        <div className="gpt3__whatgpt3 section__margin" id="wgpt3">
          <div className="gpt3__whatgpt3-heading">
            <h1 className="gradient__text">{headingText}</h1>
          </div>

          <div className={`box`} onClick={handleVoiceSelection}>
            <i
              className={`fa ${
                voiceSelector ? "fa-check-circle" : "fa-plus-circle"
              }`}
            ></i>
            {handleSelected()}
          </div>
        </div>
      )}
    </>
  );
};

export default WhatGPT3;
