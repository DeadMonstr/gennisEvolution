import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";

const initialState = {

    info: {},
    director: {
        id: 0,
        name: "",
        surname: "",
        share: "",
        tel: "",

    },
    teachers: [
        {
            id: 0,
            name: "",
            surname: "",
            share: "",
            tel: "",

        }
    ],


    fetchInfoStatus: "idle",
    fetchTeachersStatus: "idle",
    fetchDirectorsStatus: "idle",
}


export const fetchSchoolInfo = createAsyncThunk(
    'schoolProfileSlice/fetchSchoolInfo',
    async (id) => {
        const {request} = useHttp();

        return await request(`${BackUrl}crud_school/${id}`, "GET", null, headers())
    }
)
// export const  fetchSchoolDirectors = createAsyncThunk(
//     'schoolProfileSlice/fetchSchoolDirectors',
//     async (id) => {
//         const {request} = useHttp();
//         return await request(`${BackUrl}/${id}`,"GET",null,headers())
//     }
// )

export const fetchSchoolTeachers = createAsyncThunk(
    'schoolProfileSlice/fetchSchoolTeachers',
    async (id) => {
        const {request} = useHttp();
        return await request(`${BackUrl}room_profile/${id}`, "GET", null, headers())
    }
)


const schoolProfileSlice = createSlice({
    name: "schoolProfileSlice",
    initialState,
    reducers: {
        changeSchoolDirector: (state, action) => {
            state.director = action.payload
        },
        addSchoolDirector: (state, action) => {
            state.director = action.payload
        },
        changeSchoolTeacher: (state, action) => {
            state.teachers = state.teachers.map(item => {
                if (item.id === action.payload.id) {
                    return {...action.payload}
                }
                return item
            })
        },
        addSchoolTeacher: (state, action) => {
            state.teachers = [...state.teachers, action.payload]
        },
        deleteSchoolDirector: (state) => {
            state.director = {}
        },
        deleteSchoolTeacher: (state,action) => {
            state.teachers = state.teachers.filter(item => item.id !== action.payload)
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchSchoolInfo.pending, state => {
                state.fetchInfoStatus = 'loading'
            })
            .addCase(fetchSchoolInfo.fulfilled, (state, action) => {
                state.fetchInfoStatus = 'success';
                state.info = action.payload.school
                state.teachers = action.payload.teachers
                state.director = action.payload.director
            })
            .addCase(fetchSchoolInfo.rejected, state => {
                state.fetchInfoStatus = 'error'
            })


    }
})


const {actions, reducer} = schoolProfileSlice;

export default reducer

export const {
    changeSchoolDirector,
    addSchoolDirector,
    deleteSchoolDirector,
    addSchoolTeacher,
    changeSchoolTeacher,
    deleteSchoolTeacher
} = actions

