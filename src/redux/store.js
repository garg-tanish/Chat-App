import userReducer from './userSlice'
import messageReducer from './messageSlice'
import { configureStore } from '@reduxjs/toolkit'


export const store = configureStore({
  reducer: {
    user: userReducer,
    messages: messageReducer
  },
})
