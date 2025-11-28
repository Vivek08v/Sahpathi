import React, { useEffect, useRef } from "react";

const VideoPlayer = ({ stream, muted = false }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      const tryPlay = async () => {
        try {
          await videoRef.current.play();
        } catch (err) {
          console.warn('Video autoplay failed, will retry on interaction', err);
        }
      };
      tryPlay();
    }
  }, [stream]);
  
  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted={muted}
      className="w-full h-full object-cover"
    />
  );
};

export default VideoPlayer;