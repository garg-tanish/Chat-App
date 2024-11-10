import React from 'react'
import moment from 'moment'
import Avatar from './Avatar'
import Loading from './Loading';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import uploadFile from '../helpers/uploadFile';
import backgroundImage from '../assets/wallapaper.jpeg'
import { DotAction } from './DotAction';
import { useSelector } from 'react-redux'
import { IoClose } from "react-icons/io5";
import { IoMdSend } from "react-icons/io";
import { HiDotsVertical } from "react-icons/hi";
import { Link, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceSmile } from '@fortawesome/free-regular-svg-icons';
import { FaPlus, FaImage, FaVideo, FaAngleLeft } from "react-icons/fa6";

const MessagePage = () => {

  const params = useParams()
  const currentMessage = React.useRef(null)

  const user = useSelector(state => state?.user)
  const socketConnection = useSelector(state => state?.user?.socketConnection)

  const [loading, setLoading] = React.useState(false)
  const [allMessage, setAllMessage] = React.useState([])
  const [clickedDot, setClickedDot] = React.useState(false)
  const [isPlusActive, setPlusActive] = React.useState(false)
  const [isEmojiPicker, setEmojiPicker] = React.useState(false)
  const [openImageVideoUpload, setOpenImageVideoUpload] = React.useState(false)

  const [dataUser, setDataUser] = React.useState({
    name: "",
    email: "",
    profile_pic: "",
    online: false,
    _id: "",
    bg_color: ""
  })

  const [message, setMessage] = React.useState({
    text: "",
    imageUrl: "",
    videoUrl: ""
  })

  React.useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [allMessage])

  React.useEffect(() => {
    if (socketConnection) {
      socketConnection.emit('message-page', params.userId)

      socketConnection.emit('seen', params.userId)

      socketConnection.on('message-user', (data) => {
        setDataUser(data)
      })

      socketConnection.on('message', (data) => {
        setAllMessage(data)
      })
    }
  }, [socketConnection, params?.userId, user])

  const handleEmojiSelect = (emojiObject) => {
    setMessage({
      ...message,
      text: message.text + emojiObject.native
    });
  };

  const handleUploadImageVideoOpen = () => {
    setOpenImageVideoUpload(preve => !preve)
  }

  const handleUploadImage = async (e) => {
    const file = e.target.files[0]

    setLoading(true)
    const uploadPhoto = await uploadFile(file)
    setLoading(false)
    setOpenImageVideoUpload(false)

    setMessage(preve => {
      return {
        ...preve,
        imageUrl: uploadPhoto.url
      }
    })
  }

  const handleClearUploadImage = () => {
    setMessage(preve => {
      return {
        ...preve,
        imageUrl: ""
      }
    })
  }

  const handleUploadVideo = async (e) => {
    const file = e.target.files[0]

    setLoading(true)
    const uploadPhoto = await uploadFile(file)
    setLoading(false)
    setOpenImageVideoUpload(false)

    setMessage(preve => {
      return {
        ...preve,
        videoUrl: uploadPhoto.url
      }
    })
  }

  const handleClearUploadVideo = () => {
    setMessage(preve => {
      return {
        ...preve,
        videoUrl: ""
      }
    })
  }

  const handleOnChange = (e) => {
    setMessage(preve => {
      return {
        ...preve,
        text: e.target.value
      }
    })
  }

  const handleSendMessage = (e) => {
    e.preventDefault()

    setClickedDot(false)
    setEmojiPicker(false)
    setOpenImageVideoUpload(false)

    if (message.text || message.imageUrl || message.videoUrl) {
      if (socketConnection) {
        const date = new Date().toISOString()
        socketConnection.emit('new message', {
          sender: user?._id,
          receiver: params.userId,
          text: message.text,
          imageUrl: message.imageUrl,
          videoUrl: message.videoUrl,
          msgByUserId: user?._id
        })
        setMessage({
          text: "",
          imageUrl: "",
          videoUrl: ""
        })
        setAllMessage(prev => [...prev, {
          createdAt: date,
          msgByUserId: user?._id,
          seen: true,
          text: message.text,
          updatedAt: date
        }])
      }
    }
  }

  return (
    <div style={{ backgroundImage: `url(${backgroundImage})` }} className='bg-no-repeat bg-cover'>
      <header className='sticky top-0 h-16 bg-white flex justify-between items-center px-4'>
        <div className='flex items-center gap-3'>
          <Link to={"/"} className='lg:hidden'>
            <FaAngleLeft size={25} />
          </Link>
          <div>
            <Avatar
              width={40}
              height={40}
              imageUrl={dataUser?.profile_pic}
              name={dataUser?.name}
              bg_color={dataUser?.bg_color}
            />
          </div>
          <div>
            <h3 className='font-semibold text-lg -my-1 text-ellipsis line-clamp-1'>{dataUser?.name}</h3>
            <p className='text-sm'>
              {
                dataUser.online ? <span className='text-primary'>online</span> : <span className='text-slate-400'>offline</span>
              }
            </p>
          </div>
        </div>

        <div >
          <button className={`${clickedDot && "text-primary"} cursor-pointer hover:text-primary`} onClick={() => {
            setClickedDot(!clickedDot)
          }}>
            <HiDotsVertical />
          </button>
        </div>
      </header>

      {/***show all message */}
      <section className='h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-200 bg-opacity-50'>

        {/**all message show here */}
        <div className='flex flex-col gap-2 py-2 mx-2' ref={currentMessage}>
          {
            allMessage.map((msg, index) => {
              return (
                <div key={index} className={`p-1 rounded w-fit max-w-[280px] md:max-w-sm lg:max-w-md text-break text-wrap ${user._id === msg?.msgByUserId ? "ml-auto bg-teal-100" : "bg-white"}`}>
                  <div className='w-full relative'>
                    {
                      msg?.imageUrl && (
                        <img
                          src={msg?.imageUrl}
                          className='w-full h-full object-scale-down'
                          alt=''
                        />
                      )
                    }
                    {
                      msg?.videoUrl && (
                        <video
                          src={msg.videoUrl}
                          className='w-full h-full object-scale-down'
                          controls
                        />
                      )
                    }
                  </div>
                  <p className='px-2'>{msg.text}</p>
                  <p className='text-xs ml-auto w-fit'>{moment(msg.createdAt).format('hh:mm A')}</p>
                </div>
              )
            })
          }
        </div>


        {/**upload Image display */}
        {
          message.imageUrl && (
            <div className='w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
              <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600' onClick={handleClearUploadImage}>
                <IoClose size={30} />
              </div>
              <div className='bg-white p-3'>
                <img
                  src={message.imageUrl}
                  alt='uploadImage'
                  className='aspect-square w-full h-full max-w-sm m-2 object-scale-down'
                />
              </div>
            </div>
          )
        }

        {/**upload video display */}
        {
          message.videoUrl && (
            <div className='w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
              <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600' onClick={handleClearUploadVideo}>
                <IoClose size={30} />
              </div>
              <div className='bg-white p-3'>
                <video
                  src={message.videoUrl}
                  className='aspect-square w-full h-full max-w-sm m-2 object-scale-down'
                  controls
                  muted
                  autoPlay
                />
              </div>
            </div>
          )
        }

        {
          loading &&
          (<div className='fixed top-0 bottom-0 left-0 right-0 flex justify-center items-center bg-gray-700 bg-opacity-40 z-10'>
            <Loading />
          </div>)
        }
      </section>

      {/**send message */}
      <section className='h-16 bg-white flex items-center px-4'>
        <div className='relative '>
          <button onClick={() => {
            handleUploadImageVideoOpen();
            setPlusActive(!isPlusActive)
          }}
            className={`flex justify-center items-center ${isPlusActive && "bg-primary"} w-11 h-11 rounded-full hover:bg-primary hover:text-white`}>
            <FaPlus size={20} />
          </button>

          {/**video and image */}
          {
            openImageVideoUpload && (
              <div className='bg-white shadow rounded absolute bottom-14 w-36 p-2'>
                <form>
                  <label htmlFor='uploadImage' className='flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer'>
                    <div className='text-primary'>
                      <FaImage size={18} />
                    </div>
                    <p>Image</p>
                  </label>
                  <label htmlFor='uploadVideo' className='flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer'>
                    <div className='text-purple-500'>
                      <FaVideo size={18} />
                    </div>
                    <p>Video</p>
                  </label>

                  <input
                    type='file'
                    id='uploadImage'
                    onChange={handleUploadImage}
                    className='hidden'
                  />

                  <input
                    type='file'
                    id='uploadVideo'
                    onChange={handleUploadVideo}
                    className='hidden'
                  />
                </form>
              </div>
            )
          }
        </div>

        <div className='flex justify-center items-center'>
          <button className={`${isEmojiPicker && "bg-primary"} w-11 h-11 rounded-full hover:bg-primary hover:text-white`} onClick={() => { setEmojiPicker(!isEmojiPicker) }}>
            <FontAwesomeIcon icon={faFaceSmile} />
          </button>
        </div>

        {isEmojiPicker &&
          <div style={{ position: "fixed", left: "100", marginBottom: "500px" }}>
            <Picker data={data} theme="light" onEmojiSelect={handleEmojiSelect} />
          </div>
        }

        {/**input box */}
        <form className='h-full w-full flex gap-2' onSubmit={handleSendMessage}>
          <input type="text" className="form-control m-2" id="FormControlInput1" value={message.text} onChange={handleOnChange} placeholder="Type here..." autoComplete='off' />
          <button className={`text-${(message.text || message.imageUrl || message.videoUrl) ? 'primary' : "secondary"}`} disabled={!(message.text || message.imageUrl || message.videoUrl)}>
            <IoMdSend size={28} />
          </button>
        </form>

        {/* for three dots */}
        {
          clickedDot && (
            <DotAction onClose={() => setClickedDot(false)} dataUser={dataUser} user={user} allMessage={allMessage} />
          )
        }

      </section>
    </div>
  )
}

export default MessagePage
