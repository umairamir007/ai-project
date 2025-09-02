// src/api/minimax.js
import axios from "axios";
import { auth, db } from "../components/google/firebase";
import { doc, setDoc } from "firebase/firestore";

const API_BASE = import.meta.env.VITE_API_BASE || "";

/**
 * Uploads voice to backend -> MiniMax voice clone
 * @param {File} file
 */
export async function cloneMiniMaxVoice(file) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not signed in");

  const idToken = await user.getIdToken();

  const form = new FormData();
  form.append("file", file, file.name || "sample.wav");

  const { data } = await axios.post(`${API_BASE}/minimax/clone`, form, {
    headers: { Authorization: `Bearer ${idToken}` },
  });

  if (data.voiceId) {
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, { minimaxVoiceId: data.voiceId }, { merge: true });
  }

  return data.voiceId;
}

export async function generateMiniMaxTTS(text, voice = "male-qn-qingse") {
  const { data } = await axios.post(
    `${import.meta.env.VITE_API_BASE}/minimax/tts`,
    { text, voice },
    { responseType: "arraybuffer" }
  );

  // turn raw bytes into a Blob URL
  const blob = new Blob([data], { type: "audio/mpeg" });
  return URL.createObjectURL(blob);
}
