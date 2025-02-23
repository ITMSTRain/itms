// src/components/dialogheader.js
import React from 'react';

const DialogHeader = ({ children }) => {
  return (
    <div className="dialog-header p-4 border-b border-gray-200">
      <h2 className="text-xl font-semibold">{children}</h2>
    </div>
  );
};

export default DialogHeader;
