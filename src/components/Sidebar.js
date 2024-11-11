import React from 'react'
import moment from "moment";
import Avatar from './Avatar'
import Divider from './Divider';
import Loading from './Loading';
import SearchUser from './SearchUser';
import EditUserDetails from './EditUserDetails';
import { BiLogOut } from "react-icons/bi";
import { logout } from '../redux/userSlice';
import { FaImage, FaVideo } from "react-icons/fa6";
import { useDispatch, useSelector } from 'react-redux';
import { IoChatbubbleEllipses } from "react-icons/io5";
import { FaUserPlus, FaArrowLeft } from "react-icons/fa";
import { NavLink, useNavigate, useParams } from 'react-router-dom';

const Sidebar = () => {

  const [allUser, setAllUser] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [editUserOpen, setEditUserOpen] = React.useState(false)
  const [openSearchUser, setOpenSearchUser] = React.useState(false)

  const user = useSelector(state => state?.user)
  const socketConnection = useSelector(state => state?.user?.socketConnection)

  const params = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate("/login")
    localStorage.clear()
  }

  React.useEffect(() => {
    setLoading(true)
    if (socketConnection) {
      socketConnection.emit('sidebar', user._id)

      socketConnection.on('conversation', (data) => {
        const conversationUserData = data.map((conversationUser) => {
          if (conversationUser?.receiver?._id !== user?._id) {
            return {
              ...conversationUser,
              userDetails: conversationUser.receiver
            }
          } else {
            return {
              ...conversationUser,
              userDetails: conversationUser.sender
            }
          }
        })

        setAllUser(conversationUserData)
        setLoading(false)
      })
    }
  }, [socketConnection, user])

  return (
    <div className='w-full h-full grid grid-cols-[48px,1fr] bg-white'>
      <div className='bg-slate-100 w-12 h-full rounded-tr-lg rounded-br-lg py-5 text-slate-600 flex flex-col justify-between'>
        <div>
          <NavLink className={({ isActive }) => `w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded ${isActive && "bg-slate-200"}`} title='Chat'>
            <IoChatbubbleEllipses
              size={20}
            />
          </NavLink>

          <div title='Add friend' onClick={() => setOpenSearchUser(true)} className='w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded' >
            <FaUserPlus size={20} />
          </div>
        </div>

        <div className='flex flex-col'>
          <div className='flex justify-center items-center w-12 h-12 hover:bg-slate-200 rounded'>
            <button title={user?.name} onClick={() => setEditUserOpen(true)}>
              <Avatar
                width={30}
                height={30}
                name={user?.name}
                imageUrl={user?.profile_pic}
                bg_color={user?.bg_color}
              />
            </button>
          </div>
          <div className='flex justify-center items-center w-12 h-12 cursor-pointer hover:bg-slate-200 rounded'>
            <button className='-ml-1' title='Logout' data-bs-toggle="modal" data-bs-target="#logoutModal">
              <BiLogOut size={25} />
            </button>
          </div>

          {
            <div className="modal" id='logoutModal' tabIndex="-1">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-body">
                    <p>Are you sure to Logout?</p>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">No</button>
                    <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleLogout}>Yes</button>
                  </div>
                </div>
              </div>
            </div>
          }

        </div>
      </div>

      {/*Message portion */}
      <div className='w-full'>

        <div className='h-16 p-3'>
          <h2 className='text-xl font-bold text-slate-800'>Chats</h2>
        </div>

        <Divider />

        <div className=' h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto scrollbar'>

          {
            loading && <div className='mt-4'><Loading /></div>
          }

          {
            allUser.length === 0 && !loading ? (
              <div className='mt-10'>
                <div className='flex justify-center gap-3 m-2 text-slate-500'>
                  <FaArrowLeft
                    size={25}
                  />
                  <span className='text-lg text-slate-400 -m-1'>Explore users to start a conversation with.</span>
                </div>
              </div>
            ) :

              (
                allUser.map((conv, index) => {
                  return (
                    <div key={index}>
                      <NavLink to={"/" + conv?.userDetails?._id} key={conv?._id} className={`flex items-center py-3 px-2 ${(params.userId === conv?.userDetails?._id) && "bg-slate-200"} hover:bg-slate-100 cursor-pointer`}>
                        <div className='mr-4' style={{ width: "40px" }}>
                          <Avatar
                            width={40}
                            height={40}
                            imageUrl={conv?.userDetails?.profile_pic}
                            name={conv?.userDetails?.name}
                            userId={conv?.userDetails?._id}
                            bg_color={conv?.userDetails?.bg_color}
                          />
                        </div>
                        <div className='w-100'>
                          <div className='flex items-center'>
                            <h2 className='text-ellipsis line-clamp-1 font-semibold text-base'>{conv?.userDetails?.name}</h2>
                            <p className='text-slate-500 text-xs ml-auto'>{moment(conv?.lastMsg?.createdAt).format('hh:mm A')}</p>
                          </div>
                          <div className='flex items-center text-break'>
                            <div className='flex items-center text-slate-500 text-xs'>
                              {
                                conv?.lastMsg?.imageUrl && (
                                  <div className='flex items-center'>
                                    <span className='mr-1'><FaImage /></span>
                                    {!conv?.lastMsg?.text && <span>Image</span>}
                                  </div>
                                )
                              }
                              {
                                conv?.lastMsg?.videoUrl && (
                                  <div className='flex items-center'>
                                    <span className='mr-1'><FaVideo /></span>
                                    {!conv?.lastMsg?.text && <span>Video</span>}
                                  </div>
                                )
                              }
                            </div>
                            <p className='text-ellipsis line-clamp-1 text-slate-500 text-xs mr-2'>{conv?.lastMsg?.text}</p>
                            {
                              Boolean(conv?.unseenMsg) && (
                                <div className='text-xs w-6 h-6 flex justify-center items-center ml-auto p-1 bg-primary text-white font-semibold rounded-full'>
                                  <p>{conv?.unseenMsg}</p>
                                </div>
                              )
                            }
                          </div>
                        </div>

                      </NavLink>
                      <Divider />
                    </div>
                  )
                })
              )}
        </div>
      </div>

      {/**edit user details*/}
      {
        editUserOpen && <EditUserDetails onClose={() => setEditUserOpen(false)} user={user} />
      }

      {/**search user */}
      {
        openSearchUser && <SearchUser onClose={() => setOpenSearchUser(false)} />
      }

    </div>
  )
}

export default Sidebar