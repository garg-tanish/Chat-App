import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  _id: "",
  name: "",
  email: "",
  token: "",
  profile_pic: "",
  onlineUser: [],
  blockedUsers: [],
  socketConnection: null
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      return {
        ...state,
        ...action.payload
      }
    },
    setToken: (state, action) => {
      return {
        ...state,
        token: action.payload
      }
    },
    logout: () => {
      return initialState
    },
    setOnlineUser: (state, action) => {
      return {
        ...state,
        onlineUser: action.payload
      }
    },
    setSocketConnection: (state, action) => {
      return {
        ...state,
        socketConnection: action.payload
      }
    },
    setBlockedUsers: (state, action) => {
      return {
        ...state,
        blockedUsers: action.payload
      }
    },
  },
})

// Action creators are generated for each case reducer function
export const { setUser, setToken, logout, setOnlineUser, setSocketConnection, setBlockedUsers } = userSlice.actions

export default userSlice.reducer