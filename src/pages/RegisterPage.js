import React from 'react'
import axios from 'axios'
import toast from 'react-hot-toast';
import Loading from '../components/Loading'
import uploadFile from '../helpers/uploadFile';
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const RegisterPage = () => {

  const [otp, setOtp] = React.useState()
  const [otpSent, setOtpSent] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [uploadPhoto, setUploadPhoto] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [emailVarified, setEmailVerified] = React.useState(false)

  const navigate = useNavigate()

  const [data, setData] = React.useState({
    name: "",
    email: "",
    password: "",
    profile_pic: "",
    bg_color: ""
  })

  const bgColor = [
    'bg-slate-200',
    'bg-teal-200',
    'bg-red-200',
    'bg-green-200',
    'bg-yellow-200',
    'bg-gray-200',
    "bg-cyan-200",
    "bg-sky-200",
    "bg-blue-200"
  ]

  React.useEffect(() => {
    document.title = "SignUp"
    const randomNumber = Math.floor(Math.random() * 9)
    setData((prev) => ({
      ...prev,
      bg_color: bgColor[randomNumber]
    }))
  }, [])

  const checkEmail = async (e) => {
    setLoading(true)
    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/check-user`

    try {
      if (data.email) {
        const response = await axios.post(URL, data)

        if (response.data.success) {
          setLoading(false)
          toast.success(response.data.message)
          setEmailVerified(true)
          setData((prev) => ({
            ...prev,
            email: response.data.data
          }))
        }
        else {
          setData((prev) => ({
            ...prev,
            email: ""
          }))
          setEmailVerified(false)
        }
      } else {
        setLoading(false)
        setEmailVerified(false)
        toast.error("Please Enter Something First.")
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
      setLoading(false)
    }
  }

  const sendOtp = async (e) => {
    setLoading(true)
    e.preventDefault()
    e.stopPropagation()

    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/send-otp`

    try {
      const response = await axios.post(URL, data)

      if (response.data.success) {
        toast.success(response.data.message)
        setOtpSent(true)
        setLoading(false)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
      setLoading(false)
    }
  }

  const handleOtpChange = (e) => {
    setOtp(e.target.value)
  }

  const handleOnChange = (e) => {
    const { name, value } = e.target
    setData((prev) => {
      return {
        ...prev,
        [name]: value
      }
    })
  }

  const handleUploadPhoto = async (e) => {
    setLoading(true)
    const file = e.target.files[0]
    const uploadPhoto = await uploadFile(file)
    setUploadPhoto(file)

    setData((prev) => ({
      ...prev,
      profile_pic: uploadPhoto?.url

    }))
    setLoading(false)
  }

  const handleClearUploadPhoto = (e) => {
    e.stopPropagation()
    e.preventDefault()
    setUploadPhoto(null)
  }

  const handleRegisterSubmit = async (e) => {
    setLoading(true)
    e.preventDefault()
    e.stopPropagation()

    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/register`

    try {
      const response = await axios.post(URL, {
        ...data,
        otp
      })

      if (response.data.success) {
        toast.success(response.data.message)
        setData({
          name: "",
          email: "",
          password: "",
          profile_pic: "",
          bg_color: ''
        })
        setLoading(false)
        navigate('/login')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
      setLoading(false)
    }
  }

  return (
    <div className='mt-5'>
      <div className='bg-white w-full max-w-md  rounded overflow-hidden p-4 mx-auto'>

        <h1 className='text-center mt-2 fw-bold' style={{ fontSize: "25px" }}>SignUp</h1>
        {
          !otpSent ?
            <form onSubmit={sendOtp}>
              <>
                <div className="form-floating mt-12">
                  <input name="email" type="email" className="form-control" id="floatingEmail" placeholder="name@example.com" value={data.email} onChange={handleOnChange} required autoFocus readOnly={emailVarified} />
                  <label htmlFor="floatingEmail">Email address</label>
                </div>
                <button type="button" className={`btn btn-primary my-3 w-100 d-${emailVarified && "none"}`} onClick={checkEmail}>Check Email</button>
              </>
              {emailVarified &&
                <>
                  <div className="form-floating my-3">
                    <input name="name" type="text" className="form-control" id="floatingInput" value={data.name} onChange={handleOnChange} required autoFocus />
                    <label htmlFor="floatingInput">Enter Your Name</label>
                  </div>

                  <div className="flex form-floating mb-3">
                    <input name='password' type={showPassword ? "text" : "password"} className="form-control" id="floatingPassword" placeholder="Password" value={data.password} onChange={handleOnChange} required />
                    <label htmlFor="floatingPassword">Password</label>
                    <button className="ms-2" type="button" onClick={() => {
                      setShowPassword(!showPassword)
                    }}>
                      {!showPassword ? (
                        <FontAwesomeIcon icon={faEye} />
                      ) : (
                        <FontAwesomeIcon icon={faEyeSlash} />
                      )}
                    </button>
                  </div>

                  <div className='flex flex-col mb-3'>
                    <label htmlFor='profile_pic'>
                      <div className='h-14 bg-slate-200 flex justify-center items-center border rounded hover:border-primary cursor-pointer'>
                        <p className='text-sm max-w-[300px] text-ellipsis line-clamp-1'>
                          {
                            uploadPhoto?.name ? uploadPhoto?.name : "Upload profile photo"
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

                    <input
                      type='file'
                      id='profile_pic'
                      name='profile_pic'
                      className='bg-slate-100 px-2 py-1 focus:outline-primary hidden'
                      onChange={handleUploadPhoto}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary w-100">Send Otp</button>
                </>
              }
            </form>
            :
            <form onSubmit={handleRegisterSubmit}>
              <div className="form-floating mt-12">
                <input name="otp" type="number" className="form-control" id="floatingLabel" value={otp} onChange={handleOtpChange} required autoFocus />
                <label htmlFor="floatingLabel">Enter Otp</label>
              </div>
              <button type="submit" className="btn btn-primary mt-3 w-100">Verify Otp</button>
            </form>
        }

        <p className='mt-3 text-center'>Already have an account? <Link to={"/login"} className='hover:text-primary font-semibold text-decoration-underline'>Login</Link></p>

        {loading &&
          (<div className='fixed top-0 bottom-0 left-0 right-0 flex justify-center items-center bg-gray-700 bg-opacity-40 z-10'>
            <Loading />
          </div>)
        }
      </div>
    </div>
  )
}

export default RegisterPage
