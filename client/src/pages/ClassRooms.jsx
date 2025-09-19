import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RoomService from "../services/RoomService";
import RoomCard from "../components/RoomCard";

const ClassRooms = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [allRooms, setAllRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const getAllRooms = async () => {
    setLoading(true);
    const allRooms = await RoomService.getRoomsAPI();
    const rooms = Object.fromEntries(
      Object.entries(allRooms).map(([key, arr]) => [key, arr.slice().reverse()])
    );
    setAllRooms(rooms);
    setLoading(false);
  };

  useEffect(() => {
    getAllRooms();
  }, []);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All ClassRooms</h1>
        <button
          onClick={() => navigate("/classrooms/create-new-class")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl shadow-md transition"
        >
          Create New Class
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b mb-6">
        <button
          onClick={() => setActiveTab("all")}
          className={`pb-2 text-lg font-medium ${
            activeTab === "all"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600"
          }`}
        >
          All Classes
        </button>
        <button
          onClick={() => setActiveTab("my")}
          className={`pb-2 text-lg font-medium ${
            activeTab === "my"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600"
          }`}
        >
          My Classes
        </button>
      </div>

      {loading && <div>
        loading
      </div>}

      {/* Tab Content */}
      {!loading && activeTab === "my" && (
        <div>
          <h2 className="text-xl font-semibold mb-3">My Rooms</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {allRooms["MyRooms"]?.length > 0 ? (
              allRooms["MyRooms"].map((room, i) => <RoomCard key={i} room={room}/> )
            ) : (
              <p className="text-gray-500">No rooms yet</p>
            )}
          </div>
        </div>
      )}

      {!loading && activeTab === "all" && (
        <div>
          {Object.keys(allRooms).map((status, i) =>
            status !== "MyRooms" && (
              <div key={i} className="mb-6">
                <h2 className="text-xl font-semibold mb-3">{status}</h2>
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {allRooms[status]?.length > 0 ? (
                    allRooms[status].map((room, i) => <RoomCard key={i} room={room}/>)
                  ) : (
                    <p className="text-gray-500">
                      No {status.toLowerCase()} rooms
                    </p>
                  )}
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default ClassRooms;



















// import React, { useEffect, useState } from 'react'
// import {useNavigate} from 'react-router-dom';
// import RoomService from '../services/RoomService';
// import { useSelector } from 'react-redux';

// const ClassRooms = () => {
//   const [title, setTitle] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [allRooms, setAllRooms] = useState([]);
//   const [error, setError] = useState('');
//   const {user} = useSelector((state)=> state.userSlice)

//   const navigate = useNavigate();
  
//   const getAllRooms = async() => {
//     setLoading(true);
//     const allRooms = await RoomService.getRoomsAPI();
//     setAllRooms(allRooms);
//     console.log(allRooms);
//     setLoading(false);
//   }

//   useEffect(()=> {
//     getAllRooms();
//   }, [])

//   return (
//     <div>
//         <div>
//           ClassRooms
//           <button onClick={()=>navigate("/classrooms/create-new-class")}>Create New ClassRoom</button>
//         </div>

//         {/*Classes*/}
//         <div>
//           <div>
//             <div>My Rooms</div>
//             <div>
//               {allRooms && allRooms["MyRooms"]?.map((room, i) => (
//                 <div key={i} onClick={()=>navigate(`/room/${room.classId}`)}>
//                   {room.classname} {"--->"} {room.status}
//                 </div>
//               ))}
//             </div>
//           </div>
          
//           <div>
//             {Object.keys(allRooms).map((status, i) => (
//               status !== "MyRooms" ?
//               <div key={i}>
//                 <div>{status}</div>
//                 <div>
//                   {allRooms && allRooms[status]?.map((room, i) => (
//                     <div key={i} onClick={()=>navigate(`/room/${room.classId}`)}>
//                       {room.classname} {"--->"} {room.status}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//               : null
//             ))}
//           </div>
//         </div>
//     </div>
//   )
// }

// export default ClassRooms






















// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import RoomService from "../services/RoomService";
// import { useSelector } from "react-redux";

// const ClassRooms = () => {
//   const [activeTab, setActiveTab] = useState("all"); // "all" | "my"
//   const [allRooms, setAllRooms] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const { user } = useSelector((state) => state.userSlice);

//   const navigate = useNavigate();

//   const getAllRooms = async () => {
//     setLoading(true);
//     const allRooms = await RoomService.getRoomsAPI();
//     setAllRooms(allRooms);
//     setLoading(false);
//   };

//   useEffect(() => {
//     getAllRooms();
//   }, []);

//   return (
//     <div style={{ padding: "20px" }}>
//       {/* Header */}
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//         <h1>All ClassRooms</h1>
//         <button onClick={() => navigate("/classrooms/create-new-class")}>
//           Create New ClassRoom
//         </button>
//       </div>

//       {/* Tabs */}
//       <div style={{ marginTop: "20px", marginBottom: "20px", display: "flex", gap: "20px" }}>
//         <button
//           onClick={() => setActiveTab("all")}
//           style={{
//             borderBottom: activeTab === "all" ? "2px solid black" : "2px solid transparent",
//             padding: "10px",
//             cursor: "pointer",
//             background: "none",
//           }}
//         >
//           All Classes
//         </button>
//         <button
//           onClick={() => setActiveTab("my")}
//           style={{
//             borderBottom: activeTab === "my" ? "2px solid black" : "2px solid transparent",
//             padding: "10px",
//             cursor: "pointer",
//             background: "none",
//           }}
//         >
//           My Classes
//         </button>
//       </div>

//       {/* Tab Content */}
//       <div>
//         {activeTab === "my" && (
//           <div>
//             <h2>My Rooms</h2>
//             <div style={{ display: "flex", gap: "15px", overflowX: "auto", padding: "10px 0" }}>
//               {allRooms["MyRooms"]?.length > 0 ? (
//                 allRooms["MyRooms"].map((room, i) => (
//                   <div
//                     key={i}
//                     onClick={() => navigate(`/room/${room.classId}`)}
//                     style={{
//                       border: "1px solid #ccc",
//                       padding: "15px",
//                       minWidth: "200px",
//                       cursor: "pointer",
//                     }}
//                   >
//                     {room.classname} {"--->"} {room.status}
//                   </div>
//                 ))
//               ) : (
//                 <p>No rooms yet</p>
//               )}
//             </div>
//           </div>
//         )}

//         {activeTab === "all" && (
//           <div>
//             {Object.keys(allRooms).map(
//               (status, i) =>
//                 status !== "MyRooms" && (
//                   <div key={i} style={{ marginBottom: "20px" }}>
//                     <h2>{status}</h2>
//                     <div style={{ display: "flex", gap: "15px", overflowX: "auto", padding: "10px 0" }}>
//                       {allRooms[status]?.length > 0 ? (
//                         allRooms[status].map((room, j) => (
//                           <div
//                             key={j}
//                             onClick={() => navigate(`/room/${room.classId}`)}
//                             style={{
//                               border: "1px solid #ccc",
//                               padding: "15px",
//                               minWidth: "200px",
//                               cursor: "pointer",
//                             }}
//                           >
//                             {room.classname} {"--->"} {room.status}
//                           </div>
//                         ))
//                       ) : (
//                         <p>No {status.toLowerCase()} rooms</p>
//                       )}
//                     </div>
//                   </div>
//                 )
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ClassRooms;