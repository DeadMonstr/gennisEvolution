import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    type: "",
    currentFilters: {},
    page: 1
}

const currentFilterSlice = createSlice({
    name: "currentFilterSlice",
    initialState,
    reducers: {
        setType(state, action) {
            state.type = action.payload
        },
        setFilters: (state, action) => {
            console.log(action.payload, "payload")
            state.currentFilters = {
                ...state.currentFilters,
                ...action.payload,
            }
        },
        setPage: (state, action) => {
            state.page = action.payload
        }
    }
})

const {reducer, actions} = currentFilterSlice

export default reducer

export const {
    setType,
    setFilters,
    setPage,
} = actions

