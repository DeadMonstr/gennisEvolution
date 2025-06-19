import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";

const initialState = {
    data: [],

    fetchSchoolsStatus: "idle",

}


export const  fetchSchools = createAsyncThunk(
    'schoolsSlice/fetchSchools',
    async () => {
        const {request} = useHttp();
        return await request(`${BackUrl}crud_school`,"GET",null,headers())
    }
)






const schoolsSlice = createSlice({
    name: "schoolsSlice",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchSchools.pending,state => {state.fetchSchoolsStatus = 'loading'} )
            .addCase(fetchSchools.fulfilled,(state, action) => {
                state.fetchSchoolsStatus = 'success';
                state.data = action.payload.schools

            })
            .addCase(fetchSchools.rejected,state => {state.fetchSchoolsStatus = 'error'} )


    }
})



const {actions,reducer} = schoolsSlice;

export default reducer

// export const {} = actions

