import React from 'react'
import axios from 'axios'
import Avatar from './Avatar'
import Divider from './Divider'
import Loading from './Loading'
import taost from 'react-hot-toast'
import uploadFile from '../helpers/uploadFile'
import { useDispatch } from 'react-redux'
import { setUser } from '../redux/userSlice'
import { useNavigate } from 'react-router-dom'
import { IoClose } from "react-icons/io5";

const EditUserDetails = ({ onClose, user }) => {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [loading, setLoading] = React.useState(false)
  const [uploadPhoto, setUploadPhoto] = React.useState("")
  const [data, setData] = React.useState({
    name: '',
    profile_pic: ''
  })

  React.useEffect(() => {
    setData((prev) => {
      return {
        ...prev,
        name: user?.name,
        profile_pic: user?.profile_pic
      }
    })
  }, [user])

  const handleOnChange = (e) => {
    const { name, value } = e.target

    setData((prev) => {
      return {
        ...prev,
        [name]: value
      }
    })
  }

  const handleClearUploadPhoto = (e) => {
    e.stopPropagation()
    e.preventDefault()
    setUploadPhoto(null)
  }

  const handleUploadPhoto = async (e) => {
    setLoading(true)
    const file = e.target.files[0]

    const uploadPhoto = await uploadFile(file)
    setUploadPhoto(file)

    setData((prev) => {
      return {
        ...prev,
        profile_pic: uploadPhoto?.url
      }
    })
    setLoading(false)
  }

  const handleSubmit = async (e) => {
    console.log("h")
    e.preventDefault()
    e.stopPropagation()

    try {
      const URL = `${process.env.REACT_APP_BACKEND_URL}/api/update-user`

      const response = await axios({
        method: 'post',
        url: URL,
        data: data,
        withCredentials: true
      })

      if (response.data.success) {
        taost.success(response?.data?.message)
        dispatch(setUser(response.data.data))
        onClose()
        navigate('/')
      }

    } catch (error) {
      taost.error(error?.response?.data?.message)
    }
  }

  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 flex justify-center items-center bg-gray-700 bg-opacity-40 z-10'>
      {loading &&
        (<div className='fixed top-0 bottom-0 left-0 right-0 flex justify-center items-center bg-gray-700 bg-opacity-40 z-10'>
          <Loading />
        </div>)
      }
      <div className='bg-white p-4 py-6 m-1 rounded w-full max-w-sm'>

        <div className='flex items-center justify-center'>
          <Avatar
            width={80}
            height={80}
            imageUrl={data?.profile_pic}
            name={data?.name}
            bg_color={user?.bg_color}
          />
        </div>
        <h2 className='font-bold text-xl text-center'>Edit user details</h2>

        <form className='grid gap-3 mt-3' onSubmit={handleSubmit}>

          <div className="my-2">
            <label htmlFor="floatingInput">Enter your Name</label>
            <input name='name' type="text" className="form-control my-1" value={data.name} onChange={handleOnChange} id="floatingInput" />
          </div>

          <div className='flex flex-col mb-3'>
            <label htmlFor='profile_pic' className='w-100'>
              <div className='h-14 bg-slate-200 flex justify-center items-center border rounded hover:border-primary cursor-pointer'>
                <p className='text-sm max-w-[300px] text-ellipsis line-clamp-1'>
                  {
                    uploadPhoto?.name ? uploadPhoto?.name : "Change profile photo"
                  }
                </p>
                {
                  uploadPhoto?.name && (
                    <button className='text-lg ml-2 hover:text-red-600' onClick={handleClearUploadPhoto}>
                      <IoClose />
                    </button>
                  )
                }
              </div>
            </label>

          </div>

          <input
            type='file'
            id='profile_pic'
            name='profile_pic'
            className='bg-slate-100 px-2 py-1 focus:outline-primary hidden'
            onChange={handleUploadPhoto}
          />

          <Divider />
          <div className='flex gap-2 ml-auto '>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Discard</button>
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </div>
        </form>
      </div >
    </div >
  )
}

export default React.memo(EditUserDetails)
