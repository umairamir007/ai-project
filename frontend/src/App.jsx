import "./App.css";
import {
  Footer,
  Blog,
  Possibility,
  Features,
  WhatGPT3,
  Header,
} from "./containers";
import { CTA, Brand, Navbar } from "./components";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TalentDashboard from "./pages/talentdashboard/TalentDashboard";
import UserDasboard from "./pages/userdashboard/UserDashboard";
import { useEnsureAnonAuth } from "./hooks/useEnsureAnonAuth";
import Top from "./components/top/Top";
import StepsScroll from "./components/animation/StepsScroll";
import TestScrollAnimation from "./test/TestScrollAnimation";

const LandingPage = () => {
  return (
    <div className="App">
      <div className="bg-[#040404]">
        <Navbar />
        <Header />
        {/* <Top /> */}
      </div>
      <Brand />
      <TestScrollAnimation />
      {/* <StepsScroll /> */}
      {/* <WhatGPT3 /> */}
      <Features />
      <Possibility />
      <CTA />
      <Blog />
      <Footer />
    </div>
  );
};

const App = () => {
  useEnsureAnonAuth();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/talent-dashboard" element={<TalentDashboard />} />
        <Route path="/user-dashboard" element={<UserDasboard />} />
      </Routes>
    </Router>
  );
};

export default App;
