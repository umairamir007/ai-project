// src/api/createVoice.js

import axios from "axios";
import { auth, db } from "../components/google/firebase";
import { doc, updateDoc } from "firebase/firestore";

export async function addVoice({ cardText, uploadedFile }) {
  if (cardText === "Vocalize") {
    const url = `${import.meta.env.VITE_API_BASE}/elevenlabs/voices/add`;
    console.log("🚀 ~ addVoice ~ url:", url)

    const form = new FormData();

    const labels = {
      language: "English",
      category: "Speech",
      speaker: auth.currentUser.displayName,
    };

    const labelsJSON = JSON.stringify(labels);

    form.append("name", auth.currentUser.displayName);
    form.append("description", "Description of the voice");
    form.append("labels", labelsJSON);
    form.append("files", uploadedFile, uploadedFile.name);

    try {
      const response = await axios.post(url, form, {
        headers: {
          /* CORS & boundary handled by axios */
        },
      });

      const { voice_id } = response.data;

      const userId = auth.currentUser.uid;
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        voice_id: voice_id,
      });
      console.log("Uploaded voice with ID: ", voice_id);
    } catch (error) {
      if (error.response) {
        console.error("Error uploading voice:", error.response.data);
      } else if (error.request) {
        console.error("Request made, but no response received:", error.request);
      } else {
        console.error("Error setting up the request:", error.message);
      }
    }
  } else {
    console.error("Illegal Card Text");
  }
}
