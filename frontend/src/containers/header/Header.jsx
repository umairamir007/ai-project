import "font-awesome/css/font-awesome.min.css";
import people from "../../assets/people.png";
import ai from "../../assets/ai.png";
import "./header.css";
import { useLocation } from "react-router-dom";
import { folder, speech, text } from "../../images";
import { Heading } from "../../components/layout/heading";

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
            <h1 className="text-re">
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
        <div className="py-20 flex flex-col gap-4 max-w-4xl  mx-auto" id="home">

          {/* <h1 className="gradient__text">
              Embark on a journey to create something amazing
            </h1>
            <p>
              please select from our talent pool or upload your own work to
              generate your podcast
            </p> */}
          <div className="flex  gap-4 ">

            {/* <div
                className={`gpt3__card text-to-speech-card ${selectedCard === 2 ? "selected" : ""}`}
                onClick={() => { setSelectedCard(2); setShowContent(2); }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (setSelectedCard(2), setShowContent(2))}
              >

                <h2 className="gradient__text card-title">Text To Speech</h2>
                <p className="card-desc">
                  Submit Your Inspiring Script: Ignite the Path to Ultimate Achievement!
                </p>
              </div> */}
            <div
              className="
    relative
    w-full
    rounded-3xl
    p-8
    overflow-hidden
    bg-[linear-gradient(135deg,rgba(5,20,15,1)_0%,rgba(0,0,0,1)_100%)]
    shadow-[0_0_40px_rgba(0,0,0,0.45)]
    border border-white/10  h-[260px]"  onClick={() => { setSelectedCard(2); setShowContent(2); }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (setSelectedCard(2), setShowContent(2))} >
              {/* TEXT */}
              <div className="flex flex-col gap-3 z-10 relative">
                <h2 className="text-white text-2xl font-semibold">
                  Text To Speech
                </h2>

                <p className="text-[#DEDEDE] text-base sm:text-lg leading-relaxed ">
                  From text to natural speech — effortlessly.
                </p>
              </div>
              <img
                src={text}
                alt="icon"
                className="
      absolute
   bottom-[-60px]
      right-[-28px]
      w-56
      object-contain"
              />
            </div>


            {/* Speech To Text */}
            {/* <div
                className={`gpt3__card speech-to-text-card ${selectedCard === 3 ? "selected" : ""}`}
                onClick={() => setShowContent(3)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setShowContent(3)}
              >
                <h2 className="gradient__text card-title">Speech To Text</h2>
                <p className="card-desc">
                  Submit Your Artwork and Witness its Magical Transformation!
                </p>
              </div> */}
            <div
              className="
    relative
    w-full
    rounded-3xl
    p-8
    overflow-hidden
    bg-[linear-gradient(135deg,rgba(5,20,15,1)_0%,rgba(0,0,0,1)_100%)]
    shadow-[0_0_40px_rgba(0,0,0,0.45)]
    border border-white/10 
    h-[260px]" onClick={() => setShowContent(3)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setShowContent(3)}>
              {/* TEXT */}
              <div className="flex flex-col gap-3 z-10 relative">
                <h2 className="text-white text-2xl font-semibold">
                  Speech to Text
                </h2>

                <p className="text-[#DEDEDE] text-base sm:text-lg leading-relaxed ">
                  Turn speech into accurate, editable text.
                </p>
              </div>
              <img
                src={speech}
                alt="icon"
                className="
      absolute bottom-[-50px] right-[-10px] -rotate-12 w-48 object-contain"/>
            </div>

          </div>
          <div
            class="h-56 w-full border border-white/20 rounded-[32px] bg-[linear-gradient(180deg,rgba(0,0,0,0.6)_0%,rgba(12,66,48,0.34)_100%)] p-6"
          >
            <div className="h-full flex items-center justify-between ">
              <div>
                <Heading size="normal" title={'My Library'} />
                <p className="mt-4 text-[#DEDEDE] sm:text-lg  text-3xl:text-xl text-sm font-medium">
                  Your personal hub to securely store, organize, and manage every file you’ve created. Quickly access past work, keep projects structured, and maintain all your content in one reliable place.
                </p>
              </div>
              <img className="h-36 w-36 object-contain " src={folder} alt="" />
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
              onClick={handleBackButtonClick}
              style={{
                // positioning
                position: "fixed",
                top: 16,
                left: 16,
                zIndex: 1000,

                backgroundImage:
                  "radial-gradient(100% 100% at 100% 0, #5adaff 0, #5468ff 100%)",
                alignItems: "center",
                WebkitAppearance: "none",
                appearance: "none",
                border: 0,
                borderRadius: 6,
                boxSizing: "border-box",
                color: "#fff",
                cursor: "pointer",
                display: "inline-flex",
                height: 48,
                justifyContent: "center",
                lineHeight: 1,
                listStyle: "none",
                overflow: "hidden",
                paddingLeft: 16,
                paddingRight: 16,
                textAlign: "left",
                textDecoration: "none",
                transition: "box-shadow 0.15s, transform 0.15s",
                userSelect: "none",
                WebkitUserSelect: "none",
                touchAction: "manipulation",
                whiteSpace: "nowrap",
                willChange: "box-shadow, transform",
                fontSize: 16,
                marginLeft: 0, // replaces the old marginleft="0px"
              }}
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
              onClick={handleBackButtonClick}
              style={{
                // positioning
                position: "fixed",
                top: 16,
                left: 16,
                zIndex: 1000,

                backgroundImage:
                  "radial-gradient(100% 100% at 100% 0, #5adaff 0, #5468ff 100%)",
                alignItems: "center",
                WebkitAppearance: "none",
                appearance: "none",
                border: 0,
                borderRadius: 6,
                boxSizing: "border-box",
                color: "#fff",
                cursor: "pointer",
                display: "inline-flex",
                height: 48,
                justifyContent: "center",
                lineHeight: 1,
                listStyle: "none",
                overflow: "hidden",
                paddingLeft: 16,
                paddingRight: 16,
                textAlign: "left",
                textDecoration: "none",
                transition: "box-shadow 0.15s, transform 0.15s",
                userSelect: "none",
                WebkitUserSelect: "none",
                touchAction: "manipulation",
                whiteSpace: "nowrap",
                willChange: "box-shadow, transform",
                fontSize: 16,
                marginLeft: 0,
              }}
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
