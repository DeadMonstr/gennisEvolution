
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";

const initialState = {
    register: {
        roles: [],
        staffs: []
    }
}


export const  fetchAccountantRegisterRoles = createAsyncThunk(
    'accountantSlice/fetchAccountantRegisterData',
    async () => {
        const {request} = useHttp();
        return await request(`${BackUrl}roles`,"GET",null,headers())
    }
)

export const  fetchAccountantRegisteredStaffs = createAsyncThunk(
    'accountantSlice/fetchAccountantRegisteredStaffs',
    async () => {
        const {request} = useHttp();
        return await request(`${BackUrl}register_camp_staff`,"GET",null,headers())
    }
)




const accountantSlice = createSlice({
    name: "accountantSlice",
    initialState,
    reducers: {


    },
    extraReducers: builder => {
        builder
            .addCase(fetchAccountantRegisterRoles.pending,state => {
                state.fetchDeletedStudentStatus = 'loading'
            })
            .addCase(fetchAccountantRegisterRoles.fulfilled,(state, action) => {
                state.register.roles = action.payload.roles;
            })
            .addCase(fetchAccountantRegisterRoles.rejected,state => {state.fetchDeletedStudentStatus = 'error'} )

            .addCase(fetchAccountantRegisteredStaffs.pending,state => {
                state.fetchDeletedStudentStatus = 'loading'
            })
            .addCase(fetchAccountantRegisteredStaffs.fulfilled,(state, action) => {
                state.register.staffs = action.payload.staffs;
            })
            .addCase(fetchAccountantRegisteredStaffs.rejected,state => {state.fetchDeletedStudentStatus = 'error'} )

    }
})



const {actions,reducer} = accountantSlice;

export default reducer

export const {} = actions






