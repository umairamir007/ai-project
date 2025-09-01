import { useLocation } from "react-router-dom";
import "./cta.css";
import { TextUpload } from "../../components/index";
import { useEffect, useState } from "react";
import { fetchVoices } from "../../api/elevenlabs";

const CTA = ({
  voiceSelector,
  showContent,
  handleSelectedArtist,
  selectedArtist,
}) => {
  const location = useLocation();
  const isUserDashboard = location.pathname === "/user-dashboard";
  const isLanding = location.pathname === "/";

  const [voices, setVoices] = useState([]);

  useEffect(() => {
    if (voiceSelector) {
      fetchVoices()
        .then((data) => {
          // some APIs return {voices: []}, normalize
          setVoices(data.voices || data);
        })
        .catch(console.error);
    }
  }, [voiceSelector]);

  let type = "";
  switch (showContent) {
    case 1:
      type = "Voice";
      break;
    case 2:
      type = "Script";
      break;
    case 3:
      type = "Art";
      break;
    default:
      type = "";
  }

  return (
    <>
      {isLanding && (
        <div className="gpt3__cta">
          <div className="gpt3__cta-content">
            <p>Request Early Access to Get Started</p>
            <h3>Register Today & start exploring the endless possibilities.</h3>
          </div>
          <div className="gpt3__cta-btn">
            <button type="button">Get Started</button>
          </div>
        </div>
      )}

      {voiceSelector && isUserDashboard && showContent && (
        <div className="gpt3__cta-user section__margin">
          {!selectedArtist ? (
            <>
              <div className="gpt3__cta-content-user">
                <p>View Different {type}s Available On Our Platform</p>
                <h3>Select a {type} from our talent pool</h3>
              </div>

              <div className="voice-grid">
                {voices.map((voice) => (
                  <div
                    key={voice.voice_id}
                    className="voice-card"
                    onClick={() => handleSelectedArtist(voice)}
                  >
                    <h4>{voice.name}</h4>
                    <p className="description">
                      {voice.description && voice.description.length > 200
                        ? voice.description.slice(0, 200) + "..."
                        : voice.description}
                    </p>
                    <audio controls src={voice.preview_url}></audio>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="gpt3__cta-content-user">
                <h2>
                  Upload Your Text for a Stunning Voice Over with{" "}
                  {selectedArtist.name}
                </h2>
                <button
                  style={{ marginLeft: "20px" }}
                  onClick={() => handleSelectedArtist(null)}
                >
                  Choose Again
                </button>
              </div>
              <TextUpload selectedArtist={selectedArtist} />
            </>
          )}
        </div>
      )}
    </>
  );
};

export default CTA;
