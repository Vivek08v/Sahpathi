import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { followAPI } from '../services/operations/follow.service';

const ProfilePopUp = ({peer}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.userSlice);
    console.log(user);

    const doIFollow = (peer) => {
      // console.log(peer.userDetail.userId);
      console.log(typeof(user.following[0]))
      // let ans = false;
      user.following.forEach((follower) => {
        console.log(follower, "-> ", peer.userDetail.userId);
      })
      // return ans;
      return user.following.length && user.following.some((following) => following === peer.userDetail.userId);
    }

    const onFollowHandler = (peer, toFollow) => {
      const data = {
        friendId : peer.userDetail.userId, 
        toFollow,
      }
      console.log(data)

      dispatch(followAPI(data, navigate));
    }

    return (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-white shadow-lg rounded-xl p-3 w-48 z-50 border border-gray-200 animate-fadeIn">
          <div className="flex flex-col items-center text-center">
            <img
              src={peer?.userDetail?.image || "/default-profile.png"}
              alt="profile"
              className="w-12 h-12 rounded-full object-cover border border-gray-300"
            />
            <div className="mt-2 font-semibold text-gray-800 text-sm">
              {peer?.userDetail?.fullname}
            </div>
            <div className="text-xs text-gray-500 mb-3">{peer.role}</div>
        
            <div className="flex gap-2">
              <button className="bg-blue-500 text-white text-xs px-3 py-1 rounded-md hover:bg-blue-600 transition"
                onClick={()=>navigate(`/profile/${peer.userDetail.userId}`)}>
                View Profile
              </button>
              <button className="bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-md hover:bg-gray-300 transition">
                {doIFollow(peer) ? 
                  <div
                    onClick={() => onFollowHandler(peer, false)}>
                    Unfollow
                  </div> : 
                  <div 
                    onClick={() => onFollowHandler(peer, true)}>
                    Follow
                  </div>
                }
              </button>
            </div>
          </div>
        </div>
    )
}

export default ProfilePopUp