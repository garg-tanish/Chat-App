import React from 'react'
import Avatar from './Avatar'
import { Link } from 'react-router-dom'

const UserSearchCard = ({ user, onClose }) => {

    return (
        <Link to={"/" + user?._id} onClick={onClose} className='flex items-center mb-2 gap-3 p-2 lg:p-4 hover:border hover:border-primary rounded cursor-pointer'>
            <div>
                <Avatar
                    width={50}
                    height={50}
                    name={user?.name}
                    userId={user?._id}
                    imageUrl={user?.profile_pic}
                    bg_color={user?.bg_color}
                />
            </div>
            <div>
                <div className='font-semibold text-ellipsis line-clamp-1'>
                    {user?.name}
                </div>
                <p className='text-sm text-ellipsis line-clamp-1'>{user?.email}</p>
            </div>
        </Link>
    )
}

export default UserSearchCard
