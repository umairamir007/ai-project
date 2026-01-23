import React from "react";
import "./ConfirmationModal.css";

/**
 * Reusable Confirmation Modal Component
 * @param {boolean} isOpen - Whether the modal is open
 * @param {function} onClose - Function to call when modal is closed
 * @param {function} onConfirm - Function to call when user confirms
 * @param {string} title - Title of the modal
 * @param {string} message - Message to display
 * @param {string} confirmText - Text for confirm button (default: "Confirm")
 * @param {string} cancelText - Text for cancel button (default: "Cancel")
 * @param {string} confirmButtonColor - Color variant for confirm button (default: "destructive")
 */
const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmButtonColor = "destructive",
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div
      className="confirmation-modal-backdrop"
      onClick={handleBackdropClick}
    >
      <div className="confirmation-modal-content">
        <div className="confirmation-modal-header">
          <h2 className="confirmation-modal-title">{title}</h2>
          <button
            className="confirmation-modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="confirmation-modal-body">
          <p className="confirmation-modal-message">{message}</p>
        </div>
        <div className="confirmation-modal-footer">
          <button
            className="confirmation-modal-button confirmation-modal-button-cancel"
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button
            className={`confirmation-modal-button confirmation-modal-button-confirm confirmation-modal-button-${confirmButtonColor}`}
            onClick={handleConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
