import React from 'react'
import { useParams } from 'react-router-dom'

export const Room = () => {
  const { roomId } = useParams();
  return (
    <div>
      <div>Welcome</div>
      <div>Room Id: {roomId}</div>
    </div>
  )
}
