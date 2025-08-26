import axios from "axios";

export default async function TextToSpeech({ voice_id, text }) {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`;

  try {
    const response = await axios.post(
      url,
      {
        text: text,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0,
          similarity_boost: 0,
          style: 0,
          use_speaker_boost: true,
        },
      },
      {
        headers: {
          "xi-api-key": "535c9779eac3ff852e340d337c01dc34",
        },
        params: {
          optimize_streaming_latency: 0,
          output_format: "mp3_44100_128",
        },
        responseType: "arraybuffer",
      }
    );
    // Additional logging for debugging
    console.log("Response Status:", response.status);
    console.log("Response Headers:", response.headers);
    console.log("Response Data Byte Length:", response.data.byteLength);

    // Check if the ArrayBuffer is empty
    if (response.data.byteLength === 0) {
      throw new Error("The ArrayBuffer is empty.");
    }

    // Continue with your logic, like converting to a Blob, etc.
    return response.data;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Error Response:", error.response);
      console.error("Error Data:", error.response.data);
      console.error("Error Status:", error.response.status);
      console.error("Error Headers:", error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("Error Request:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error Message:", error.message);
    }
    console.error("Error Config:", error.config);
  }
}
