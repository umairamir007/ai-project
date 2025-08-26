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
    // if (auth.currentUser) {
    //   const userRef = doc(db, "users", auth.currentUser.uid);

    //   try {
    //     const userSnap = await getDoc(userRef);

    //     if (!userSnap.exists()) {
    //       const newUser = {
    //         uid: auth.currentUser.uid,
    //         email: auth.currentUser.email,
    //       };

    //       await setDoc(userRef, newUser);

    //       setSnack({
    //         message:
    //           "Welcome to the Talent Dashboard! Your account has been successfully created.",
    //         type: "success",
    //       });
    //       navigate("/talent-dashboard");
    //     } else {
    //       navigate("/talent-dashboard");
    //       setSnack({
    //         message: "Navigation to talent dashboard successful!",
    //         type: "success",
    //       });
    //     }
    //   } catch (error) {
    //     setSnack({
    //       message: `Error checking user data: ${error.message}`,
    //       type: "error",
    //     });
    //   }
    // }
    navigate("/talent-dashboard");
    setSnack({
      message: "Navigation to talent dashboard successful!",
      type: "success",
    });
  };

  const handleUserClick = async () => {
    // if (auth.currentUser) {
    //   const userRef = doc(db, "users", auth.currentUser.uid);

    //   try {
    //     const userSnap = await getDoc(userRef);

    //     if (!userSnap.exists()) {
    //       const newUser = {
    //         uid: auth.currentUser.uid,
    //         email: auth.currentUser.email,
    //       };

    //       await setDoc(userRef, newUser);
    //       setShowModal(false);
    //       setTimeout(() => {
    //         navigate("/user-dashboard");
    //       }, 3000);
    //       setSnack({
    //         message:
    //           "Welcome! Your account has been successfully created. Navigating to the user dashboard...",
    //         type: "success",
    //       });
    //     } else {
    //       setShowModal(false);
    //       setTimeout(() => {
    //         navigate("/user-dashboard");
    //       }, 3000);
    //       setSnack({
    //         message: "Navigation to user dashboard successful!",
    //         type: "success",
    //       });
    //     }
    //   } catch (error) {
    //     setSnack({
    //       message: `Error checking user data: ${error.message}`,
    //       type: "error",
    //     });
    //   }
    // }
    setShowModal(false);
    setTimeout(() => {
      navigate("/user-dashboard");
    }, 3000);
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
                <div className="login ">{<Login />}</div>
              </>
            )}
            {currentUser && (
              <>
                <div className="modal-sections">
                  <div>
                    <div className="modal-content">
                      <button onClick={handleTalentClick}>
                        Talent Dashboard
                      </button>
                    </div>
                  </div>
                  <div className="modal-content">
                    <button onClick={handleUserClick}>User Dashboard</button>
                  </div>
                </div>
                <div className="logout">
                  <Logout />
                </div>
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
