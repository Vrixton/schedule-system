import React from "react";
import { LANG } from "../../locales/en";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-900 p-4 shadow-md">
      <h1 className="text-white text-xl font-bold">{ LANG.appTitle }</h1>
    </nav>
  );
};

export default Navbar;
