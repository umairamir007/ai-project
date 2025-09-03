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
      <button
        type="button"
        className="open-modal-btn"
        onClick={() => setShowModal(true)}
      >
        Sign In
      </button>
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
