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
const LandingPage = () => {
  return (
    <div className="App">
      <div className="gradient__bg">
        <Navbar />
        <Header />
      </div>
      <Brand />
      <WhatGPT3 />
      <Features />
      <Possibility />
      <CTA />
      <Blog />
      <Footer />
    </div>
  );
};

const App = () => {
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
