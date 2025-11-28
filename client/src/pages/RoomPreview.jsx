import { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';
import Avatar from "@mui/material/Avatar";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  Send, 
  Users, 
  MessageSquare, 
  Info, 
  Video, 
  LogOut,
  CalendarDays
} from 'lucide-react';

// Mock Services (Replace with your actual imports)
import RoomService from '../services/RoomService';
import MediasoupClient from '../services/MediasoupClient';
// import { setRole } from '../redux/slices/roomSlice'; // Example action

const RoomPreview = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { roomId } = useParams();
  const { user } = useSelector((state) => state.userSlice);

  const [room, setRoom] = useState(null);
  const [peers, setPeers] = useState([]);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeAndDate, setTimeAndDate] = useState("");
  const [schedulerWindow, setSchedulerWindow] = useState(false);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'participants' | 'details'
  const chatEndRef = useRef(null);

  const [form, setForm] = useState({ message: "" });
  const [countdown, setCountdown] = useState(null);

  // --- Handlers ---

  const msgHandler = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!form.message.trim()) return;
    MediasoupClient.sendChatMessage(form.message);
    setForm({ message: "" });
  };

  const joinClass = () => {
    let currTime = new Date().toISOString();
    if (room.schedule?.startedAt && currTime >= room.schedule.startedAt) {
      navigate(`/room/${roomId}`);
    } else if (room.schedule) {
      toast("Class hasn't started yet.", { icon: "⏳" });
      console.log("Wait till :", room.schedule.startedAt);
    } else {
      toast.error("Room not scheduled yet");
    }
  };

  const getRoomDetails = async () => {
    setLoading(true);
    try {
      const roomData = await RoomService.getRoomAPI(roomId);
      setRoom(roomData);
    } catch (error) {
      toast.error("Failed to load room");
    } finally {
      setLoading(false);
    }
  };

  const chatRoomLeaveHandler = async () => {
    await MediasoupClient.leaveRoomPreview();
    setPeers([]);
    navigate('/classrooms'); // Or wherever back takes them
  };

  const scheduleTimeAndDate = async () => {
    const payload = { timeAndDate, roomId: room._id };
    const response = await RoomService.scheduleRoomAPI(payload);
    setRoom(prev => ({ ...prev, schedule: response.schedule }));
    setSchedulerWindow(false);
    toast.success("Class Scheduled!");
  };

  // --- Effects ---

  useEffect(() => {
    getRoomDetails();

    MediasoupClient.onChatPeerJoined = (peerId, userDetail, role, type) => {
      if (type === "new") toast.success(`${userDetail.fullname} joined the lobby`);
      setPeers((prev) => [...prev, { peerId, userDetail, role }]);
    };

    MediasoupClient.onChatPeerClosed = (peerId) => {
      setPeers((prev) => prev.filter((peer) => peer.peerId !== peerId));
    };

    MediasoupClient.onChatMessage = ({ text, sender }) => {
      setChats((prev) => [...prev, { message: text, sender }]);
    };
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  useEffect(() => {
    const func = async() => {
      const currUser = {
        fullname: user.fullname,
        userId: user._id,
        username: user.username
      };
      await MediasoupClient.joinRoomPreview(roomId, currUser, "Learner");
    }

    func();
  },[])

  // Countdown Logic
  useEffect(() => {
    if (!room?.schedule?.startedAt) return;
    const interval = setInterval(() => {
      const target = new Date(room.schedule.startedAt).getTime();
      const now = Date.now();
      const diff = target - now;
      console.log(target);
      console.log(now)
      console.log(diff)
      if (diff <= 0) return setCountdown("Live Now");
      
      const hrs = Math.floor(diff / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setCountdown(`${hrs}h ${mins}m ${secs}s`);
    }, 1000);
    return () => clearInterval(interval);
  }, [room]);

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-slate-50 text-slate-500">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-12 w-12 bg-slate-200 rounded-full mb-4"></div>
        <p>Loading Class Details...</p>
      </div>
    </div>
  );

  if (!room) return <div className="text-center mt-20">Room not found.</div>;

  const isTeacher = room.createdBy._id === user._id;

  return (
    <div className="w-full min-h-screen bg-slate-50 p-4 md:p-8 flex justify-center">
      
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6 h-[85vh]">
        
        {/* LEFT COLUMN: Room Details (Takes up 2 cols on large screens) */}
        <div className="lg:col-span-2 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
          
          {/* Header Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-start">
              <div>
                <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide">
                  {room.category}
                </span>
                <h1 className="text-3xl font-bold text-slate-800 mt-2">{room.classname}</h1>
                <p className="text-slate-500 mt-1 flex items-center gap-2">
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-mono">ID: {roomId}</span>
                  <span>•</span>
                  <span>{room.classtype}</span>
                </p>
              </div>
              {room.schedule?.startedAt && (
                <div className="text-right hidden sm:block">
                   <div className="text-xs text-slate-400 uppercase font-semibold">Starts In</div>
                   <div className="text-2xl font-mono text-indigo-600 font-bold">{countdown || "--:--:--"}</div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mt-6 text-slate-600 leading-relaxed">
              {room.description || "No description provided for this class."}
            </div>

            {/* Tags */}
            <div className="mt-6 flex flex-wrap gap-2">
              {room.tags.map((t, i) => (
                <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-medium hover:bg-slate-200 transition-colors">
                  #{t}
                </span>
              ))}
            </div>
          </div>

          {/* Teacher Info */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
             <Avatar src={room.createdBy.avatar} sx={{ width: 64, height: 64 }} />
             <div>
                <h3 className="text-lg font-bold text-slate-800">{room.createdBy.username}</h3>
                <p className="text-slate-500 text-sm">Host & Instructor</p>
             </div>
             {isTeacher && (
               <button 
                 onClick={() => setSchedulerWindow(true)}
                 className="ml-auto flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-lg font-medium transition-colors"
               >
                 <CalendarDays size={18} />
                 Schedule
               </button>
             )}
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Panel (Chat/Participants) */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden h-full">
          
          {/* Custom Tabs */}
          <div className="flex border-b border-slate-100">
            <button 
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-4 text-sm font-semibold flex justify-center items-center gap-2 transition-colors ${activeTab === 'chat' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <MessageSquare size={18} /> Chat
            </button>
            <button 
              onClick={() => setActiveTab('participants')}
              className={`flex-1 py-4 text-sm font-semibold flex justify-center items-center gap-2 transition-colors ${activeTab === 'participants' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Users size={18} /> People <span className="bg-slate-100 text-xs py-0.5 px-1.5 rounded-full text-slate-500">{peers.length}</span>
            </button>
          </div>

          {/* CHAT VIEW */}
          {activeTab === 'chat' && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
                {chats.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm">
                    <MessageSquare size={32} className="mb-2 opacity-20" />
                    <p>Say hello to the class!</p>
                  </div>
                )}
                {chats.map((chat, i) => {
                  const isMe = chat.sender.id === user._id; // Assuming user._id is available
                  const isHost = chat.sender.role === "Teacher";
                  
                  return (
                    <div key={i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <div className="flex items-end gap-2 max-w-[85%]">
                        {!isMe && <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>{chat.sender.name[0]}</Avatar>}
                        <div className={`px-4 py-2 rounded-2xl text-sm ${
                          isMe 
                            ? 'bg-indigo-600 text-white rounded-br-none' 
                            : isHost 
                              ? 'bg-amber-100 text-amber-900 border border-amber-200 rounded-bl-none'
                              : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none'
                        }`}>
                          {chat.message}
                        </div>
                      </div>
                      {!isMe && <span className="text-[10px] text-slate-400 ml-9 mt-1">{chat.sender.name}</span>}
                    </div>
                  );
                })}
                <div ref={chatEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-3 bg-white border-t border-slate-100">
                <form onSubmit={submitHandler} className="flex gap-2">
                  <input
                    type="text"
                    name="message"
                    value={form.message}
                    onChange={msgHandler}
                    placeholder="Type a message..."
                    className="flex-1 bg-slate-100 border-transparent focus:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 rounded-xl px-4 py-2.5 text-sm transition-all outline-none"
                  />
                  <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-xl transition-colors">
                    <Send size={18} />
                  </button>
                </form>
              </div>
            </>
          )}

          {/* PARTICIPANTS VIEW */}
          {activeTab === 'participants' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
               {/* Show Host First */}
               <div className="flex items-center gap-3 p-3 bg-amber-50/50 border border-amber-100 rounded-xl">
                 <Avatar src={room.createdBy.avatar} />
                 <div>
                   <div className="font-semibold text-slate-800 text-sm">{room.createdBy.username}</div>
                   <div className="text-xs text-amber-600 font-medium">Host</div>
                 </div>
               </div>
               
               {/* Other Peers */}
               {peers.map((p, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors">
                    <Avatar>{p.userDetail.fullname[0]}</Avatar>
                    <div>
                      <div className="font-semibold text-slate-700 text-sm">{p.userDetail.fullname}</div>
                      <div className="text-xs text-slate-400">{p.role}</div>
                    </div>
                  </div>
               ))}
            </div>
          )}

          {/* FIXED BOTTOM ACTIONS */}
          <div className="p-4 bg-white border-t border-slate-200 flex flex-col gap-2">
            <button 
              onClick={joinClass}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold shadow-md shadow-indigo-200 transition-all flex justify-center items-center gap-2"
            >
              <Video size={20} /> Join Class
            </button>
            <button 
              onClick={chatRoomLeaveHandler}
              className="w-full text-slate-500 hover:text-red-500 hover:bg-red-50 py-2 rounded-xl text-sm font-medium transition-colors flex justify-center items-center gap-2"
            >
              <LogOut size={16} /> Leave Lobby
            </button>
          </div>

        </div>
      </div>

      {/* SCHEDULER MODAL */}
      {schedulerWindow && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Calendar size={20} className="text-indigo-600"/> Schedule Class
              </h3>
              <button onClick={() => setSchedulerWindow(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Select Date & Time</label>
            <input
              type="datetime-local"
              value={timeAndDate}
              onChange={(e) => setTimeAndDate(e.target.value)}
              className="w-full border border-slate-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none mb-6"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setSchedulerWindow(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={scheduleTimeAndDate}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-medium shadow-lg shadow-indigo-200 transition-colors"
              >
                Save Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomPreview;
















// import React, { useEffect, useState } from 'react';
// import toast from 'react-hot-toast';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate, useParams } from 'react-router-dom';
// import RoomService from '../services/RoomService';
// import MediasoupClient from '../services/MediasoupClient';

// const RoomPreview = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const { roomId } = useParams();
//   const { user } = useSelector((state) => state.userSlice);

//   const [room, setRoom] = useState(null);
//   const [peers, setPeers] = useState([]);
//   const [chats, setChats] = useState([]);
//   const [page, setPage] = useState(1);
//   const [loading, setLoading] = useState(true);
//   const [timeAndDate, setTimeAndDate] = useState("");
//   const [schedulerWindow, setSchedulerWindow] = useState(false);

//   const [form, setForm] = useState({message: ""});
//   const msgHandler = (e) => {
//     const {name, value} = e.target;
//     setForm((prev) => ({...prev, [name]: value}));
//   }
//   const submitHandler = (e) => {
//     e.preventDefault();

//     // send message
//     MediasoupClient.sendChatMessage(form.message);

//     setForm({message: ""});
//   }

//   const joinClass = () => {
//     let currTime = new Date();
//     currTime = currTime.toISOString();
//     if(room.schedule?.startedAt && currTime >= room.schedule.startedAt){
//       console.log(currTime," ", room.schedule.startedAt);
//       navigate(`/room/${roomId}`)
//     }
//     if(room.schedule){
//       console.log("Wait till :", room.schedule.startedAt);
//     }
//     else{
//       console.log("Schedule the room first");
//     }
//   }

//   const teacherJoin = () => {
//     console.log("hii")
//     dispatch(setRole("teacher"));
//     navigate(`/room/${roomId}`);
//   }

//   const getRoomDetails = async() => {
//     setLoading(true);
//     // api call
//     const room = await RoomService.getRoomAPI(roomId);
//     // store room in redux -> no need by now
//     console.log(room);
//     setRoom(room);
//     setLoading(false);
//     // update useState
//   }

//   const chatRoomJoinHandler = async() => {
//     setLoading(true);
//     const currUser = {"fullname": user.fullname, "userId": user._id, "username": user.username}
//     await MediasoupClient.joinRoomPreview(roomId, currUser, "Learner");  // Send imageuRl too
//     setPage(2);
//     setLoading(false);
//   }

//   const chatRoomLeaveHandler = async() => {
//     await MediasoupClient.leaveRoomPreview();
//     setPeers([]);
//     setPage(1);
//   }

//   const scheduleTimeAndDate = async() => {
//     // schedule API call
//     const payload = {
//       timeAndDate,
//       roomId : room._id
//     }
//     const response = await RoomService.scheduleRoomAPI(payload);
//     console.log("Room Scheduled at: ",response);
//     setRoom(prev => ({...prev, schedule: response.schedule}));
//   }

//   // useEffect(()=>{
//   //   console.log(peers);
//   // },[peers])

//   // useEffect(()=>{
//   //   console.log(chats);
//   //   console.log(user)
//   // },[chats])
  
//   useEffect(() => {
//     getRoomDetails();

//     // some issue in calling this function in MediasoupClient.js -> being called multiple times
//     // 1 More than org no peers in socket peers
//     // 2 function being called unnecessary
//     // 3 function is common for both new peer as well as existing peers
//     MediasoupClient.onChatPeerJoined = (peerId, userDetail, role, type) => {  // Get imageuRl too
//       console.log("Peer joined the chat room", MediasoupClient.peerId);
//       console.log(userDetail)
//       if(type==="new") toast.success(`New Peer Joined -> ${userDetail.fullname}`)
//       setPeers((prev) => ([...prev, {peerId, userDetail, role}]))
//     }

//     MediasoupClient.onChatPeerClosed = (peerId) => {
//       console.log("Peer left the chat room", peerId);
//       setPeers((prev) => prev.filter((peer)=> peer.peerId !== peerId))
//     }

//     MediasoupClient.onChatMessage = ({text, sender, timestamp}) => {
//       console.log("New message: ", text);
//       setChats((prev) => [...prev, {message: text, sender: sender}])
//     }
//   }, []);

//   // This can help disconnect the peer from sockin when page is refreshed
//   // useEffect(() => {  
//   //   const handleUnload = () => {
//   //     chatRoomLeaveHandler();
//   //   };

//   //   window.addEventListener("beforeunload", handleUnload);

//   //   return () => {
//   //     window.removeEventListener("beforeunload", handleUnload);
//   //     chatRoomLeaveHandler(); // still runs if React unmounts normally
//   //   };
//   // }, []);

//   return (
//     <div>
//       <div>RoomPreview</div>
//       {!loading &&
//         <div>
//           <div>Category: {room.category}</div>
//           <div>Title: {room.classname}</div>
//           <div>Class-Type: {room.classtype}</div>
//           <div>Status: {room.status}</div>
//           <div>Tags: {room.tags.map((t, i) => <span key={i}>{t} </span>)}</div>
//           {page===1 && <div>
//             Participants: 
//               <div>
//                 {room.participants.map((p, i) => (
//                   <div key={i}>
//                     {p.user.username} {p.role}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           }
//           {page===2 && <div>
//             Participants: 
//               <div>
//                 {peers && peers.map((p, i) => (
//                   <div key={i}>
//                     {p.userDetail.name} {p.role}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           }
//         </div>
//       }

//       {/* Buttons */}
//       {page===1 && <div className="flex gap-3">
//         <div>
//           <button
//             className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl font-semibold transition"
//             onClick={() => {chatRoomJoinHandler()}}
//           >
//             Join Chat
//           </button>
//         </div>

//         {room && room.classtype === "TUTOR" && (
//           <div>
//             <button
//             className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-xl font-semibold transition"
//             onClick={teacherJoin}
//             >
//               Teach
//             </button>
//           </div>
//         )}
//       </div>}

//       {page===2 && <div>
//         Hi Chat...
//         <div>Total peers {`-> ${peers.length}`}</div>

//         <div>
//           <div>Chats</div>
//           <div>
//             {chats && chats.map((chat, i) => (
//               <div key={i} className={chat.sender.role === "Teacher" ? "bg-amber-700" : chat.sender.id === MediasoupClient.peerId ? "bg-amber-200" : "bg-green-200"}>
//                 {`${chat.sender.name} -> ${chat.message}`}
//               </div>
//             ))}
//           </div>
//           <form onSubmit={(e) => submitHandler(e)}>
//             <input type='text' name='message' value={form.message} onChange={(e)=>msgHandler(e)}/>
//             <button type='submit'>send</button>
//           </form>
//         </div>

//         {/* Button Section */}
//         <div>
//           <button
//             className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl font-semibold transition"
//             onClick={joinClass}
//           >
//             Join
//           </button>
//           <button
//             className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl font-semibold transition"
//             onClick={() => {chatRoomLeaveHandler()}}
//           >
//             Leave
//           </button>
//           {/*<button
//             className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl font-semibold transition"
//             onClick={() => {}}
//           >
//             Remind Me (Store room in Redux)
//           </button>*/}
//           {room.createdBy._id === user._id && <button
//             className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl font-semibold transition"
//             onClick={() => {setSchedulerWindow(prev => !prev)}}
//           >
//             Schedule
//           </button>}
//         </div>

//       </div>}


//       {schedulerWindow && <div>
//         <div className="flex flex-col gap-1">
//           <label className="text-sm text-gray-700">Select Date & Time</label>
//           <input
//             type="datetime-local"
//             value={timeAndDate}
//             onChange={(e) => setTimeAndDate(e.target.value)}
//             className="border px-3 py-2 rounded-md shadow-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
//           />
//           <button onClick={scheduleTimeAndDate}>Set</button>
//         </div>
//       </div>}

//     </div>
//   )
// }

// export default RoomPreview