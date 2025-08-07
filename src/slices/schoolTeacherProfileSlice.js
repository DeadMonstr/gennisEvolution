import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";

const initialState = {
    data: {

    },
    students: [],
    account: [],

    fetchSchoolTeacherProfileStatus: "idle",

}


export const  fetchSchoolTeacherProfile = createAsyncThunk(
    'schoolTeacherProfileSlice/fetchSchoolTeacherProfile',
    async (id) => {
        const {request} = useHttp();

        return await request(`${BackUrl}school/crud_school_user/${id}`,"GET",null,headers())
    }
)






const schoolTeacherProfileSlice = createSlice({
    name: "schoolTeacherProfileSlice",
    initialState,
    reducers: {
        addStudent: (state, action) => {
            state.students.push(action.payload)
        },
        changeStudent: (state, action) => {
            state.students = state.students.map(item => {
                if (item.id === action.payload.id) {
                    return {...item, ...action.payload}
                }
                return item
            })
        },
        deleteStudent: (state, action) => {
            state.students = state.students.filter(item => item.id !== action.payload)
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchSchoolTeacherProfile.pending,state => {state.fetchSchoolTeacherProfileStatus = 'loading'} )
            .addCase(fetchSchoolTeacherProfile.fulfilled,(state, action) => {
                state.fetchSchoolTeacherProfileStatus = 'success';
                state.data = action.payload.user
                state.students = action.payload.students

            })
            .addCase(fetchSchoolTeacherProfile.rejected,state => {state.fetchSchoolTeacherProfileStatus = 'error'} )


    }
})



const {actions,reducer} = schoolTeacherProfileSlice;

export default reducer

export const {addStudent,changeStudent,deleteStudent} = actions

