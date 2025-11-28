import React, { useState } from "react";
import "./modal.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../google/authcontext";
import { Login, Logout } from "../index";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "../../components/google/firebase";
import { Snackbar } from "../index";
const Modal = () => {
  const [showModal, setShowModal] = useState(false);
  const [snack, setSnack] = useState({ message: "", type: "" });

  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleTalentClick = async () => {
    navigate("/talent-dashboard");
    setSnack({
      message: "Navigation to talent dashboard successful!",
      type: "success",
    });
  };

  const handleUserClick = async () => {
    setShowModal(false);
    setTimeout(() => {
      navigate("/user-dashboard");
    }, 1000);
    setSnack({
      message: "Navigation to user dashboard successful!",
      type: "success",
    });
  };

  return (
    <div>
      <div
        className="
    container relative  rounded-full
    border-2 border-white
    transition-all duration-[0.4s]
    before:content-[''] before:absolute before:inset-0 before:m-auto
    before:rounded-[0.9em] before:-z-10
    before:filter before:blur-[0] before:transition-[filter] before:duration-[0.4s]
    hover:before:bg-[linear-gradient(90deg,#0C3A2A,#0C3A2A)]
    hover:before:blur-[1.2em]
    active:before:blur-[0.2em]
  "
      >
        <button
          className="
      text-white bg-[#040404] cursor-pointer
      text-lg py-2 px-8 rounded-full
       border-none
      
    "
        >
          Sign In
        </button>
      </div>


      <Snackbar
        message={snack.message}
        type={snack.type}
        onDismiss={() => setSnack({ message: "", type: "" })}
      />
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal modal_background active">
            {!currentUser && (
              <>
                <div className="login">{<Login />}</div>
              </>
            )}
            {currentUser && (
              <>
                <div className="modal-sections">
                  {/* <div className="modal-content">
                    <button onClick={handleTalentClick}>
                      Talent Dashboard
                    </button>
                  </div> */}
                  <div className="modal-content">
                    <button onClick={handleUserClick}>User Dashboard</button>
                  </div>
                </div>
                {/* <div className="logout">
                  <Logout />
                </div> */}
              </>
            )}
            <div className="modal-close">
              <button type="button" onClick={() => setShowModal(false)}>
                <span>❌</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modal;
