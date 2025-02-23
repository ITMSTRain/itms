import React from "react";

const Header: React.FC = () => {
  return (
    <header className="bg-[#343A40] shadow-md p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img
            src="/img/logo.png"
            alt="Road Guard Logo"
            className="h-12 w-12 object-contain"
          />
          <h1 className="text-xl md:text-2xl font-bold text-white">
            ROAD GUARD
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
