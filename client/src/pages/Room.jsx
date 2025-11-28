import React, { useEffect, useRef, useState } from "react";
import { BsFillMicMuteFill, BsFillMicFill } from "react-icons/bs";
import { FaVideo, FaVideoSlash, FaTimes } from "react-icons/fa";
import toast from 'react-hot-toast';
import VideoPlayer from "../components/VideoPlayer";
import MediasoupClient from "../services/MediasoupClient";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { roomSlice } from "../redux/slices/roomSlice";
import Chatbox from "../components/Chatbox";
import ProfilePopUp from "../components/ProfilePopUp";
import ParticipantsList from "../components/ParticipantsList";

const Room = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState({});
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [peersVideoOn, setIsPeersVideoOn] = useState(null);
  const { user } = useSelector((state) => state.userSlice);
  const [activePeerId, setActivePeerId] = useState(null);

  const [showChat, setShowChat] = useState(true);
  const [showParticipants, setShowParticipants] = useState(true);



  const localStreamRef = useRef(null);

  const { isInitialized} = useSelector((state)=> state.userSlice);
  const { role } = useSelector((state) => state.roomSlice);

  const toggleMute = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };
  
  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        MediasoupClient.onVideoToggle(isVideoOff); // socket call

        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled); // is muted is always negative of actual answer
      }
    }
  };

  const userPopUpHandler = (peerId) => {
    setActivePeerId((prev) => (prev === peerId ? null : peerId)); // toggle
  };

  
  const classEndHandler = async () => {
    try {
      await MediasoupClient.leaveRoom();
    } finally {
      navigate('/classrooms');
    }
  }

  useEffect(() => {
    const join = async () => {
      const currUser = {"fullname": user.fullname, "userId": user._id, "username": user.username, "image": user.avatar}
      console.log(currUser)
      try {
        console.log("Joining room:", roomId, role);
        const roomData = await MediasoupClient.joinRoom(roomId, currUser, role);  // to be changed
        console.log("Room data:", roomData);

        // New consumer → add its stream to list
        MediasoupClient.onNewConsumer = ({ consumer, peerId, kind }) => {
          console.log("➡️ New consumer:", peerId, kind, consumer);

          if(kind === 'video'){
            setIsPeersVideoOn((prev) => ({
              ...prev,
              [peerId] : true
            }))
          }

          if (kind === 'video' || kind === 'audio') {
            setRemoteStreams(prev => {
              const stream = prev[peerId]?.stream || new MediaStream();
              stream.addTrack(consumer.track);

              return {
              ...prev,
                [peerId]: { stream }
              }
            });
          }
        };

        MediasoupClient.onPeerJoined = (peerId, userDetail, role) => {
          toast.success(`New Peer(${role}) Joined -> ${userDetail.fullname} ${peerId}`);
        }

        // Peer closed → remove its streams
        MediasoupClient.onPeerClosed = (peerId) => {
          setRemoteStreams(prev => {
            const next = { ...prev };
            delete next[peerId];
            return next;
          });
          
          toast.success('Peer Left');
        };

        MediasoupClient.onRemoteVideoToggle = (peerId, isVideoOn) => {
          setIsPeersVideoOn((prev) => ({
            ...prev,
            [peerId] : isVideoOn
          }))
        }

        // get local media
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        setLocalStream(stream);
        localStreamRef.current = stream;

        // publish tracks
        const videoTrack = stream.getVideoTracks()[0];
        const audioTrack = stream.getAudioTracks()[0];

        if (audioTrack) {
          await MediasoupClient.publish(audioTrack, { kind: "audio" });
        }
        if (videoTrack) {
          await MediasoupClient.publish(videoTrack, { kind: "video" });
        }

        await MediasoupClient.getExistingProducers();
      } catch (error) {
        console.error("Error joining room:", error);
      }
    };

    if(isInitialized){
      console.log(isInitialized, ": Joining")
      join();
    }

    return () => {
      console.log("Room CleanUp Time...");
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      MediasoupClient.leaveRoom();
    };
  }, [roomId, isInitialized]);

  return (
  <div className="flex flex-col h-screen bg-gray-950 text-gray-100">

    {/* 🔹 1. Sleek Header */}
    <div className="h-14 flex justify-between items-center px-4 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800 shadow-lg">
      <div className="text-sm font-medium text-gray-300">
        Room ID: <span className="text-white font-semibold">{roomId}</span>
      </div>

      <div className="flex gap-3">
        {/* Tabs */}
        <button
          onClick={() => { setShowParticipants(!showParticipants); setShowChat(false); }}
          className={`px-4 py-1.5 text-sm rounded-lg transition-all shadow-sm
            ${showParticipants 
              ? "bg-gray-700 text-white" 
              : "text-gray-400 hover:text-white hover:bg-gray-800/60"}`}
        >
          Participants
        </button>

        <button
          onClick={() => { setShowChat(!showChat); setShowParticipants(false); }}
          className={`px-4 py-1.5 text-sm rounded-lg transition-all shadow-sm
            ${showChat 
              ? "bg-gray-700 text-white" 
              : "text-gray-400 hover:text-white hover:bg-gray-800/60"}`}
        >
          Chat
        </button>

        <button
          onClick={classEndHandler}
          className="bg-red-600 hover:bg-red-700 px-4 py-1.5 text-sm rounded-lg shadow-md transition"
        >
          Leave
        </button>
      </div>
    </div>

    {/* 🔹 2. Main Section */}
    <div className="flex flex-1 overflow-hidden relative">

      {/* Video Grid */}
      <div className="flex-1 overflow-y-auto p-5 bg-black">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* === Local User Video Card === */}
          {localStream && (
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-800 border border-gray-700 shadow-xl transition hover:shadow-2xl">

              {/* Video */}
              {!isVideoOff ? (
                <VideoPlayer stream={localStream} muted={false} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                  Video Off
                </div>
              )}

              {/* Overlay */}
              <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/70 to-transparent px-3 py-2 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <img 
                    src={user.avatar || "/default-profile.png"} 
                    className="w-7 h-7 rounded-full object-cover border border-gray-500 shadow-md"
                  />
                  <span className="text-sm font-semibold">You</span>
                </div>

                <div className="flex gap-3 text-gray-300">
                  <button onClick={toggleMute} className="hover:text-white transition">
                    {isMuted ? <BsFillMicMuteFill className="text-red-500" /> : <BsFillMicFill />}
                  </button>

                  <button onClick={toggleVideo} className="hover:text-white transition">
                    {isVideoOff ? <FaVideoSlash className="text-red-500" /> : <FaVideo />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* === Remote Peers === */}
          {Array.from(MediasoupClient.peers.values()).map((peer) => {
            if (peer.id === MediasoupClient.peerId) return null;

            const stream = remoteStreams[peer.id]?.stream;

            return (
              <div 
                key={peer.id} 
                className="relative aspect-video rounded-2xl overflow-hidden bg-gray-800 border border-gray-700 shadow-xl transition hover:shadow-2xl"
              >
                
                {peersVideoOn?.[peer.id] ? (
                  <VideoPlayer stream={stream} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                    Video Off
                  </div>
                )}

                {/* Overlay */}
                <div
                  onClick={() => userPopUpHandler(peer.id)}
                  className="absolute bottom-0 w-full cursor-pointer bg-gradient-to-t from-black/70 to-transparent px-3 py-2 flex justify-between items-center hover:from-black/85 transition"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <img
                      src={peer?.userDetail?.image || "/default-profile.png"}
                      className="w-7 h-7 rounded-full object-cover border border-gray-500 shadow-md"
                    />
                    <span className="text-sm font-semibold truncate">
                      {peer?.userDetail?.fullname}
                    </span>
                  </div>

                  <span className="text-xs bg-gray-700/80 px-2 py-0.5 rounded-md border border-gray-600 text-gray-300">
                    {peer.role}
                  </span>
                </div>

                {activePeerId === peer.id && <ProfilePopUp peer={peer} />}
              </div>
            );
          })}
        </div>
      </div>

      {/* 🔹 3. Sidebar */}
      {/* 🔹 3. Sidebar */}
{(showParticipants || showChat) && (
  <div className="w-80 bg-gray-900/95 backdrop-blur-xl border-l border-gray-800 flex flex-col shadow-2xl">

    {/* Header */}
    <div className="flex items-center justify-between px-4 py-4 border-b border-gray-800 bg-gray-900/60 backdrop-blur">
      <span className="font-semibold text-gray-100 text-lg tracking-wide">
        {showParticipants ? "Participants" : "Chat"}
      </span>

      <button 
        onClick={() => { setShowParticipants(false); setShowChat(false); }}
        className="text-gray-400 hover:text-white hover:scale-110 transition"
      >
        <FaTimes size={18} />
      </button>
    </div>

    {/* Content */}
    <div className="
      flex-1 overflow-y-auto p-4 space-y-3 
      text-gray-200 
      scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent
    ">
      {showParticipants && (
        <div className="bg-gray-850/40 p-3 rounded-xl border border-gray-800 shadow-inner">
          <ParticipantsList peers={MediasoupClient.peers} />
        </div>
      )}

      {showChat && (
        <div className="bg-gray-850/40 p-3 rounded-xl border border-gray-800 shadow-inner">
          <Chatbox />
        </div>
      )}
    </div>
  </div>
)}


    </div>
  </div>
);

};

export default Room;