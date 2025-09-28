import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Calendar, Search, Clock, CheckCircle, Plus } from "lucide-react";

import RoomService from "../services/RoomService";
import RoomCard from "../components/RoomCard";

const ClassRooms = () => {
  const [mainTab, setMainTab] = useState("all");
  const [subTab, setSubTab] = useState("searching");
  // const [activeTab, setActiveTab] = useState("all");
  const [allRoomsIncMine, setAllRoomsIncMine] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const getAllRooms = async () => {
    setLoading(true);
    const allRooms = await RoomService.getRoomsAPI();
    // const rooms = Object.fromEntries(
    //   Object.entries(allRooms).map(([key, arr]) => [key, arr.slice().reverse()])
    // );
    console.log(allRooms)
    setAllRoomsIncMine(allRooms);
    setLoading(false);
  };

  useEffect(() => {
    getAllRooms();
  }, []);

  const subTabs = [
    { key: "searching", label: "Searching", icon: <Search size={18} /> },
    { key: "scheduled", label: "Scheduled", icon: <Calendar size={18} /> },
    { key: "ongoing", label: "Ongoing", icon: <Clock size={18} /> },
    { key: "completed", label: "Completed", icon: <CheckCircle size={18} /> },
  ];

  return (
    <div className="w-full">
      <div className="flex justify-center gap-16 py-6 bg-gray-100">
        <button
          onClick={() => setMainTab("all")}
          className={`flex flex-col items-center text-lg font-semibold transition-colors ${
            mainTab === "all"
              ? "text-green-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Users size={28} />
          <span>All Classes</span>
        </button>
        <button
          onClick={() => setMainTab("my")}
          className={`flex flex-col items-center text-lg font-semibold transition-colors ${
            mainTab === "my"
              ? "text-green-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Calendar size={28} />
          <span>My Classes</span>
        </button>
      </div>

      <div className="flex justify-center border-b border-gray-200 bg-gray-100">
        {subTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSubTab(tab.key)}
            className={`relative px-6 py-3 text-sm font-semibold flex items-center gap-2 transition-colors ${
              subTab === tab.key
                ? "text-green-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.icon}
            {tab.label}
            {subTab === tab.key && (
              <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-green-600 rounded-t" />
            )}
          </button>
        ))}
      </div>

      <div className="absolute top-12 right-6">
        <button
          onClick={() => navigate("/classrooms/create-new-class")}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition"
        >
          <Plus size={18} />
          <span>Add New Class</span>
        </button>
      </div>

      <div className="p-6 text-gray-700">
        {loading && <div>Loading...</div>}

        {!loading && (
          <div>
            {mainTab === "my" ? (
              <div>
                <h2 className="text-xl font-semibold mb-3">
                  {subTabs.find((t) => t.key === subTab)?.label}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                  {allRoomsIncMine?.myRooms?.[capitalize(subTab)]?.length > 0 ? (
                    allRoomsIncMine.myRooms[capitalize(subTab)].map((room, i) => (
                      <RoomCard key={i} room={room} />
                    ))
                  ) : (
                    <p className="text-gray-500">
                      No {subTab} rooms
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-semibold mb-3">
                  {subTabs.find((t) => t.key === subTab)?.label}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                  {allRoomsIncMine?.allRooms?.[capitalize(subTab)]?.length > 0 ? (
                    allRoomsIncMine.allRooms[capitalize(subTab)].map((room, i) => (
                      <RoomCard key={i} room={room} />
                    ))
                  ) : (
                    <p className="text-gray-500">
                      No {subTab} rooms
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
    </div>
  );
}

export default ClassRooms;






















// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import RoomService from "../services/RoomService";
// import RoomCard from "../components/RoomCard";

// const ClassRooms = () => {
//   const [activeTab, setActiveTab] = useState("all");
//   const [allRoomsIncMine, setAllRoomsIncMine] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();

//   const getAllRooms = async () => {
//     setLoading(true);
//     const allRooms = await RoomService.getRoomsAPI();
//     // const rooms = Object.fromEntries(
//     //   Object.entries(allRooms).map(([key, arr]) => [key, arr.slice().reverse()])
//     // );
//     setAllRoomsIncMine(allRooms);
//     setLoading(false);
//   };
//   // console.log(allRooms)

//   useEffect(() => {
//     getAllRooms();
//   }, []);

//   return (
//     <div className="p-6">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold">All ClassRooms</h1>
//         <button
//           onClick={() => navigate("/classrooms/create-new-class")}
//           className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl shadow-md transition"
//         >
//           Create New Class
//         </button>
//       </div>

//       {/* Tabs */}
//       <div className="flex gap-6 border-b mb-6">
//         <button
//           onClick={() => setActiveTab("all")}
//           className={`pb-2 text-lg font-medium ${
//             activeTab === "all"
//               ? "border-b-2 border-blue-600 text-blue-600"
//               : "text-gray-600"
//           }`}
//         >
//           All Classes
//         </button>
//         <button
//           onClick={() => setActiveTab("my")}
//           className={`pb-2 text-lg font-medium ${
//             activeTab === "my"
//               ? "border-b-2 border-blue-600 text-blue-600"
//               : "text-gray-600"
//           }`}
//         >
//           My Classes
//         </button>
//       </div>

//       {loading && <div>
//         loading
//       </div>}

//       {/* Tab Content */}

//       {!loading && activeTab === "my" && (
//         <div>
//           {allRoomsIncMine && allRoomsIncMine.myRooms && Object.keys(allRoomsIncMine.myRooms).map((status, i) => (
//               <div key={i} className="mb-6">
//                 <h2 className="text-xl font-semibold mb-3">{status}</h2>
//                 <div className="flex gap-4 overflow-x-auto pb-2">
//                   {allRoomsIncMine.myRooms[status]?.length > 0 ? (
//                     allRoomsIncMine.myRooms[status].map((room, i) => <RoomCard key={i} room={room}/>)
//                   ) : (
//                     <p className="text-gray-500">
//                       No {status.toLowerCase()} rooms
//                     </p>
//                   )}
//                 </div>
//               </div>
//             )
//           )}
//         </div>
//       )}


//       {!loading && activeTab === "all" && (
//         <div>
//           {allRoomsIncMine && allRoomsIncMine?.allRooms && Object.keys(allRoomsIncMine.allRooms).map((status, i) => (
//               <div key={i} className="mb-6">
//                 <h2 className="text-xl font-semibold mb-3">{status}</h2>
//                 <div className="flex gap-4 overflow-x-auto pb-2">
//                   {allRoomsIncMine.allRooms[status]?.length > 0 ? (
//                     allRoomsIncMine.allRooms[status].map((room, i) => <RoomCard key={i} room={room}/>)
//                   ) : (
//                     <p className="text-gray-500">
//                       No {status.toLowerCase()} rooms
//                     </p>
//                   )}
//                 </div>
//               </div>
//             )
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ClassRooms;