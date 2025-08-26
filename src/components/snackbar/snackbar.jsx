import React, { useEffect, useState } from "react";
import "./snackbar.css";

function Snackbar({ message, type, duration = 3000, onDismiss = () => {} }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onDismiss();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration, onDismiss]);

  return (
    <div className={`snackbar ${type} ${visible ? "show" : ""}`}>{message}</div>
  );
}

export default Snackbar;
