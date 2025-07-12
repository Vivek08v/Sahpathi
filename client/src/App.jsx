import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import './App.css'

import Home from './pages/Home'
import Navbar from './components/Navbar'
import ClassRooms from './pages/ClassRooms'
import Login from './pages/Login'
import Signup from './pages/Signup'

import faceImg from './assets/home-img.jpeg'

function App() {

  return (
    <>
      <div className='min-h-screen' >
        {/* <Navbar/> */}

        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/classrooms' element={<ClassRooms/>}/>
          {/* <Route path='/explore' element={<Explore/>}/>
          <Route path='/schedule' element={<Schedule/>}/>
          <Route path='/about' element={<About/>}/>

          <Route path='/my-sessions' element={<MySessions/>}/>
          <Route path='/notification' element={<Notification/>}/>
          <Route path='/profile' element={<Profile/>}/> */}
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<Signup/>}/>
        </Routes>
      </div>
    </>
  )
}

export default App
