import React from 'react'
import { useParams } from 'react-router-dom'

export const Profile = () => {
    const { userId } = useParams();
    return (
        <div>
            <div>Profile</div>
            <div>Profile of UserId: {userId}</div>
        </div>
    )
}
