import axios from "axios";
import FormData from "form-data";
import { db } from "../components/google/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
export async function getVoice({ selectedRow }) {
  const url = `https://api.elevenlabs.io/v1/voices/${voice_id}`;
  const usersRef = collection(db, { selectedRow });
  const q = query(usersRef, where("voice_id", value));
  const querySnapshot = await getDocs(q);

  try {
    const response = await axios.post(url, {
      headers: {
        "xi-api-key": "535c9779eac3ff852e340d337c01dc34",
      },
    });

    const { voice_id } = response.data;
    console.log("Selected voice with ID: ", voice_id);
  } catch (error) {
    if (error.response) {
      console.error("Error uploading voice:", error.response.data);
    } else if (error.request) {
      console.error("Request made, but no response received:", error.request);
    } else {
      console.error("Error setting up the request:", error.message);
    }
  }
}
