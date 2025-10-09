import { useState, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { Route, Routes } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux"
import { setInitialized } from './redux/slices/userSlice'
import './App.css'

import Home from './pages/Home'
import ClassRooms from './pages/ClassRooms'
import Login from './pages/Login'
import Signup from './pages/Signup'
import MediasoupClient from './services/MediasoupClient'
import Room from './pages/Room'
import { initAuth } from './services/operations/auth.service'
import ProtectedRoute from './components/ProtectedRoute'
import CreateClass from './components/CreateClass'
import RoomPreview from './pages/RoomPreview'
import { Profile } from './pages/Profile'

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, isInitialized} = useSelector((state)=> state.userSlice)
  // const [isInitialized, setIsInitialized] = useState(false);
  // const [user, setUser] = useState(()=> {
  //   const savedUser = localStorage.getItem('user')
  //   return savedUser ? JSON.parse(savedUser) : null
  // })

  // const handleSetUser = (userData) => {
  //   localStorage.setItem('user', JSON.stringify(userData))
  //   setUser(userData)
  // }

  useEffect(()=> {
    dispatch(initAuth());
  }, [isAuthenticated])

  useEffect(() => {
    const initMediasoup = async() => {
      try{
        await MediasoupClient.init();
        console.log("set Initialised")
        dispatch(setInitialized(true));
      }
      catch(error){
        console.error('Error in Initialising mediasoup client: ', error);
      }
    }

    if(isAuthenticated) initMediasoup();
  }, [isAuthenticated])

  if (!isInitialized && isAuthenticated) {
    return <div>Connecting to signaling server...</div>;
  }

  return (
    <>
      <div className='min-h-screen' >
        {/* <Header user={user} setUser={handleSetUser} /> */}
        {/* <Navbar/> */}

        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/classrooms' element={<ProtectedRoute> <ClassRooms/> </ProtectedRoute>}/>
          {/* <Route path='/explore' element={<Explore/>}/>
          <Route path='/schedule' element={<Schedule/>}/>
          <Route path='/about' element={<About/>}/>*/}

          <Route path='/classrooms/create-new-class' element={<ProtectedRoute> <CreateClass/> </ProtectedRoute>}/>

          {/* <Route path='/my-sessions' element={<MySessions/>}/>
          <Route path='/notification' element={<Notification/>}/>
          <Route path='/profile' element={<Profile/>}/> */}
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/profile/:userId' element={<ProtectedRoute> <Profile/> </ProtectedRoute>}/>

          <Route path='/room/preview/:roomId' element={<ProtectedRoute> <RoomPreview/> </ProtectedRoute>}/>
          <Route path='/room/:roomId' element={<ProtectedRoute> <Room/> </ProtectedRoute>}/>
        </Routes>
      </div>

      <>
        <Toaster position="top-right" reverseOrder={false} />
      </>
    </>
  )
}

export default App
