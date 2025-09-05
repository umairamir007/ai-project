import "font-awesome/css/font-awesome.min.css";
import people from "../../assets/people.png";
import ai from "../../assets/ai.png";
import "./header.css";
import { useLocation } from "react-router-dom";

const Header = ({
  selectedCard,
  setSelectedCard,
  setShowContent,
  showContent,
  voiceLab,
  setVoiceLab,
  onCloseContent,
}) => {
  const location = useLocation();
  const isTalentDashboard = location.pathname === "/talent-dashboard";
  const isLanding = location.pathname === "/";
  const isUserDashboard = location.pathname === "/user-dashboard";

  const handleCardClick = (cardNumber) => {
    setSelectedCard(cardNumber);
  };

  const toggleVoiceLab = () => {
    setVoiceLab(!voiceLab);
  };

  const handleBackButtonClick = () => {
    setShowContent(null);
    setVoiceLab(false);
    if (onCloseContent) onCloseContent();
  };

  return (
    <>
      {isLanding && (
        <div className="gpt3__header section__padding um_container" id="home">
          <div className="gpt3__header-content um_content-container">
            <h1 className="gradient__text">
              Experience the future of content creation. iSai your All-in-One
              Content Magic.
            </h1>
            <p>
              By implementing a transparent and ethically grounded trust system
              and actively promoting the advantages of AI, the media industry
              can facilitae business transformation while preserving the vital
              human element and ensuring fair compensation for all contributors
            </p>
            {/* <div className="gpt3__header-content__input">
              <input type="email" placeholder="Your Email Address" />
              <button type="button">Get Started</button>
            </div> */}
            <div className="gpt3__header-content__people">
              <img src={people} />
              <p>1,600 people requested access a visit in last 24 hours</p>
            </div>
          </div>
          <div className="gpt3__header-image">
            <img src={ai} />
          </div>
        </div>
      )}

      {isTalentDashboard && (
        <div className="gpt3__header section__padding" id="home">
          <div className="gpt3__header-content">
            {" "}
            <h1 className="gradient__text">
              Embark on a journey where your voice, text, and art transcend
              boundaries. With Vocalize, Scriptize, and Visionize, present them
              as canvases, allowing podcasters to create captivating narratives
            </h1>
            <p>Please select the talent you want to register for</p>
            <div className="gpt3__cards-container">
              <div
                className={`gpt3__card text-to-speech-card ${selectedCard === 2 ? "selected" : ""}`}
                onClick={() => {
                  handleCardClick(2);
                }}
              >
                <div className="card-icon-title" style={{ flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <i className="fa fa-volume-up card-icon" aria-hidden="true"></i>
                  <h2 className="gradient__text">Text to Speech</h2>
                </div>
                <p>
                  Submit Your Inspiring Script: Ignite the Path to Ultimate
                  Achievement!
                </p>
              </div>

              <div
                className={`gpt3__card speech-to-text-card ${selectedCard === 3 ? "selected" : ""}`}
                onClick={() => {
                  handleCardClick(3);
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <i className="fa fa-microphone card-icon" aria-hidden="true"></i>
                </div>
                <h2 className="gradient__text" style={{ textAlign: 'center' }}>Visionize</h2>
                <p>
                  Submit Your Artwork and Witness its Magical Transformation!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {isUserDashboard && showContent === null && (
        <div className="gpt3__header section__padding" id="home">
          <div className="gpt3__header-content">
            <h1 className="gradient__text">
              Embark on a journey to create something amazing
            </h1>
            <p>
              please select from our talent pool or upload your own work to
              generate your podcast
            </p>
            <div className="gpt3__cards-container">
              {/* Text To Speech */}
              <div
                className={`gpt3__card text-to-speech-card ${selectedCard === 2 ? "selected" : ""}`}
                onClick={() => { setSelectedCard(2); setShowContent(2); /* no extra step */ }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (setSelectedCard(2), setShowContent(2))}
              >
                {/* <i className="fa fa-volume-up card-icon" aria-hidden="true"></i> */}
                <h2 className="gradient__text card-title">Text To Speech</h2>
                <p className="card-desc">
                  Submit Your Inspiring Script: Ignite the Path to Ultimate Achievement!
                </p>
              </div>

              {/* Speech To Text */}
              <div
                className={`gpt3__card speech-to-text-card ${selectedCard === 3 ? "selected" : ""}`}
                onClick={() => setShowContent(3)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setShowContent(3)}
              >
                {/* <i className="fa fa-microphone card-icon" aria-hidden="true"></i> */}
                <h2 className="gradient__text card-title">Speech To Text</h2>
                <p className="card-desc">
                  Submit Your Artwork and Witness its Magical Transformation!
                </p>
              </div>

            </div>
          </div>
        </div>
      )}

      {showContent === 1 && (
        <div className="gpt3__header section__padding" id="home">
          <div className="gpt3__header-content">
            <button
              marginleft="0px"
              onClick={handleBackButtonClick}

            >
              <i className="fa fa-arrow-left"></i>
            </button>
            <h1 className="gradient__text">Speech Synthesis</h1>
            <p>
              Unleash the power of our cutting-edge technology to generate
              realistic, captivating speech in a wide range of languages.
            </p>
            <div className="gpt3__cards-container">
              <button
                className="plus-button gpt__card-AddButton "
                onClick={toggleVoiceLab}
              >
                <i className="fa fa-plus"></i> Add Voice
              </button>
            </div>
          </div>
        </div>
      )}

      {showContent === 2 && (
        <div className="gpt3__header section__padding" id="home">
          <div className="gpt3__header-content">
            <button
              marginleft="0px"
              onClick={handleBackButtonClick}
              style={{ position: "fixed", top: 16, left: 16, zIndex: 1000, background: "#57A8FF", border: 0, cursor: "pointer" }}
            >
              <i className="fa fa-arrow-left"></i>
            </button>
            <div className="um_gpt_container">
              <div>
                {/* KEEP the TTS heading visible */}
                <h1 className="gradient__text">Text Synthesis</h1>
                <p>
                  Unleash the power of our cutting edge technology to create
                  various scripts
                </p>
              </div>
              {/* COMMENT OUT the Add Text button (no extra step) */}
              {/*
              <button
                className="gpt__card-AddButton plus-button"
                onClick={toggleVoiceLab}
              >
                <i className="fa fa-plus"></i> Add Text
              </button>
              */}
            </div>
          </div>
        </div>
      )}

      {showContent === 3 && (
        <div className="gpt3__header section__padding" id="home">
          <div className="gpt3__header-content">
            <button
              marginleft="0px"
              onClick={handleBackButtonClick}
              style={{ position: "fixed", top: 16, left: 16, zIndex: 1000, background: "#57A8FF", border: 0, cursor: "pointer" }}
            >
              <i className="fa fa-arrow-left"></i>
            </button>
            <div className="um_gpt_container">
              <div>
                {/* KEEP STT heading + paragraph + button as before */}
                <h1 className="gradient__text">Speech To Text</h1>
                <p>
                  Upload an audio file and let AI transcribe it into text
                  instantly.
                </p>
              </div>

              {/* <button
                className="plus-button gpt__card-AddButton "
                onClick={toggleVoiceLab}
              >
                <i className="fa fa-plus"></i> Add Audio
              </button> */}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
