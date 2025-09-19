import React, { useEffect, useRef, useState } from "react";
import VideoPlayer from "../components/VideoPlayer";
import MediasoupClient from "../services/MediasoupClient";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { roomSlice } from "../redux/slices/roomSlice";
import Chatbox from "../components/Chatbox";

const Room = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState({});

  const localStreamRef = useRef(null);

  const { isInitialized} = useSelector((state)=> state.userSlice);
  const { role } = useSelector((state) => state.roomSlice);

  useEffect(() => {
    const join = async () => {
      try {
        console.log("Joining room:", roomId, role);
        const roomData = await MediasoupClient.joinRoom(roomId, "Vivek", role);  // to be changed
        console.log("Room data:", roomData);

        // New consumer → add its stream to list
        MediasoupClient.onNewConsumer = ({ consumer, peerId, kind }) => {
          console.log("➡️ New consumer:", peerId, kind, consumer);

          if (kind === 'video' || kind === 'audio') {
            const stream = new MediaStream();
            stream.addTrack(consumer.track);

            setRemoteStreams(prev => ({
              ...prev,
              [peerId]: {
                ...prev[peerId],
                [kind]: stream,
                consumer
              }
            }));
          }
        };

        // Peer closed → remove its streams
        MediasoupClient.onPeerClosed = (peerId) => {
          setRemoteStreams(prev => {
            const next = { ...prev };
            delete next[peerId];
            return next;
          });
        };

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
  }, [roomId], [isInitialized]);

  const classEndHandler = async () => {
    try {
      await MediasoupClient.leaveRoom();
    } finally {
      navigate('/classrooms');
    }
  }

  return (
    <div className="flex flex-wrap">
      <div>
        {/* Local video */}
        {localStream && <VideoPlayer stream={localStream} muted={true} />}

        {/* Remote videos */}
        {Object.entries(remoteStreams).map(([peerId, tracks]) => {
          const stream = tracks.video || tracks.audio;
          console.log(peerId, tracks)
          return <VideoPlayer key={peerId} stream={stream} muted={true} />
        })}
      </div>
      <div><button onClick={classEndHandler}>Leave Class</button></div>

      <div>
        <Chatbox/>
      </div>
    </div>
  );
};

export default Room;