import React from 'react'
import { useSelector } from 'react-redux';
import { PiUserCircle } from "react-icons/pi";

const Avatar = ({ userId, name, imageUrl, width, height, bg_color }) => {

  const onlineUser = useSelector(state => state?.user?.onlineUser)
  const isOnline = onlineUser.includes(userId)

  let avatarName = ""

  if (name) {
    const splitName = name?.split(" ")

    if (splitName.length > 1) {
      avatarName = splitName[0][0] + splitName[1][0]
    } else {
      avatarName = splitName[0][0]
    }
  }

  return (
    <div className={`text-slate-800 font-bold relative`}>
      {
        imageUrl ? (
          <div style={{ width: width + "px", height: height + "px" }} className={`overflow-hidden rounded-full flex justify-center items-center`}>
            <img
              src={imageUrl}
              alt={name}
              className='rounded-full'
              style={{ height: height, width: width, aspectRatio: 3 / 2, objectFit: "cover" }}
            />
          </div>
        ) : (
          name ? (
            <div style={{ width: width + "px", height: height + "px" }} className={`overflow-hidden rounded-full flex justify-center items-center text-lg ${bg_color}`}>
              {avatarName}
            </div>
          ) : (
            <PiUserCircle
              size={width}
            />
          )
        )
      }

      {
        isOnline && (
          <div className='bg-green-600 p-1 absolute bottom-1 -right-1 z-10 rounded-full'></div>
        )
      }

    </div>
  )
}

export default Avatar
