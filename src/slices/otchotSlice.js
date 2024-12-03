import {createSlice , createAsyncThunk} from "@reduxjs/toolkit";
import {useHttp} from "../hooks/http.hook";
import {BackUrl, headers} from "../constants/global";


export const fetchYear = createAsyncThunk(
    "otchotSlice/fetchYear",
    async (branchId) => {
        const {request} = useHttp()

        return await request(`${BackUrl}month_years_calendar` , "GET" , null , headers())
    }
)
export const fetchData = createAsyncThunk(
    "otchotSlice/fetchData",
    async ({id , data}) => {
        const {request} = useHttp()
       return await request(`${BackUrl}debit_credit${id ? `/${id}` : "_account"}`, "POST", JSON.stringify(data), headers())

    }
)





const initialState = {
    year: [],
    data: [],
    loading: [],
    error: []
}

const otchotSlice = createSlice({
    name: "otchotSlice",
    initialState,
    reducers: {},
    extraReducers: builder =>
        builder
            .addCase(fetchYear.pending , state => {
                state.loading = true
            })
            .addCase(fetchYear.fulfilled , (state , action) => {
                state.loading = false
                state.error = true
                state.year = action.payload.years
            })
            .addCase(fetchYear.rejected , state => {
                state.loading = false
                state.error = true
            })

            .addCase(fetchData.pending , state => {
                state.loading = true
            })
            .addCase(fetchData.fulfilled , (state , action) => {
                state.loading = false
                state.error = true
                state.data = action.payload
            })
            .addCase(fetchData.rejected , state => {
                state.loading = false
                state.error = true
            })


})

export default otchotSlice.reducer