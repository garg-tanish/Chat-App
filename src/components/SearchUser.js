import React from 'react'
import axios from 'axios';
import toast from 'react-hot-toast'
import Loading from './Loading';
import UserSearchCard from './UserSearchCard';
import { IoClose } from "react-icons/io5";
import { IoSearchOutline } from "react-icons/io5";

const SearchUser = ({ onClose }) => {

    const [search, setSearch] = React.useState("")
    const [searchUser, setSearchUser] = React.useState([])
    const [loading, setLoading] = React.useState(false)

    const handleSearchUser = async () => {

        const URL = `${process.env.REACT_APP_BACKEND_URL}/api/search-user`

        try {
            setLoading(true)
            const response = await axios.post(URL, {
                search: search
            }, {
                withCredentials: true
            })
            setLoading(false)

            setSearchUser(response.data.data)

        } catch (error) {
            toast.error(error?.response?.data?.message)
        }
    }

    React.useEffect(() => {
        handleSearchUser()
    }, [search])

    return (
        <div className='fixed top-0 bottom-0 left-0 right-0 bg-slate-700 bg-opacity-40 p-2 z-10'>
            <div className='w-full max-w-lg mx-auto mt-10'>

                {/**input search user */}
                <div className='bg-white rounded h-14 overflow-hidden flex '>
                    <input
                        type='text'
                        className='w-full outline-none py-1 h-full px-4'
                        placeholder='Search user by name/email....'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <div className='h-14 w-14 flex justify-center items-center'>
                        <button className='hover:text-primary' onClick={() => { handleSearchUser() }}>
                            <IoSearchOutline size={25} />
                        </button>
                    </div>
                </div>

                {/**display search user */}
                <div className='bg-white my-2 w-full h-[calc(100vh-208px)] p-4 rounded relative overflow-y-scroll scrollbar'>

                    {
                        loading && <p><Loading /></p>
                    }

                    {
                        searchUser.length === 0 && !loading && (
                            <p className='text-center text-slate-500'>User not found!</p>
                        )
                    }

                    {
                        searchUser.length !== 0 && !loading && (
                            searchUser.map((user) => {
                                return (
                                    <UserSearchCard key={user._id} user={user} onClose={onClose} />
                                )
                            })
                        )
                    }

                </div>
            </div>

            <div className='absolute top-1 right-2 text-2xl p-2 lg:text-4xl'>
                <button className='hover:text-white' onClick={onClose}>
                    <IoClose />
                </button>
            </div>
        </div>
    )
}

export default SearchUser
