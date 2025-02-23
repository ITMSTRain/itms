import React, { useEffect } from 'react';

// Dialog Component
function Dialog({ isOpen, onClose, children }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'; // Prevent scroll when modal is open
    } else {
      document.body.style.overflow = 'auto'; // Re-enable scroll when modal is closed
    }
  }, [isOpen]);

  if (!isOpen) return null; // If the dialog is not open, render nothing.

  return (
    <div role="dialog" aria-labelledby="dialog-title" aria-hidden={!isOpen} style={styles.overlay}>
      <div role="document" style={styles.dialog}>
        {children}
        <button onClick={onClose} style={styles.closeButton} aria-label="Close">
          X
        </button>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  dialog: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    minWidth: '300px',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'none',
    border: 'none',
    fontSize: '20px',
  },
};

export default Dialog;
