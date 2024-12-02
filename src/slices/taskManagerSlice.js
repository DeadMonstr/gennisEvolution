import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";

const initialState = {

    isTable: false,

    unCompleted: {
        debtors: [],
        students: [],
        leads: []
    },

    completed: {
        debtors: [],
        students: [],
        leads: []
    },


    newStudents: [],
    completedNewStudents: [],
    debtorStudent: [],
    completedDebtorStudent: [],
    leads: [],
    completedLeads: [],



    progress: null,
    allProgress: null,

    search: [],


    searchStatus: "idle",
    newStudentsStatus: "idle",
    debtorStudentStatus: "idle",
    leadsStatus: "idle",

    progressStatus: "idle",
    unCompletedStatus: "idle",
    completedStatus: "idle",


}

export const fetchNewStudentsData = createAsyncThunk(
    'taskManager/fetchNewStudentsData',
    async (id) => {
        const {request} = useHttp();
        return await request(`${BackUrl}task_new_students_calling/${id}`, "GET", null, headers())
    }
)

export const fetchLeadsData = createAsyncThunk(
    'taskManager/fetchLeadsData',
    async (id) => {
        const {request} = useHttp();
        return await request(`${BackUrl}get_leads_location/news/${id}`, "GET", null, headers())
    }
)

// export const fetchCompletedDebtorsData = createAsyncThunk(
//     'taskManager/fetchCompletedDebtorsData',
//     async (id) => {
//         const {request} = useHttp();
//         return await request(`${BackUrl}get_completed_tasks/${id}`, "GET", null, headers())
//     }
// )


export const fetchDebtorsData = createAsyncThunk(
    'taskManager/fetchDebtorStudentsData',
    async (data) => {

        const {locationId,date} = data

        const {request} = useHttp();
        return await request(`${BackUrl}student_debts_progress/${locationId}/${date}`, "GET", null, headers())
    }
)

export const fetchCompletedDebtorsData = createAsyncThunk(
    'taskManager/fetchCompletedDebtorsData',
    async (data) => {

        const {locationId,date} = data

        const {request} = useHttp();
        return await request(`${BackUrl}student_debts_completed/${locationId}/${date}`, "GET", null, headers())
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
                ...state.newStudents.filter(item => item.id !== action.payload.student.id),
                action.payload.student.info
            ]
        },
        changeNewStudentsDel: (state, action) => {
            console.log(action.payload)
            state.newStudents = state.newStudents.filter(item => item.id !== action.payload.student.id)
        },
        // changeDebtorStudents: (state, action) => {
        //     state.debtorStudent = [
        //         ...state.debtorStudent.filter(item => item.id !== action.payload.student.id),
        //         action.payload.student
        //     ]
        // },
        //
        onDelDebtors: (state, action) => {

            state.unCompleted.debtors = state.unCompleted.debtors.filter(item => item.id !== action.payload.student.id)
        },

        onChangeProgress: (state, action) => {
            state.progress = action.payload.progress
            state.allProgress = action.payload.allProgress
        },


        changeLead: (state, action) => {
            state.leads = state.leads.filter(item => item.id !== action.payload.id)
        },
        deleteLead: (state, action) => {
            state.leads = state.leads.filter(item => item.id !== action.payload.id)
        },
        fetchedError: (state) => {
            state.tasksLoadingStatus = "error"
        },
        fetchingProgress: (state) => {
            state.progressStatus = "loading"
        },
        fetchedProgress: (state, action) => {
            state.progress = action.payload
            state.progressStatus = "success"
        },
        fetchedProgressError: (state) => {
            state.progressStatus = "error"
        },
        fetchingSearch: (state) => {
            state.searchStatus = "loading"
        },
        fetchedSearch: (state, action) => {
            state.search = action.payload
            state.searchStatus = "success"
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchDebtorsData.pending, (state) => {
                state.unCompletedStatus = "loading"
                state.progressStatus = "loading"
            })
            .addCase(fetchDebtorsData.fulfilled, (state, action) => {
                state.unCompleted.debtors = action.payload.students || []
                state.allProgress = action.payload.task_daily_statistics
                state.progress = action.payload.task_statistics
                state.isTable = action.payload.table
                state.unCompletedStatus = "success"
                state.progressStatus = "success"
            })
            .addCase(fetchDebtorsData.rejected, (state) => {
                state.unCompletedStatus = "error"
                state.progressStatus = "error"
            })

            .addCase(fetchCompletedDebtorsData.pending, (state) => {
                state.completedStatus = "loading"
                state.progressStatus = "loading"
            })
            .addCase(fetchCompletedDebtorsData.fulfilled, (state, action) => {
                state.completed.debtors = action.payload.students || []
                state.allProgress = action.payload.task_daily_statistics
                state.progress = action.payload.task_statistics
                state.isTable = action.payload.table
                state.completedStatus = "success"
                state.progressStatus = "success"
            })
            .addCase(fetchCompletedDebtorsData.rejected, (state) => {
                state.completedStatus = "error"
                state.progressStatus = "error"
            })





            .addCase(fetchNewStudentsData.pending, (state) => {
                state.newStudentsStatus = "loading"
            })
            .addCase(fetchNewStudentsData.fulfilled, (state, action) => {
                state.newStudents = action.payload.students
                state.completedNewStudents = action.payload.completed_tasks
                state.newStudentsStatus = "success"
            })
            .addCase(fetchNewStudentsData.rejected, (state) => {
                state.newStudentsStatus = "error"
            })






            .addCase(fetchLeadsData.pending, (state) => {
                state.leadsStatus = "loading"
            })
            .addCase(fetchLeadsData.fulfilled, (state, action) => {
                state.leads = action.payload.leads
                state.completedLeads = action.payload.completed_tasks
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

    changeLead,
    deleteLead,
    fetchedError,
    changeNewStudents,
    changeNewStudentsDel,
    fetchingProgress,
    fetchedProgress,
    fetchedProgressError,
    fetchingSearch,
    fetchedSearch,

    onChangeProgress,
    onDelDebtors
} = actions