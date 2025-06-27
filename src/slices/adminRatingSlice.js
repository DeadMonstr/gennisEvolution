import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";

const initialState = {
    data: [
        {
            "completed_leads": 3,
            "completed_new_students": 0,
            "debt_students": 0,
            "leads": 0,
            "location_id": 4,
            "location_name": "Sergeli",
            "new_students": 1,
            "not_completed_leads": 1,
            "task_statistics": null
        },
        {
            "completed_leads": 0,
            "completed_new_students": 0,
            "debt_students": 0,
            "leads": 0,
            "location_id": 2,
            "location_name": "Gazalkent",
            "new_students": 0,
            "not_completed_leads": 0,
            "task_statistics": null
        },
        {
            "completed_leads": 0,
            "completed_new_students": 0,
            "debt_students": 0,
            "leads": 0,
            "location_id": 3,
            "location_name": "Chirchiq",
            "new_students": 0,
            "not_completed_leads": 0,
            "task_statistics": null
        },
        {
            "completed_leads": 0,
            "completed_new_students": 0,
            "debt_students": 0,
            "leads": 0,
            "location_id": 5,
            "location_name": "Nurafshon",
            "new_students": 0,
            "not_completed_leads": 0,
            "task_statistics": null
        },
        {
            "completed_leads": 0,
            "completed_new_students": 0,
            "debt_students": 0,
            "leads": 0,
            "location_id": 1,
            "location_name": "Xo'jakent",
            "new_students": 0,
            "not_completed_leads": 0,
            "task_statistics": null
        }
    ],
    loading: "idle"
}

export const fetchAdminRating = createAsyncThunk(
    'adminRatingSlice/fetchAdminRating',
    async ({date}) => {
        const {request} = useHttp();
        return await request(`${BackUrl}task_rating/task_rating?date=${date}`, "GET", null, headers())
    }
)


const adminRatingSlice = createSlice({
    name: "adminRatingSlice",
    initialState,
    reducers: {
    },
    extraReducers: builder => {
        builder
            .addCase(fetchAdminRating.pending, (state) => {
                state.loading = "loading"
            })
            .addCase(fetchAdminRating.fulfilled, (state, action) => {
                state.loading = "success"
                state.data = action.payload.data
            })
            .addCase(fetchAdminRating.rejected, (state) => {
                state.loading = "error"
            })
    }
})


const {actions, reducer} = adminRatingSlice;

export default reducer

export const {
} = actions






