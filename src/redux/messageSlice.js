import {createSlice} from '@reduxjs/toolkit'

const initialState = []

export const messageSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {
        createConversation: (state, action) => {

        },
        setConversations: (state, action) => {
            return action.payload
        }
    },
})

export const {setConversations} = messageSlice.actions

export default messageSlice.reducer
