import React, { useEffect, useRef, useState } from "react";
import { BsFillMicMuteFill, BsFillMicFill } from "react-icons/bs";
import { FaVideoSlash, FaVideo } from "react-icons/fa";
import toast from 'react-hot-toast';
import VideoPlayer from "../components/VideoPlayer";
import MediasoupClient from "../services/MediasoupClient";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { roomSlice } from "../redux/slices/roomSlice";
import Chatbox from "../components/Chatbox";
import ProfilePopUp from "../components/ProfilePopUp";

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
    <div className="flex-col flex-wrap">
      <div className="w-full flex justify-around bg-green-200">
        <div>Room-Id: {roomId}</div>
        <div className="bg-red-600 border-2 rounded">
          <button onClick={classEndHandler}>Leave Class</button>
        </div>
      </div>

      <div className="flex">
        <div className="flex basis-2/3">
        {/* {console.log(peersVideoOn)} */}
          
          {/* local Stream */}
          {localStream && 
            <div className="p-2 bg-gray-200">
              <div className="w-full">
                {!isVideoOff ? 
                  <VideoPlayer stream={localStream} muted={false} /> : 
                  <>Video is Off</>
                }
                
                <div className="w-full bg-red-200 flex justify-between items-center gap-2 rounded-b px-2 py-1">
                  <div className="bg-blue-300 flex gap-2 px-2 py-1 rounded">
                    <div onClick={toggleMute}>
                      {isMuted ? <BsFillMicMuteFill/> : <BsFillMicFill />}
                    </div>
                    <div onClick={toggleVideo}>
                      {isVideoOff ? <FaVideoSlash/> : <FaVideo />}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div>
                      <img
                        src={user.avatar || "/default-profile.png"} // fallback dummy image
                        alt={`${user.fullname}'s profile`}
                        className="w-8 h-8 rounded-full object-cover border-2 border-gray-300"
                      />
                    </div>
                    <div className="text-sm font-medium">
                      {user.fullname} [{role}]
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
          {console.log(MediasoupClient.peers)}
          {Array.from(MediasoupClient.peers.values()).map((peer, i) => {
            // local Stream
            if(peer.id === MediasoupClient.peerId){
              return;
            }
            console.log(peer)
            const stream = remoteStreams[peer.id]?.stream;

            return (
              <div className="p-2 bg-gray-200" key={i}>
                <div className="w-full">
                  {(peersVideoOn && peersVideoOn[peer.id]) ? 
                    <VideoPlayer key={peer.id} stream={stream} muted={false} /> : 
                    <>Video is Off</>
                  }
                  <div className="relative">
                  <div className="w-full bg-red-200 justify-between rounded-b px-2 py-1 flex items-center gap-2"
                       onClick={() => userPopUpHandler(peer.id)}>
                    <div>
                      <img
                        src={peer?.userDetail?.image || "/default-profile.png"} // fallback dummy image
                        alt={`${peer?.userDetail?.image}'s profile`}
                        className="w-8 h-8 rounded-full object-cover border-2 border-gray-300"
                      />
                    </div>
                    <div className="text-sm font-medium">
                      {peer?.userDetail?.fullname} [{peer.role}]
                    </div>
                  </div>

                  {/* === Popup === */}
                  {activePeerId === peer.id && (
                    <ProfilePopUp peer={peer}/>
                  )}

                </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="bg-gray-200 basis-1/3 border-2 rounded">
          <Chatbox/>
        </div>
      </div>
    </div>
  );
};

export default Room;