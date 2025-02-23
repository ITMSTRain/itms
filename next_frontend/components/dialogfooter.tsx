// src/components/ui/dialog/DialogFooter.tsx
import React from 'react';
import { Button } from './ui/button'; // Import the Button component

interface DialogFooterProps {
  onCancel: () => void; // Function type for cancel button
  onConfirm: () => void; // Function type for confirm button
  cancelText?: string; // Optional prop for cancel button text
  confirmText?: string; // Optional prop for confirm button text
  children?: React.ReactNode; // Optional children prop for custom content inside the footer
}

const DialogFooter: React.FC<DialogFooterProps> = ({
  onCancel,
  onConfirm,
  cancelText = "Cancel",
  confirmText = "Confirm",
  children
}) => {
  return (
    <div className="dialog-footer p-4 border-t border-gray-200 flex justify-end gap-4">
      <Button variant="outline" onClick={onCancel}>
        {cancelText}
      </Button>
      <Button onClick={onConfirm}>
        {confirmText}
      </Button>
      {children && <div className="footer-children">{children}</div>} {/* Render children */}
    </div>
  );
};

export default DialogFooter;
