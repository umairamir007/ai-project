import { Footer, Blog, WhatGPT3, Header } from "../../containers";
import { CTA, Brand } from "../../components";
import { useAccount } from "wagmi";
import { Navbar } from "../../components";

import "./userdashboard.css";
import { useState } from "react";

const UserDasboard = () => {
  const { isConnected, address } = useAccount();
  const [voiceLab, setVoiceLab] = useState(false);
  console.log("🚀 ~ UserDasboard ~ voiceLab:", voiceLab)
  const [showContent, setShowContent] = useState(null);
  const [voiceSelector, setVoiceSelector] = useState(false);
  console.log("🚀 ~ UserDasboard ~ voiceSelector:", voiceSelector)
  const [selectedArtist, setSelectedArtist] = useState(null);
  console.log("🚀 ~ UserDasboard ~ selectedArtist:", selectedArtist)

  const handleVoiceSelection = () => {
    setVoiceSelector(!voiceSelector);
  };

  const handleCloseContent = () => {
    setVoiceSelector(false);
    setVoiceLab(false);
  };

  const handleSelectedArtist = (user = null) => {
    setSelectedArtist(user);
  };

  return (
    <div className="App">
      <div className="gradient__bg">
        <Navbar type="User" />
        {/* {isConnected && address && ( */}
        <>
          <Header
            voiceLab={voiceLab}
            setVoiceLab={setVoiceLab}
            setShowContent={setShowContent}
            showContent={showContent}
            onCloseContent={handleCloseContent}
          />
          <WhatGPT3
            voiceLab={voiceLab}
            voiceSelector={voiceSelector}
            handleVoiceSelection={handleVoiceSelection}
            showContent={showContent}
            selectedArtist={selectedArtist}
          />
          <CTA
            showContent={showContent}
            voiceSelector={voiceSelector}
            handleSelectedArtist={handleSelectedArtist}
            selectedArtist={selectedArtist}
          />
          {/* <Blog selectedArtist={selectedArtist} /> */}
          <Footer />
        </>
        {/* )} */}
      </div>
    </div>
  );
};

export default UserDasboard;
