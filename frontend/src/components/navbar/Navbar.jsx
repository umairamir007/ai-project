import { useState } from "react";
import { RiMenu3Line, RiCloseLine } from "react-icons/ri";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import "./navbar.css";
import Modal from "../modal/Modal";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Logout } from "..";

const Navbar = ({ type }) => {
  const [toggleMenu, setToggleMenu] = useState(false);

  const defaultLinks = [
    { href: "#home", label: "Home" },
    { href: "#wgpt3", label: "What is iSai?" },
    { href: "#possibility", label: "Tech with a heart" },
    { href: "#features", label: "Case Studies" },
    { href: "#blog", label: "White Paper" },
  ];

  const talentLinks = [
    { href: "#home", label: "Home" },
    { href: "#Register", label: "Register Voice" },
    { href: "#NFT", label: "NFT" },
    { href: "#Royalties", label: "Royalties" },
  ];

  const userLinks = [
    { href: "#home", label: "Home" },
    { href: "#GeneratePodcast", label: "Generate Podcast" },
  ];

  const renderLinks = (links) => (
    <div className="gpt3__navbar-links_container">
      {links.map((link) => (
        <p key={link.href}>
          {link.label === "Home" ? (
            <Link to="/">{link.label}</Link>
          ) : (
            <a href={link.href}>{link.label}</a>
          )}
        </p>
      ))}
    </div>
  );

  return (
    <div className="gpt3__navbar">
      <div className="gpt3__navbar-links">
        <div className="gpt3__navbar-links_logo">
          <img
            src={logo}
            style={{ width: "80px", height: "100%" }}
            alt="Logo"
          />
        </div>
        {!type && renderLinks(defaultLinks)}
        {type === "Talent" && <>{renderLinks([...talentLinks])}</>}
        {type === "User" && <>{renderLinks([...userLinks])}</>}
      </div>
      <div className="gpt3__navbar-sign">
        {!type && <Modal />}
        {(type === "Talent" || type === "User") && (
          <>
            {/* <div style={{ marginRight: "20px" }}>
              <ConnectButton />
            </div> */}
            <div>
              <Logout />
            </div>
          </>
        )}
      </div>

      <div className="gpt3__navbar-menu">
        {toggleMenu ? (
          <RiCloseLine
            color="#fff"
            size={27}
            onClick={() => setToggleMenu(false)}
          />
        ) : (
          <RiMenu3Line
            color="#fff"
            size={27}
            onClick={() => setToggleMenu(true)}
          />
        )}
        {toggleMenu && (
          <div className="gpt3__navbar-menu_container scale-up-center">
            {!type && renderLinks(defaultLinks)}
            {type === "Talent" && renderLinks([...talentLinks])}
            {type === "User" && renderLinks([...userLinks])}
            <div className="gpt3__navbar-menu_container-links-sign">
              <Modal />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
