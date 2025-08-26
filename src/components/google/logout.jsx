import { auth } from "./firebase";
import { signOut } from "firebase/auth";
import { useNavigate, useLocation } from "react-router-dom";
import "./logout.css";
import { Snackbar } from "../index";
import { useState } from "react";

function LogoutButton() {
  const location = useLocation();
  const navigate = useNavigate();
  const [snack, setSnack] = useState({ message: "", type: "" }); // Snackbar state

  const handleLogout = async () => {
    const isTalentDashboard = location.pathname === "/talent-dashboard";
    const isUserDashboard = location.pathname === "/user-dashboard";

    try {
      if (isTalentDashboard || isUserDashboard) {
        navigate("/");
      }
      await signOut(auth);
      setSnack({ message: "User signed out!", type: "success" });
    } catch (error) {
      setSnack({
        message: `Error signing out: ${error.message}`,
        type: "error",
      });
    }
  };

  return (
    <div>
      <Snackbar
        message={snack.message}
        type={snack.type}
        onDismiss={() => setSnack({ message: "", type: "" })}
      />
      <button className="button-29" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default LogoutButton;
