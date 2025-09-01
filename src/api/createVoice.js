import axios from "axios";
import { auth, db } from "../components/google/firebase";
import { doc, setDoc } from "firebase/firestore";

export async function addVoice({ cardText, uploadedFile }) {
  if (cardText !== "Vocalize") {
    console.error("Illegal Card Text");
    return;
  }

  const url = `${import.meta.env.VITE_API_BASE}/elevenlabs/voices/add`;
  const form = new FormData();
  const user = auth.currentUser;

  const labels = {
    language: "English",
    category: "Speech",
    speaker: user?.displayName || "Anonymous",
  };

  form.append("name", user?.displayName || "Anonymous");
  form.append("description", "Description of the voice");
  form.append("labels", JSON.stringify(labels));
  form.append("file", uploadedFile, uploadedFile.name); // <-- FIXED

  try {
    const { data } = await axios.post(url, form); // No auth required for this route (your router doesn’t enforce it)
    const { voice_id } = data;

    // Upsert user doc so it exists
    const userRef = doc(db, "users", user.uid);
    await setDoc(
      userRef,
      {
        voice_id,
        types: { Vocalize: true }, // keep your flag too
      },
      { merge: true }
    );

    console.log("Uploaded voice with ID:", voice_id);
    return voice_id;
  } catch (error) {
    const msg = error?.response?.data || error?.message || error;
    console.error("Error uploading voice:", msg);
    throw error;
  }
}
