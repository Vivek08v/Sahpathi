import React, { useEffect, useState } from "react";
import VideoPlayer from "./VideoPlayer";
import MediasoupClient from "../services/MediasoupClient";
import { useParams } from "react-router-dom";

const Room = () => {
  const { roomId } = useParams();
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState({});

  useEffect(() => {
    const join = async () => {
      try {
        console.log("Joining room:", roomId);
        const roomData = await MediasoupClient.joinRoom(roomId, "Vivek", "student");
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

        // get local media
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        setLocalStream(stream);

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

    join();
  }, [roomId]);

  return (
    <div className="flex flex-wrap">
      {/* Local video */}
      {localStream && <VideoPlayer stream={localStream} muted={true} />}

      {/* Remote videos */}
      {Object.entries(remoteStreams).map(([peerId, tracks]) => {
        const stream = tracks.video || tracks.audio;
        console.log(peerId, tracks)
        return <VideoPlayer key={peerId} stream={stream} muted={true} />
      })}
    </div>
  );
};

export default Room;