import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";

const initialState = {
    newStudents: [],
    debtorStudent: [],
    leads: [],
    // tasks: [],
    newStudentsStatus: "idle",
    debtorStudentStatus: "idle",
    leadsStatus: "idle"
}

export const fetchNewStudentsData = createAsyncThunk(
    'taskManager/fetchNewStudentsData',
    async (id) => {
        const {request} = useHttp();
        return await request(`${BackUrl}new_students_calling/${id}`, "GET", null, headers())
    }
)
export const fetchDebtorStudentsData = createAsyncThunk(
    'taskManager/fetchDebtorStudentsData',
    async (id) => {
        const {request} = useHttp();
        return await request(`${BackUrl}student_in_debts/${id}`, "GET", null, headers())
    }
)
export const fetchLeadsData = createAsyncThunk(
    'taskManager/fetchLeadsData',
    async (id) => {
        const {request} = useHttp();
        return await request(`${BackUrl}get_leads_location/news/${id}`, "GET", null, headers())
    }
)

const TaskManagerSlice = createSlice({
    name: 'taskManager',
    initialState,
    reducers: {
        fetchingItems: (state) => {
            state.tasksLoadingStatus = "loading"
        },
        changeNewStudents: (state, action) => {
            state.newStudents = [
                ...state.newStudents.filter(item => item.id !== action.payload.id),
                action.payload
            ]
        },
        changeNewStudentsDel: (state, action) => {
            state.newStudents = state.newStudents.filter(item => item !== action.payload.id)
        },
        changeDebtorStudents: (state, action) => {
            state.debtorStudent = [
                ...state.debtorStudent.filter(item => item.id !== action.payload.id),
                action.payload
            ]
        },
        changeDebtorStudentsDel: (state, action) => {
            state.debtorStudent = state.debtorStudent.filter(item => item.id !== action.payload.id)
        },
        changeLead: (state, action) => {
            state.leads = [
                ...state.leads.filter(item => item.id !== action.payload.id),
                action.payload
            ]
        },
        fetchedError: (state) => {
            state.tasksLoadingStatus = "error"
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchNewStudentsData.pending, (state) => {
                state.newStudentsStatus = "loading"
            })
            .addCase(fetchNewStudentsData.fulfilled, (state, action) => {
                state.newStudents = action.payload.students
                state.newStudentsStatus = "success"
            })
            .addCase(fetchNewStudentsData.rejected, (state) => {
                state.newStudentsStatus = "error"
            })
            .addCase(fetchDebtorStudentsData.pending, (state) => {
                state.debtorStudentStatus = "loading"
            })
            .addCase(fetchDebtorStudentsData.fulfilled, (state, action) => {
                state.debtorStudent = action.payload.students
                state.debtorStudentStatus = "success"
            })
            .addCase(fetchDebtorStudentsData.rejected, (state) => {
                state.debtorStudentStatus = "error"
            })
            .addCase(fetchLeadsData.pending, (state) => {
                state.leadsStatus = "loading"
            })
            .addCase(fetchLeadsData.fulfilled, (state, action) => {
                state.leads = action.payload.leads
                state.leadsStatus = "success"
            })
            .addCase(fetchLeadsData.rejected, (state) => {
                state.leadsStatus = "error"
            })
    }
})

const {actions, reducer} = TaskManagerSlice
export default reducer

export const {
    fetchingItems,
    changeDebtorStudents,
    changeDebtorStudentsDel,
    changeLead,
    fetchedError,
    changeNewStudents,
    changeNewStudentsDel
} = actions