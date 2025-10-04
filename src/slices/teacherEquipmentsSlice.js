import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import { BackUrl, headers } from "constants/global";
import { useHttp } from "hooks/http.hook";

export const fetchQuarterMasterData = createAsyncThunk(
    "teacherEquipments/fetchQuarterMasterData",
    ({id, status}) => {
        const {request} = useHttp()
        return request(`${BackUrl}teacher/teacher-requests?location_id=${id}${status !== "all" ? `&status=${status}` : ""}`, "GET", null, headers())
    }
)

const initialState = {
    quarterMasters: [],
    loading: false,
    error: null
}

export const teacherEquipments = createSlice({
    name: "teacherEquipments",
    initialState,
    reducers: {
        updateLoading: (state) => {
            state.loading = true
        },
        updateQuarter: (state, action) => {
            state.loading = false
            state.quarterMasters = state.quarterMasters.map(item => {
                if (item.id === action.payload.id) {
                    return action.payload
                } else return item
            })
        }
    },
    extraReducers: builder =>
        builder
            .addCase(fetchQuarterMasterData.pending, (state, action) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchQuarterMasterData.fulfilled, (state, action) => {
                state.quarterMasters = action.payload
                state.loading = false
                state.error = null
            })
            .addCase(fetchQuarterMasterData.rejected, (state) => {
                state.error = "error"
                state.loading = false
            })
})

export const {reducer: quarterMasterReducer, actions: quarterMasterActions} = teacherEquipments

export const {
    updateLoading,
    updateQuarter
} = quarterMasterActions
export default teacherEquipments.reducer