import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./BottomNavMenu.css"; // we'll create this next

const BottomNavMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { path: "/", text: "Home", icon: "/images/NavbarIcon1.png" },
    { path: "/about", text: "About", icon: "/images/NavbarIcon2.png" },
    { path: "/projects", text: "Projects", icon: "/images/NavbarIcon3.png" },
  ];

  return (
    <div className="bottom-nav">
      {navLinks.map((link, i) => (
        <div
          key={i}
          className={`bottom-nav-item ${
            location.pathname === link.path ? "active" : ""
          }`}
          onClick={() => navigate(link.path)}
        >
          <img src={link.icon} alt={link.text} className="bottom-nav-icon" />
          <span className="bottom-nav-text">{link.text}</span>
        </div>
      ))}
    </div>
  );
};

export default BottomNavMenu;
