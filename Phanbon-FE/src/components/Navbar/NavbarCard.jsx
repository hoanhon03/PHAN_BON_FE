import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

const NavbarCard = ({
  navbar,
  isSubMenu,
  setExpanded,
  isExpanded,
  isParentActive,
}) => {
  const { pathname } = useLocation();

  return (
    <>
      <div
        onClick={() => {
          if (
            (navbar.subMenu && navbar.subMenu.length <= 0) ||
            navbar.group === null ||
            isExpanded === null ||
            isExpanded === undefined
          )
            return;
          const notActive = isExpanded.filter(
            (item) => item.belong !== navbar.group
          );
          let foundActive = isExpanded.find(
            (item) => item.belong === navbar.group
          );
          foundActive.active = !foundActive.active;
          setExpanded([...notActive, foundActive]);
        }}
      >
        <NavLink
          to={navbar.path}
          className={({ isActive }) => `
        flex items-center space-x-2 py-2  rounded-lg 
        transition-colors duration-200 group
        ${isActive ? "bg-white/20" : "hover:bg-white/20"}
        ${
          isParentActive && navbar.subMenu && navbar.subMenu.length > 0
            ? "bg-white/20 text-white"
            : "hover:bg-white/20 text-white"
        }
        ${isSubMenu ? "px-8" : "px-4"}
      `}
        >
          {({ isActive }) => (
            <>
              <span
                className={`transition-colors duration-200 ${
                  isActive ||
                  (isParentActive && navbar.subMenu && navbar.subMenu.length)
                    ? "text-white"
                    : "text-[#00400A] group-hover:text-white"
                }`}
              >
                {navbar.icon}
              </span>
              <span
                className={`transition-colors duration-200 ${
                  isActive ||
                  (isParentActive && navbar.subMenu && navbar.subMenu.length)
                    ? "text-white"
                    : "text-[#00400A] group-hover:text-white"
                }`}
              >
                {navbar.label}
              </span>
            </>
          )}
        </NavLink>
      </div>
    </>
  );
};

export default NavbarCard;
