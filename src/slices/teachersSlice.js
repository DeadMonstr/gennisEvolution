import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";

const initialState = {
    teachers: [],
    btns: [],
    fetchTeachersStatus: "idle",
    totalCount: null,
    totalCount2: null,
}


export const  fetchTeachers = createAsyncThunk(
    'teachersSlice/fetchTeachers',
    async ({pageSize , currentPage}) => {
        const {request} = useHttp();
        return await request(`${BackUrl}teacher/get_teachers${pageSize ? `?offset=${(currentPage-1) * 50}&limit=${pageSize}` : ""}`,"GET",null,headers())
    }
)
export const  fetchTeachersByLocation = createAsyncThunk(
    'teachersSlice/fetchTeachersByLocation',
    async ({locationId , pageSize , currentPage , search}) => {
        const {request} = useHttp();
        return await request(`${BackUrl}teacher/get_teachers_location/${locationId}${pageSize ? `?offset=${(currentPage-1) * 50}&limit=${pageSize}` : ""}${search ? `&search=${search}` : ""}`,"GET",null,headers())
    }
)

export const  fetchTeachersByLocationWithoutPagination = createAsyncThunk(
    'teachersSlice/fetchTeachersByLocationWithoutPagination',
    async ({locationId }) => {
        const {request} = useHttp();
        return await request(`${BackUrl}teacher/get_teachers_group/${locationId}`,"GET",null,headers())
    }
)



export const  fetchDeletedTeachersByLocation = createAsyncThunk(
    'teachersSlice/fetchDeletedTeachersByLocation',
    async ({locationId , pageSize , currentPage , search}) => {
        const {request} = useHttp();
        return await request(`${BackUrl}teacher/get_deletedTeachers_location/${locationId}${pageSize ? `?offset=${(currentPage-1) * 50}&limit=${pageSize}` : ""}${search ? `&search=${search}` : ""}`,"GET",null,headers())
    }
)



const teachersSlice = createSlice({
    name: "teachersSlice",
    initialState,
    reducers: {
        deleteTeacher: (state,action) => {
            state.teachers = state.teachers.filter(item => item.id !== action.payload.id)
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchTeachers.pending,state => {state.fetchTeachersStatus = 'loading'} )
            .addCase(fetchTeachers.fulfilled,(state, action) => {
                state.fetchTeachersStatus = 'success';
                state.teachers = action.payload.teachers
                state.totalCount2 = action.payload?.pagination

            })
            .addCase(fetchTeachers.rejected,state => {state.fetchTeachersStatus = 'error'} )

            .addCase(fetchTeachersByLocation.pending,state => {state.fetchTeachersStatus = 'loading'} )
            .addCase(fetchTeachersByLocation.fulfilled,(state, action) => {
                state.fetchTeachersStatus = 'success';
                state.teachers = action.payload.teachers
                state.totalCount = action.payload?.pagination
            })
            .addCase(fetchTeachersByLocation.rejected,state => {state.fetchTeachersStatus = 'error'} )

            .addCase(fetchTeachersByLocationWithoutPagination.pending,state => {state.fetchTeachersStatus = 'loading'} )
            .addCase(fetchTeachersByLocationWithoutPagination.fulfilled,(state, action) => {
                state.fetchTeachersStatus = 'success';
                state.teachers = action.payload.teachers

            })
            .addCase(fetchTeachersByLocationWithoutPagination.rejected,state => {state.fetchTeachersStatus = 'error'} )


            .addCase(fetchDeletedTeachersByLocation.pending,state => {state.fetchTeachersStatus = 'loading'} )
            .addCase(fetchDeletedTeachersByLocation.fulfilled,(state, action) => {
                state.fetchTeachersStatus = 'success';
                state.teachers = action.payload.teachers
                state.totalCount = action.payload?.pagination

            })
            .addCase(fetchDeletedTeachersByLocation.rejected,state => {state.fetchTeachersStatus = 'error'} )
    }
})



const {actions,reducer} = teachersSlice;

export default reducer

export const {deleteTeacher} = actions

