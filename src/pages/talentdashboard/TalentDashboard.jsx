import React, { useEffect, useState } from "react";
import { WhatGPT3, Header, NFTContainer } from "../../containers";
import { Navbar } from "../../components";

const TalentDashboard = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  // const { isConnected, address } = useAccount();

  return (
    <div className="App">
      <div className="gradient__bg">
        <Navbar type="Talent" />
        {/* {isConnected && address && ( */}
        {/* <> */}
        <Header selectedCard={selectedCard} setSelectedCard={setSelectedCard} />
        <WhatGPT3 selectedCard={selectedCard} />
        <NFTContainer />
        {/* </> */}
        {/* )} */}b{" "}
      </div>
    </div>
  );
};

export default TalentDashboard;
