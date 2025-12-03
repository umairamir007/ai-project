// src/api/storage.js
import httpClient from "../lib/httpClient";
import { auth } from "../components/google/firebase";

/**
 * @param {File} file
 * @param {string} [cardText="Vocalize"]
 * @returns {Promise<{ok: boolean, path: string, downloadURL: string}>}
 */
export async function uploadAudioToBackend(file, cardText = "Vocalize") {
  const user = auth.currentUser;
  if (!user) throw new Error("Not signed in");

  const idToken = await user.getIdToken();

  const form = new FormData();
  form.append("file", file, file.name || "audio.wav");
  form.append("cardText", cardText);

  const { data } = await httpClient.post(
    "/storage/upload",
    form,
    {
      headers: { Authorization: `Bearer ${idToken}` },
    }
  );

  return data;
}
