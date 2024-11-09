import React from 'react'
import axios from 'axios'
import toast from 'react-hot-toast';
import Avatar from '../components/Avatar';
import Loading from '../components/Loading';
import { useDispatch } from 'react-redux';
import { setToken } from '../redux/userSlice';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const LoginPage = () => {

  const [loading, setLoading] = React.useState(false)
  const [isEmailValid, setEmailValid] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false);
  const [data, setData] = React.useState({ email: "", password: "", userId: "", profile_pic: "", name: "", bg_color: "" });

  const navigate = useNavigate()
  const dispatch = useDispatch()

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
          setData(prev => ({ ...prev, userId: response.data.data._id, profile_pic: response.data.data.profile_pic, name: response.data.data.name, bg_color: response.data.data.bg_color }))
          setLoading(false)
        }
      }
      else {
        setLoading(false)
        toast.error("Please Enter Something First.")
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
      setLoading(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    setLoading(true)
    e.preventDefault()
    e.stopPropagation()

    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/password`

    try {
      const response = await axios({
        method: 'post',
        url: URL,
        data: {
          userId: data.userId,
          password: data.password
        },
        withCredentials: true
      })

      if (response.data.success) {
        toast.success(response.data.message)
        dispatch(setToken(response?.data?.token))
        localStorage.setItem('token', response?.data?.token)
        setLoading(false)
        navigate('/')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
      setLoading(false)
    }
  }

  return (
    <div className='mt-5'>
      <div className='bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto'>
        {loading &&
          (<div className='fixed top-0 bottom-0 left-0 right-0 flex justify-center items-center bg-gray-700 bg-opacity-40 z-10'>
            <Loading />
          </div>)
        }
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

        <h1 className='text-center mt-2 fw-bold' style={{ fontSize: "25px" }}>Login</h1>

        <div className="form-floating mt-12">
          <input name="email" type="email" className="form-control" id="floatingEmail" placeholder="name@example.com" value={data.email} onChange={handleOnChange} required autoFocus readOnly={isEmailValid} />
          <label htmlFor="floatingEmail">Email address</label>
        </div>

        {
          isEmailValid ?
            <>
              <div className="d-flex form-floating my-3">
                <input name="password" type={showPassword ? "text" : "password"} className="form-control" id="floatingPassword" value={data.password} onChange={handleOnChange} required />
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
              <p className='text-right'><Link to={"/forgot-password"} className='hover:text-primary font-semibold text-decoration-underline'>Forgot password</Link></p>
              <button type="button" className="btn my-3 btn-primary w-100" onClick={handlePasswordSubmit}>Login</button>
            </>
            :
            <>
              <button type="button" className="btn btn-primary my-4 w-100" onClick={handleEmailSubmit}>Let's Go</button>
              <p className='text-center mb-2'>New User? <Link to={"/register"} className='hover:text-primary font-semibold text-decoration-underline'>SignUp</Link></p>
              <p className='text-center'>Don't remember your password? <Link to={"/forgot-password"} className='hover:text-primary font-semibold text-decoration-underline'>Forgot password</Link></p>
            </>
        }
      </div>
    </div>
  )
}

export default LoginPage