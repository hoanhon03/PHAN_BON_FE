import React from "react";
import useWindowsDimension from "../../hooks/useWindowsDimension";
import NavbarPhone from "./NavbarPhone";
import NavbarDesktop from "./NavbarDesktop";

const Navbar = () => {
  const phoneWidthSize = 900;
  const { width } = useWindowsDimension();
  console.log(width);
  return width > phoneWidthSize ? (
    <NavbarDesktop />
  ) : (
    <>
      <NavbarPhone />
    </>
  );
};

export default Navbar;
