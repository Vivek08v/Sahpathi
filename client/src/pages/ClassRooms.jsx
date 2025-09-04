import React, { useEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom';
import RoomService from '../services/RoomService';

const ClassRooms = ({user}) => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [allRooms, setAllRooms] = useState([]);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!title.trim()){
      setError('Please enter room title');
      return;
    }
    
    setLoading(true);
    try{
      const user = {id:1, name: "vivek"}
      // console.log("hii1", user)
      const room = await RoomService.createRoomAPI(title, user);
      console.log(room)
      setLoading(false);
      navigate(`/room/${room.classId}`);
    }
    catch(error){
      console.log('Error creating room: ', error);
      setError('failed to create room, please try again!!');
      setLoading(false);
    }
  }

  
  const getAllRooms = async() => {
    setLoading(true);
    const allRooms = await RoomService.getRoomsAPI();
    // allRooms(allRooms);
    console.log(allRooms);
    setLoading(false);
  }

  useEffect(()=> {
    getAllRooms();
  }, [])

  return (
    <div>
        ClassRooms
        {error ?? 'Error'}
        <form onSubmit={handleSubmit}>
          <input type='text' id='title' placeholder='roomName'
            value={title}
            onChange={(e)=> setTitle(e.target.value)}
            required
          />
          <button
            type='submit'>
            {loading ? 'Creating Room': 'Create Room'}
          </button>
        </form>
    </div>
  )
}

export default ClassRooms