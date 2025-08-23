import { useState, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import './App.css'

import Home from './pages/Home'
import Navbar from './components/Navbar'
import ClassRooms from './pages/ClassRooms'
import Login from './pages/Login'
import Signup from './pages/Signup'
import MediasoupClient from './services/MediasoupClient'

import faceImg from './assets/home-img.jpeg'
import { Room } from './pages/Room'

function App() {

  const [isInitialized, setIsInitialized] = useState(false);
  const [user, setUser] = useState(()=> {
    const savedUser = localStorage.getItem('user')
    return savedUser ? JSON.parse(savedUser) : null
  })

  useEffect(() => {
    const initMediasoup = async() => {
      try{
        await MediasoupClient.init()
        setIsInitialized(true);
      }
      catch(error){
        console.error('Error in Initialising mediasoup client: ', error);
      }
    }

    initMediasoup();
  }, [])

  const handleSetUser = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  return (
    <>
      <div className='min-h-screen' >
        {/* <Header user={user} setUser={handleSetUser} /> */}
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

          <Route path='/room/:roomId' element={<Room/>}/>
        </Routes>
      </div>
    </>
  )
}

export default App
