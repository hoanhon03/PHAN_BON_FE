import { useState } from "react";
import { CiMenuBurger } from "react-icons/ci";
import NavbarDesktop from "./NavbarDesktop";
import "./NavbarPhone.css";

const NavbarPhone = () => {
  const [isMenu, setOpenMenu] = useState(false);

  const toggleMenu = () => {
    setOpenMenu(!isMenu); // Đảo ngược trạng thái menu
  };

  const username = window.localStorage.getItem("username");

  return (
    <>
      <div className="w-full flex flex-row py-2">
        <div className="justify-center items-center p-2 w-1/12 hover:cursor-pointer z-10">
          <CiMenuBurger onClick={toggleMenu} size={40} />
        </div>
        <div className="w-9/12 ">
          <h1 className="text-2xl font-extrabold leading-tight text-center">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#00400A] to-[#32AC6D]">
              PHÂN BÓN
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#32AC6D] to-[#00400A] mt-1">
              QUÝ THÀNH
            </span>
          </h1>
        </div>
        <div className="flex justify-center items-center w-1/12 pr-4">
          <h1 className="font-bold">{username}</h1>
        </div>
      </div>

      {isMenu && (
        <div className={`fixed inset-y-0 left-0 w-full bg-white bg-opacity-50 z-50 transform transition-transform duration-[2000ms] ease-in-out ${isMenu ? 'translate-x-0' : '-translate-x-full'}`}>
          <NavbarDesktop setOpenMenu={setOpenMenu} isMenu={isMenu} />
        </div>
      )}
    </>
  );
};

export default NavbarPhone;