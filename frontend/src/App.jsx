import "./App.css";
import { CTA, Brand, Navbar } from "./components";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TalentDashboard from "./pages/talentdashboard/TalentDashboard";
import UserDasboard from "./pages/userdashboard/UserDashboard";
import { useEnsureAnonAuth } from "./hooks/useEnsureAnonAuth";
import Top from "./components/top/Top";
import StepsScroll from "./components/animation/StepsScroll";
import TestScrollAnimation from "./test/TestScrollAnimation";
import Hero from "./components/hero/Hero";
import LoveIsai from "./components/love/LoveIsai";
import WhyIsai from "./components/why/WhyIsai";
import Case from "./components/case/Case";
import Pricing from "./components/pricing/Pricing";
import Subscribe from "./components/subscribe/Subscribe";
import Footer from "./components/footer/Footer";
import SignIn from "./components/auth/SignIn";

const LandingPage = () => {
  return (
    <div className="App">
      <div className="bg-[#040404]">
        <Navbar />
        {/* <Header /> */}
        {/* <Top /> */}
        <Hero />
      </div>
      <Brand />
      <TestScrollAnimation />
      {/* <StepsScroll /> */}
      {/* <WhatGPT3 /> */}
      {/* <Features /> */}
      <LoveIsai />
      <WhyIsai />
      <Case />
      <Pricing />
      <Subscribe />
      {/* <Possibility /> */}
      {/* <CTA /> */}
      {/* <Blog /> */}
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
        <Route path="/sign-in" element={<SignIn />} />
      </Routes>
    </Router>
  );
};

export default App;
