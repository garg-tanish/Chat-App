import React from 'react'
import axios from 'axios'
import toast from 'react-hot-toast';
import Avatar from '../components/Avatar';
import Loading from '../components/Loading'
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Forgotpassword = () => {

  const [otp, setOtp] = React.useState()
  const [loading, setLoading] = React.useState(false)
  const [otpSent, setOtpSent] = React.useState(false)
  const [isEmailValid, setEmailValid] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false);
  const [data, setData] = React.useState({ email: "", password: "", userId: "", profile_pic: "", name: "", bg_color: "" });

  const navigate = useNavigate()
  React.useEffect(() => {
    document.title = "Change Password"
  }, [])

  const handleOtpChange = (e) => {
    setOtp(e.target.value)
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

  const handleOnChange = (e) => {
    const { name, value } = e.target

    setData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleEmailSubmit = async (e) => {
    setLoading(true)
    e.preventDefault()
    e.stopPropagation()

    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/email`

    try {
      if (data.email) {
        const response = await axios.post(URL, data)

        if (response.data.success) {
          setEmailValid(true)
          toast.success(response.data.message)
          setData(prev => ({
            ...prev, userId: response.data.data._id, profile_pic: response.data.data.profile_pic, name: response.data.data.name, bg_color: response.data.data.bg_color
          }))
          setLoading(false)
        }
      } else {
        setLoading(false)
        setEmailValid(false)
        toast.error("Please Enter Something First.")
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
      setLoading(false)
    }
  }

  const changePassword = async (e) => {
    setLoading(true)
    e.preventDefault()
    e.stopPropagation()

    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/change-password`

    try {

      const response = await axios({
        method: "post",
        url: URL,
        data: { email: data.email, password: data.password, otp: otp }
      })

      if (response.data.success) {
        toast.success(response.data.message)
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
      <div className='bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto'>
        {
          isEmailValid &&
          <div className='d-flex justify-content-center'>
            <Avatar
              width={70}
              height={70}
              name={data.name}
              imageUrl={data.profile_pic}
              bg_color={data.bg_color}
            />
          </div>
        }
        <h1 className='text-center mt-2 fw-bold' style={{ fontSize: "25px" }}>Change Your Password</h1>

        {!otpSent ?
          <form onSubmit={sendOtp}>

            <>
              <div className="form-floating mt-12">
                <input name="email" type="email" className="form-control" id="floatingEmail" placeholder="name@example.com" value={data.email} onChange={handleOnChange} required autoFocus readOnly={isEmailValid} />
                <label htmlFor="floatingEmail">Email address</label>
              </div>
              <button type="button" className={`btn btn-primary w-100 my-4 d-${isEmailValid && "none"}`} onClick={handleEmailSubmit}>Verify Email</button>
            </>

            {
              isEmailValid && !otpSent &&
              <>
                <div className="d-flex form-floating my-3">
                  <input name="password" type={showPassword ? "text" : "password"} className="form-control" id="floatingPassword" value={data.password} onChange={handleOnChange} required autoFocus />
                  <label htmlFor="floatingPassword">Enter New Password</label>
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
                <button type="submit" className="btn btn-primary w-100 my-2">Send Otp</button>
              </>
            }
          </form>
          :
          <form onSubmit={changePassword}>
            <>
              <div class="form-floating mt-12 mb-2">
                <input name="otp" type="number" className="form-control" id="floatingInput" value={otp} onChange={handleOtpChange} required />
                <label htmlFor="floatingInput">Enter Otp</label>
              </div>
              <button type="submit" className="btn btn-primary w-100 my-3">Change Password</button>
            </>
          </form>
        }

        <p className='text-center'>Change your mind? <Link to={"/login"} className='hover:text-primary font-semibold text-decoration-underline'>Back to Login</Link></p>

        {loading &&
          (<div className='fixed top-0 bottom-0 left-0 right-0 flex justify-center items-center bg-gray-700 bg-opacity-40 z-10'>
            <Loading />
          </div>)
        }
      </div>
    </div>
  )
}

export default Forgotpassword
