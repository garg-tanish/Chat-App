import React from 'react'
import axios from 'axios'
import io from 'socket.io-client'
import toast from 'react-hot-toast';
import logo from '../assets/logo.jpg'
import Sidebar from '../components/Sidebar'
import Loading from '../components/Loading'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { logout, setOnlineUser, setSocketConnection, setUser } from '../redux/userSlice'

const Home = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const [loading, setLoading] = React.useState(false)

  useSelector(state => state.user)
  const basePath = location.pathname === '/'

  React.useEffect(() => {

    document.title = 'Home'
    fetchUserDetails()
  }, [])

  /***socket connection */
  React.useEffect(() => {

    const socketConnection = io(process.env.REACT_APP_BACKEND_URL, {
      auth: {
        token: localStorage.getItem('token')
      },
    })

    dispatch(setSocketConnection(socketConnection))

    socketConnection.on('onlineUser', (data) => {
      dispatch(setOnlineUser(data))
    })

    return () => {
      socketConnection.disconnect()
    }
  }, [])

  const fetchUserDetails = async () => {
    setLoading(true)

    try {
      const URL = `${process.env.REACT_APP_BACKEND_URL}/api/user-details`
      const response = await axios({
        url: URL,
        withCredentials: true
      })

      dispatch(setUser(response.data.data))

      if (response.data.data.logout) {
        dispatch(logout())
        navigate("/login")
      }
      setLoading(false)

    } catch (error) {
      toast.error(error)
      console.log("Error occuring in fetching User details: ", error)
      setLoading(false)
    }
  }

  return (
    <div className='grid lg:grid-cols-[300px,1fr]'> {/**h-screen max-h-screen**/}

      <section className={`bg-white ${!basePath && "hidden"} lg:block`}>
        <Sidebar />
      </section>

      {/**message component**/}
      <section className={`${basePath && "hidden"}`} >
        <Outlet />
      </section>

      <div className={`justify-center items-center flex-col gap-2 hidden ${!basePath ? "hidden" : "lg:flex"}`}>
        <div>
          <img
            src={logo}
            width={250}
            alt='logo'
            style={{ mixBlendMode: 'color-burn' }}
          />
        </div>
        <p className='text-lg mt-2 text-slate-500'>Select user to send message</p>
      </div>
      {loading &&
        (<div className='fixed top-0 bottom-0 left-0 right-0 flex justify-center items-center bg-gray-700 bg-opacity-40 z-10'>
          <Loading />
        </div>)
      }
    </div>
  )
}

export default Home
