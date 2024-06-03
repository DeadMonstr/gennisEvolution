import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    newStudents: [],
    tasks: [],
    tasksLoadingStatus: "idle"
}

const TaskManagerSlice = createSlice({
    name: 'taskManager',
    initialState,
    reducers: {
        fetchingItems: (state) => {
            state.tasksLoadingStatus = "loading"
        },
        fetchedItems: (state, action) => {
            state.tasks = action.payload
            state.newStudents = action.payload.students
            state.tasksLoadingStatus = "success"
        },
        fetchedError: (state) => {
            state.tasksLoadingStatus = "error"
        },
        changeNewStudents: (state, action) => {
            state.newStudents = [
                ...state.newStudents.filter(item => item.id !== action.payload.id),
                action.payload
            ]
        },
        changeNewStudentsDel: (state, action) => {
            state.newStudents = state.newStudents.filter(item => item !== action.payload.id)
        }
    }
})

const {actions, reducer} = TaskManagerSlice
export default reducer

export const {
    fetchingItems,
    fetchedItems,
    fetchedError,
    changeNewStudents,
    changeNewStudentsDel
} = actions