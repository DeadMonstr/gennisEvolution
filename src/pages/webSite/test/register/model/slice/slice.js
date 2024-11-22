import { createSlice} from "@reduxjs/toolkit";
import {fetchData, fetchDataMk, fetchDefenations, fetchFakultet, fetchGetHomeInfo} from "../thunk/thunk";


const initialState = {
    data: [],
    school: [],
    fak: [],
    homeInfo: [],
    defanations: [],
    loading: false,
    error: false
}




const registerSlice = createSlice({
    name: "registerSlice",
    initialState,
    reducers: {},
    extraReducers: builder =>
        builder
            .addCase(fetchData.pending, state => {
                state.error = false
                state.loading = true
            })
            .addCase(fetchData.fulfilled, (state, action) => {
                state.error = false
                state.loading = false
                state.data = action.payload
                // console.log(action.payload , "hello243242")

            })
            .addCase(fetchData.rejected, state => {
                state.error = true
                state.loading = false
            })


            .addCase(fetchDataMk.pending, state => {
                state.error = false
                state.loading = true
            })
            .addCase(fetchDataMk.fulfilled, (state, action) => {
                state.school = action.payload
                state.error = false
                state.loading = false
            })
            .addCase(fetchDataMk.rejected, state => {
                state.error = true
                state.loading = false
            })




            .addCase(fetchDefenations.pending, state => {
                state.error = false
                state.loading = true
            })
            .addCase(fetchDefenations.fulfilled, (state, action) => {
                state.defanations = action.payload
                state.error = false
                state.loading = false


            })
            .addCase(fetchDefenations.rejected, state => {
                state.error = true
                state.loading = false
            })




            .addCase(fetchFakultet.pending, state => {
                state.error = false
                state.loading = true
            })
            .addCase(fetchFakultet.fulfilled, (state, action) => {
                state.fak = action.payload
                state.error = false
                state.loading = false


            })
            .addCase(fetchFakultet.rejected, state => {
                state.error = true
                state.loading = false
            })



            .addCase(fetchGetHomeInfo.pending , state => {
                state.loading = true
                state.error = false
            })
            .addCase(fetchGetHomeInfo.fulfilled , (state, action) => {
                state.error = false
                state.loading = false
                state.homeInfo = action.payload.locations
            })

            .addCase(fetchGetHomeInfo.rejected , state => {
                state.loading = false
                state.error = true
            })


})

export default registerSlice.reducer