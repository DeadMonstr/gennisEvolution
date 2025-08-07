import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {useHttp} from "../hooks/http.hook";
import {BackUrl, headers} from "../constants/global";


export const fetchBlockTests = createAsyncThunk(
    "blockTestSlice/fetchBlockTests",
    async () => {
        const {request} = useHttp()
        return await request(`${BackUrl}student/students_test`, "GET", null, headers())
    }
)


export const fetchBlockTestsSchool = createAsyncThunk(
    "blockTestSlice/fetchBlockTestsSchool",
    async () => {
        const {request} = useHttp()
        return await request(`${BackUrl}student/schools`, "GET", null, headers())
    }
)
export const fetchDefenations = createAsyncThunk(
    "blockTestSlice/fetchDefenations",
    async () => {
        const {request} = useHttp()
        return await request(`${BackUrl}student/defenations`, "GET", null, headers())
    }
)







const initialState = {
    loading: false,
    error: false,
    data: [],
    school: [],
    defenations: [],

}

const blockTestSlice = createSlice({
    name: "blockTestSlice",
    initialState,
    reducers: {},
    extraReducers: builder =>
        builder
            .addCase(fetchBlockTests.pending , state => {
                state.loading = true
                state.error = false
            })
            .addCase(fetchBlockTests.fulfilled , (state, action) => {
                state.error = false
                state.loading = false
                state.data = action.payload
            })

            .addCase(fetchBlockTests.rejected , state => {
                state.loading = false
                state.error = true
            })




            .addCase(fetchBlockTestsSchool.pending , state => {
                state.loading = true
                state.error = false
            })
            .addCase(fetchBlockTestsSchool.fulfilled , (state, action) => {
                state.error = false
                state.loading = false
                state.school = action.payload
            })

            .addCase(fetchBlockTestsSchool.rejected , state => {
                state.loading = false
                state.error = true
            })


            .addCase(fetchDefenations.pending , state => {
                state.loading = true
                state.error = false
            })
            .addCase(fetchDefenations.fulfilled , (state, action) => {
                state.error = false
                state.loading = false
                state.defenations = action.payload
                console.log(action.payload , "hello")
            })

            .addCase(fetchDefenations.rejected , state => {
                state.loading = false
                state.error = true
            })









})

const {actions, reducer} = blockTestSlice
export default reducer