import React from "react";
import { useNavigate } from "react-router-dom";

const getColor = {
  Ongoing: "bg-green-400",
  Completed: "bg-blue-400",
  Scheduled: "bg-yellow-400",
  Searching: "bg-purple-400",
  Cancelled: "bg-red-400",
};

const RoomCard = ({ room }) => {
  const navigate = useNavigate();

  const enterRoomPreview = () => {
    navigate(`/room/preview/${room.classId}`)
  }

  return (
    <div onClick={enterRoomPreview}
      className={`shadow-lg rounded-3xl overflow-hidden min-w-[200px] max-w-[260px] cursor-pointer transform transition hover:scale-105 hover:shadow-2xl`}
    >
      {/* Image with gradient overlay */}
      <div className="relative">
        <img
          src="https://placehold.co/400x200/png"
          alt="Classroom"
          className="w-full h-44 object-cover"
        />
        <span
          className={`${getColor[room.status] || "bg-gray-400"} absolute top-3 left-3 px-3 py-1 rounded-full text-white font-semibold text-sm shadow-md`}
        >
          {room.status}
        </span>
      </div>

      <div className="p-4 bg-white">
        <h3 className="text-lg font-bold mb-2">{room.classname}</h3>

        <div className="text-sm text-gray-600 space-y-1 mb-4">
          <p>
            Category: <span className="font-medium">{room.category || "N/A"}</span>
          </p>
          <p>
            Type: <span className="font-medium">{room.classtype || "N/A"}</span>
          </p>
          <p>
            Peoples Joined: <span className="font-medium">{room.participants.size || "0"}</span>
          </p>
        </div>

      </div>
    </div>
  );
};

export default RoomCard;



















// import React from 'react'
// import { useNavigate } from 'react-router-dom';

// const getColor = {
//     Ongoing : "bg-green-400",
//     Completed : "bg-green-400",
// }
// const RoomCard = ({room}) => {
//     const navigate = useNavigate();

//     return (
//         <div
//           className={`${getColor[room.status]} shadow-md rounded-2xl overflow-hidden min-w-[250px] max-w-[280px] 
//           cursor-pointer transform transition hover:scale-105 hover:shadow-xl`}
//         >
//           <img
//             src="https://placehold.co/400x200/png" // dummy image
//             alt="Classroom"
//             className="w-full h-40 object-cover"
//           />
//           <div className="p-4">
//             <div>
//                 <h3 className="text-lg font-semibold">{room.classname}</h3>
//                 <p className="text-sm text-gray-600">
//                   Status: <span className="font-medium">{room.status}</span>
//                 </p>
//                 <p className="text-sm text-gray-600">
//                   Category: {room.category || "N/A"}
//                 </p>
//                 <p className="text-sm text-gray-600">
//                   Type: {room.classtype || "N/A"}
//                 </p>
//             </div>
//             <div className='flex gap-2'>
//                 <button className='bg-green-400'
//                 onClick={() => navigate(`/room/${room.classId}`)}>Join</button>

//                 {room.classtype=="TUTOR" &&
//                     <button className='bg-green-400'
//                     onClick={() => navigate(`/room/${room.classId}`)}>Teach</button>
//                 }
//             </div>
//           </div>
//         </div>
//     )
// }

// export default RoomCard;