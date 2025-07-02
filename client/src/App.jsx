import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import './App.css'

import Home from './pages/Home'
import Navbar from './components/Navbar'
import ClassRooms from './pages/ClassRooms'

import faceImg from './assets/home-img.jpeg'

function App() {

  return (
    <>
      <div className='min-h-screen p-6' >
        {/* <Navbar/> */}
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/classrooms' element={<ClassRooms/>}/>
          {/* <Route path='/explore' element={<Explore/>}/>
          <Route path='/schedule' element={<Schedule/>}/>
          <Route path='/about' element={<About/>}/>

          <Route path='/my-sessions' elements={<MySessions/>}/>
          <Route path='/notification' elements={<Notification/>}/>
          <Route path='/profile' elements={<Profile/>}/> */}
        </Routes>
      </div>
    </>
  )
}

export default App
