import { auth, db } from "./firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { Snackbar } from "../index";
import "./logout.css";
import { useState } from "react";

function Login() {
  const [snack, setSnack] = useState({ message: "", type: "" }); // Snackbar state

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(
        auth,
        provider.setCustomParameters({ prompt: "select_account" })
      );
      const user = result.user;
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        });
      }

      setSnack({ message: "Logged in successfully!", type: "success" });
    } catch (error) {
      setSnack({ message: `Error: ${error.message}`, type: "error" });
    }
  };

  return (
    <div>
      <button className="button-29" onClick={signInWithGoogle}>
        Sign in with Google
      </button>
      <Snackbar
        message={snack.message}
        type={snack.type}
        onDismiss={() => setSnack({ message: "", type: "" })}
      />
    </div>
  );
}

export default Login;
