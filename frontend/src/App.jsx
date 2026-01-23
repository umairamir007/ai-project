import React, { useEffect } from "react";
import "./App.css";
import { CTA, Brand, Navbar } from "./components";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import TalentDashboard from "./pages/talentdashboard/TalentDashboard";
import UserDasboard from "./pages/userdashboard/UserDashboard";
import { useEnsureAnonAuth } from "./hooks/useEnsureAnonAuth";
import ProtectedRoute from "./components/routing/ProtectedRoute";
import PublicRoute from "./components/routing/PublicRoute";
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
import SignUp from "./components/auth/SignUp";
import RecordVoice from "./components/RecordVoice";
import UploadAudio from "./components/UploadAudio";
import MyLibrary from "./components/MyLibrary";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";

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

const ScrollToHash = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.replace("#", "");
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [location]);

  return null;
};

const App = () => {
  useEnsureAnonAuth();

  return (
    <>
      <Router>
        <ScrollToHash />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/talent-dashboard" element={<TalentDashboard />} />
            <Route path="/user-dashboard" element={<UserDasboard />} />
            <Route path="/speech-to-text" element={<RecordVoice /> } />
            <Route path="/upload-audio" element={<UploadAudio />} />
            <Route path="/my-library" element={<MyLibrary />} />
          </Route>
          <Route element={<PublicRoute />}>
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>
        </Routes>
      </Router>
      <Toaster position="top-center" />
    </>
  );
};

export default App;
