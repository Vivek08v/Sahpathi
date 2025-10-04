import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import RoomService from '../services/RoomService';
import MediasoupClient from '../services/MediasoupClient';

const RoomPreview = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { roomId } = useParams();
  const { user } = useSelector((state) => state.userSlice);

  const [room, setRoom] = useState(null);
  const [peers, setPeers] = useState([]);
  const [chats, setChats] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({message: ""});
  const msgHandler = (e) => {
    const {name, value} = e.target;
    setForm((prev) => ({...prev, [name]: value}));
  }
  const submitHandler = (e) => {
    e.preventDefault();

    // send message
    MediasoupClient.sendChatMessage(form.message);

    setForm({message: ""});
  }

  const teacherJoin = () => {
    console.log("hii")
    dispatch(setRole("teacher"));
    navigate(`/room/${roomId}`);
  }

  const getRoomDetails = async() => {
    setLoading(true);
    // api call
    const room = await RoomService.getRoomAPI(roomId);
    // store room in redux -> no need by now
    console.log(room);
    setRoom(room);
    setLoading(false);
    // update useState
  }

  const chatRoomJoinHandler = async() => {
    setLoading(true);
    await MediasoupClient.joinRoomPreview(roomId, user.username, "Learner");  // Send imageuRl too
    setPage(2);
    setLoading(false);
  }

  const chatRoomLeaveHandler = async() => {
    await MediasoupClient.leaveRoomPreview();
    setPeers([]);
    setPage(1);
  }

  // useEffect(()=>{
  //   console.log(peers);
  // },[peers])

  // useEffect(()=>{
  //   console.log(chats);
  //   console.log(user)
  // },[chats])
  
  useEffect(() => {
    getRoomDetails();

    // some issue in calling this function in MediasoupClient.js -> being called multiple times
    // 1 More than org no peers in socket peers
    // 2 function being called unnecessary
    // 3 function is common for both new peer as well as existing peers
    MediasoupClient.onChatPeerJoined = (peerId, name, role, type) => {  // Get imageuRl too
      console.log("Peer joined the chat room", MediasoupClient.peerId);
      if(type==="new") toast.success(`New Peer Joined -> ${name}`)
      setPeers((prev) => ([...prev, {peerId, name, role}]))
    }

    MediasoupClient.onChatPeerClosed = (peerId) => {
      console.log("Peer left the chat room", peerId);
      setPeers((prev) => prev.filter((peer)=> peer.peerId !== peerId))
    }

    MediasoupClient.onChatMessage = ({text, sender, timestamp}) => {
      console.log("New message: ", text);
      setChats((prev) => [...prev, {message: text, sender: sender}])
    }
  }, []);

  // This can help disconnect the peer from sockin when page is refreshed
  // useEffect(() => {  
  //   const handleUnload = () => {
  //     chatRoomLeaveHandler();
  //   };

  //   window.addEventListener("beforeunload", handleUnload);

  //   return () => {
  //     window.removeEventListener("beforeunload", handleUnload);
  //     chatRoomLeaveHandler(); // still runs if React unmounts normally
  //   };
  // }, []);

  return (
    <div>
      <div>RoomPreview</div>
      {!loading &&
        <div>
          <div>Category: {room.category}</div>
          <div>Title: {room.classname}</div>
          <div>Class-Type: {room.classtype}</div>
          <div>Status: {room.status}</div>
          <div>Tags: {room.tags.map((t, i) => <span key={i}>{t} </span>)}</div>
          {page===1 && <div>
            Participants: 
              <div>
                {room.participants.map((p, i) => (
                  <div key={i}>
                    {p.user.username} {p.role}
                  </div>
                ))}
              </div>
            </div>
          }
          {page===2 && <div>
            Participants: 
              <div>
                {peers && peers.map((p, i) => (
                  <div key={i}>
                    {p.name} {p.role}
                  </div>
                ))}
              </div>
            </div>
          }
        </div>
      }

      {/* Buttons */}
      {page===1 && <div className="flex gap-3">
        <div>
          <button
            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl font-semibold transition"
            onClick={() => {chatRoomJoinHandler()}}
          >
            Join Chat
          </button>
        </div>

        {room && room.classtype === "TUTOR" && (
          <div>
            <button
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-xl font-semibold transition"
            onClick={teacherJoin}
            >
              Teach
            </button>
          </div>
        )}
      </div>}

      {page===2 && <div>
        Hi Chat...
        <div>Total peers {`-> ${peers.length}`}</div>

        <div>
          <div>Chats</div>
          <div>
            {chats && chats.map((chat, i) => (
              <div key={i} className={chat.sender.role === "Teacher" ? "bg-amber-700" : chat.sender.id === MediasoupClient.peerId ? "bg-amber-200" : "bg-green-200"}>
                {`${chat.sender.name} -> ${chat.message}`}
              </div>
            ))}
          </div>
          <form onSubmit={(e) => submitHandler(e)}>
            <input type='text' name='message' value={form.message} onChange={(e)=>msgHandler(e)}/>
            <button type='submit'>send</button>
          </form>
        </div>

        {/* Button Section */}
        <div>
          <button
            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl font-semibold transition"
            onClick={() => navigate(`/room/${roomId}`)}
          >
            Join
          </button>
          <button
            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl font-semibold transition"
            onClick={() => {chatRoomLeaveHandler()}}
          >
            Leave
          </button>
        </div>
      </div>}
    </div>
  )
}

export default RoomPreview