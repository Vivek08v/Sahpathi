import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import RoomService from '../services/RoomService';

const RoomPreview = () => {
  const [room, setRoom] = useState("");
  const { roomId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  console.log(roomId)

  const teacherJoin = () => {
    console.log("hii")
    dispatch(setRole("teacher"));
    navigate(`/room/${roomId}`);
  }

  const getRoomDetails = async() => {
    // api call
    const room = await RoomService.getRoomAPI(roomId);
    // store room in redux -> no need by now
    console.log(room);
    setRoom(room);
    // update useState
  }

  useEffect(() => {
    getRoomDetails();
  }, []);

  return (
    <div>
      <div>RoomPreview</div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl font-semibold transition"
          onClick={() => navigate(`/room/${roomId}`)}
        >
          Join
        </button>
        {room.classtype === "TUTOR" && (
          <button
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-xl font-semibold transition"
            onClick={teacherJoin}
          >
            Teach
          </button>
        )}
      </div>
    </div>
  )
}

export default RoomPreview