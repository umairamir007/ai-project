import axios from "axios";
import { auth, db } from "../components/google/firebase";
import { doc, setDoc } from "firebase/firestore";

const API_BASE = import.meta.env.VITE_API_BASE || "";

/**
 * Upload sample file to clone a voice model
 * @param {File} file
 * @param {string} [name="MyVoice"]
 * @returns {Promise<{voiceModelId: string}>}
 */
export async function cloneVoice(file, name = "MyVoice") {
  const user = auth.currentUser;
  if (!user) throw new Error("Not signed in");

  const idToken = await user.getIdToken();
  const form = new FormData();
  form.append("file", file, file.name || "sample.wav");
  form.append("name", name);

  const { data } = await axios.post(`${API_BASE}/fish/clone`, form, {
    headers: { Authorization: `Bearer ${idToken}` },
  });

  // Save voiceModelId to Firestore for this user
  if (data.voiceModelId) {
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, { fishVoiceId: data.voiceModelId }, { merge: true });
  }

  return data; // contains voiceModelId
}

export async function generateFishTTS(text, voice = "default") {
  const res = await axios.post(
    `${import.meta.env.VITE_API_BASE}/fish/tts`,
    { text, voice },
    { responseType: "blob" } // get audio blob
  );

  const audioUrl = URL.createObjectURL(res.data);
  return audioUrl;
}
