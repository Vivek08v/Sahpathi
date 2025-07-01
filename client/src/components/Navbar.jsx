import React from 'react'
import { NavLink } from 'react-router-dom'

import logo from '../assets/sahpathi-logo.png'

const Navbar = () => {
  return (
    <div className='w-full h-10 font-[20px] flex justify-around items-center bg-green-50 py-4'>
        <div className='flex justify-around items-center gap-2'>
            <div>
                <NavLink to={'/'}>
                    <img src={logo} width={160} height={32}></img>
                </NavLink>
            </div>
            <div>
                <NavLink to={'/classrooms'}>ClassRooms</NavLink>
            </div>
            <div>
                <NavLink to={'/explore'}>Explore</NavLink>
            </div>
            <div>
                <NavLink to={'/schedule'}>Schedule</NavLink>
            </div>
            <div>
                <NavLink to={'/about'}>About</NavLink>
            </div>
        </div>
        <div className='flex justify-around items-center gap-2'>
            <div>My Session</div>
            <div>Notification</div>
            <div>Profile</div>
        </div>
    </div>
    
  )
}

export default Navbar