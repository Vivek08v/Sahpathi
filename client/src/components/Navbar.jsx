import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

import logo from '../assets/sahpathi-logo.png';
import { GrSchedules } from "react-icons/gr";
import { GiBearFace } from "react-icons/gi";
import { FaBell } from "react-icons/fa6";
import { IoLogInOutline } from "react-icons/io5";

const Navbar = () => {
  const { user } = useSelector((state) => state.userSlice);
  console.log(user)
  // const [isLoggedIn, setIsLoggedIn] = useState(true);
  
  return (
    <div className="w-full bg-black/30 backdrop-blur-md shadow-lg border border-white/20 rounded-xl px-8 py-1 text-white">
      <div className="flex items-center justify-between">
        {/* Logo + Links */}
        <div className="flex items-center gap-12">
          <NavLink to="/">
            <img
              src={logo}
              alt="Logo"
              className="w-[120px] hover:scale-105 transition-transform duration-300"
            />
          </NavLink>

          <div className="hidden md:flex items-center gap-4">
            {['Classrooms', 'Explore', 'Schedule', 'About'].map((text) => (
              <NavLink
                key={text}
                to={`/${text.toLowerCase()}`}
                className="px-4 py-2 rounded-md text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-all duration-200"
              >
                {text}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-3 text-white/80">
          {user && <NavLink to={"/my-schedules"} className="px-3 py-2 rounded-md hover:bg-white/10 hover:text-white transition-all duration-200">
            <GrSchedules />
          </NavLink>}
          {user && <NavLink to={"/notification"} className="px-3 py-2 rounded-md hover:bg-white/10 hover:text-white transition-all duration-200">
            <FaBell />
          </NavLink>}
          {/* {isLoggedIn && <NavLink to={"/my-profile"} className="px-3 py-2 rounded-md hover:bg-white/10 hover:text-white transition-all duration-200">
            <GiBearFace onClick={()=>isLoggedIn=false}/>
          </NavLink>} */}
          {user && <GiBearFace onClick={()=>setIsLoggedIn(false)}/> }

          {!user && <NavLink to={"/login"} className="px-3 py-2 rounded-md hover:bg-white/10 hover:text-white transition-all duration-200">
            <IoLogInOutline />
          </NavLink>}
          {/* {!isLoggedIn && <NavLink to={"/signup"} className="px-3 py-2 rounded-md hover:bg-white/10 hover:text-white transition-all duration-200">
            <GiBearFace />
          </NavLink>} */}
        </div>
      </div>
    </div>
  );
};

export default Navbar;