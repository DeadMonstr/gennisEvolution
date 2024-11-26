import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";

const initialState = {
    register: {
        roles: [],
        staffs: []
    },

    dividends: [],
    accountPayable: [],
    staffSalary: [],


    loading: "idle"

}


export const fetchAccountantRegisterRoles = createAsyncThunk(
    'accountantSlice/fetchAccountantRegisterData',
    async () => {
        const {request} = useHttp();
        return await request(`${BackUrl}roles`, "GET", null, headers())
    }
)

export const fetchAccountantRegisteredStaffs = createAsyncThunk(
    'accountantSlice/fetchAccountantRegisteredStaffs',
    async () => {
        const {request} = useHttp();
        return await request(`${BackUrl}register_camp_staff`, "GET", null, headers())
    }
)


export const fetchAccountantBookKeepingDividend = createAsyncThunk(
    'accountantSlice/fetchAccountantBookKeepingDividend',
    async (id) => {
        const {request} = useHttp();
        return await request(`${BackUrl}get_dividend/${id}`, "GET", null, headers())
    }
)


export const fetchAccountantBookKeepingAccountPayable = createAsyncThunk(
    'accountantSlice/fetchAccountantBookKeepingAccountPayable',
    async (id) => {
        const {request} = useHttp();
        return await request(`${BackUrl}get_account_payable/${id}`, "GET", null, headers())
    }
)

export const fetchAccountantBookKeepingStaffSalary = createAsyncThunk(
    'accountantSlice/fetchAccountantBookKeepingStaffSalary',
    async (id) => {
        const {request} = useHttp();
        return await request(`${BackUrl}get_account_payable/${id}`, "GET", null, headers())
    }
)


const accountantSlice = createSlice({
    name: "accountantSlice",
    initialState,
    reducers: {
        changePaymentTypeDividend: (state, action) => {

            state.dividends = state.dividends.map(item => {

                if (item.id === action.payload.id) {
                    return {...item, payment_type: action.payload.payment_type}
                }
                return item
            })
        },
        onAddDevidend: (state , action) => {
            state.dividends = [...state.dividends , action.payload]
            console.log(action.payload)
        },
        onDeleteDividend: (state , action) => {
            state.dividends = state.dividends.filter(item => item.id !== action.payload.id)
            console.log(action.payload)
        },


        onAddPayable: (state , action) => {
            state.accountPayable = [...state.accountPayable , action.payload]
            console.log(action.payload)
        },
        onDeletePayable: (state , action) => {
            state.accountPayable = state.accountPayable.filter(item => item.id !== action.payload.id)
            console.log(action.payload)
        },

        changePaymentTypePayable: (state, action) => {

            state.accountPayable = state.accountPayable.map(item => {

                if (item.id === action.payload.id) {
                    return {...item, payment_type: action.payload.payment_type}
                }
                return item
            })
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchAccountantRegisterRoles.pending, state => {
                state.loading = 'loading'
            })
            .addCase(fetchAccountantRegisterRoles.fulfilled, (state, action) => {
                state.register.roles = action.payload.roles;
            })
            .addCase(fetchAccountantRegisterRoles.rejected, state => {
                state.loading = 'error'
            })

            .addCase(fetchAccountantRegisteredStaffs.pending, state => {
                state.loading = 'loading'
            })
            .addCase(fetchAccountantRegisteredStaffs.fulfilled, (state, action) => {
                state.register.staffs = action.payload.staffs;
            })
            .addCase(fetchAccountantRegisteredStaffs.rejected, state => {
                state.loading = 'error'
            })

            .addCase(fetchAccountantBookKeepingDividend.pending, state => {
                state.loading = 'loading'
            })
            .addCase(fetchAccountantBookKeepingDividend.fulfilled, (state, action) => {
                state.dividends = action.payload.dividends;
            })
            .addCase(fetchAccountantBookKeepingDividend.rejected, state => {
                state.loading = 'error'
            })


            .addCase(fetchAccountantBookKeepingAccountPayable.pending, state => {
                state.loading = 'loading'
            })
            .addCase(fetchAccountantBookKeepingAccountPayable.fulfilled, (state, action) => {
                state.accountPayable = action.payload.account_payables;
            })
            .addCase(fetchAccountantBookKeepingAccountPayable.rejected, state => {
                state.loading = 'error'
            })

            .addCase(fetchAccountantBookKeepingStaffSalary.pending, state => {
                state.loading = 'loading'
            })
            .addCase(fetchAccountantBookKeepingStaffSalary.fulfilled, (state, action) => {
                state.staffSalary = action.payload.staffSalary;
            })
            .addCase(fetchAccountantBookKeepingStaffSalary.rejected, state => {
                state.loading = 'error'
            })

    }
})


const {actions, reducer} = accountantSlice;

export default reducer

export const {
    changePaymentType ,
    onAddDevidend ,
    onAddPayable,
    onDeleteDividend,
    changePaymentTypeDividend,
    changePaymentTypePayable,
    onDeletePayable
} = actions






