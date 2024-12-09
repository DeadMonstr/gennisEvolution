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
    overhead: [],
    collection: [],
    typesMoney: [],
    invesment: [],



    date: [],


    staffSalaryMonths: [],
    staffSalaryMonth: [],

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
    async (data) => {
        const {request} = useHttp();
        return await request(`${BackUrl}get_dividend/${data.loc}/${data.isDeleted}/${data.isArchive}/`, "GET", null, headers())
    }
)


export const fetchAccountantBookKeepingAccountPayable = createAsyncThunk(
    'accountantSlice/fetchAccountantBookKeepingAccountPayable',
    async (data) => {
        const {request} = useHttp();
        return await request(`${BackUrl}get_account_payable/`, "GET", null, headers())
    }
)

export const fetchAccountantBookKeepingStaffSalary = createAsyncThunk(
    'accountantSlice/fetchAccountantBookKeepingStaffSalary',
    async (data) => {
        const {request} = useHttp();
        return await request(`${BackUrl}camp_staff_salaries/${data.isDeleted}/${data.isArchive}/`, "GET", null, headers())
    }
)


export const fetchAccountantBookKeepingOverhead = createAsyncThunk(
    'accountantSlice/fetchAccountantBookKeepingOverhead',
    async (data) => {
        const {request} = useHttp();
        return await request(`${BackUrl}get_account_overhead/${data.isDeleted}/${data.isArchive}/`, "GET", null, headers())
    }
)


export const fetchAccountantBookKeepingCollection = createAsyncThunk(
    'accountantSlice/fetchAccountantBookKeepingCollection',
    async (data) => {
        const {location, date, activeFilter} = data
        const {request} = useHttp();
        return await request(`${BackUrl}encashment/${location}`, "POST", JSON.stringify({
                ...date,
                activeFilter
            }),
            headers()
        )
    }
)

export const fetchAccountantBookKeepingTypesMoney = createAsyncThunk(
    'accountantSlice/fetchAccountantBookKeepingTypesMoney',
    async () => {
        const {request} = useHttp();
        return await request(`${BackUrl}account_report`, "GET", null, headers())
    }
)


export const fetchAccountantStaffSalaryMonths = createAsyncThunk(
    'accountantSlice/fetchAccountantStaffSalaryMonths',
    async (data) => {
        const {request} = useHttp();
        const {userId} = data
        return await request(`${BackUrl}camp_staff/${userId}`, "GET", null, headers())
    }
)

export const fetchAccountantStaffSalaryMonthInside = createAsyncThunk(
    'accountantSlice/fetchAccountantStaffSalaryMonthInside',
    async (data) => {
        const {request} = useHttp();
        const {activeDelete, monthId} = data
        return await request(`${BackUrl}camp_staff_inside/${monthId}/${activeDelete}/`, "GET", null, headers())
    }
)

export const fetchAccountantDate = createAsyncThunk(
    'accountantSlice/fetchAccountantDate',
    async () => {
        const {request} = useHttp();

        return await request(`${BackUrl}account_report_datas/`, "GET", null, headers())
    }
)



export const fetchAccountantInvestment = createAsyncThunk(
    'accountantSlice/fetchAccountantInvestment',
    async () => {
        const {request} = useHttp();

        return await request(`${BackUrl}investments`, "GET", null, headers())
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


        onAddStaff: (state, actions) => {
            state.register.staffs = [...state.register.staffs, actions.payload]
        },

        onAddDevidend: (state, action) => {
            state.dividends = [...state.dividends, action.payload]
            console.log(action.payload)
        },
        onDeleteDividend: (state, action) => {
            state.dividends = state.dividends.filter(item => item.id !== action.payload.id)
            console.log(action.payload)
        },


        onAddPayable: (state, action) => {
            state.accountPayable = [...state.accountPayable, action.payload]
            console.log(action.payload)
        },
        onDeletePayable: (state, action) => {
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


        onAddOverhead: (state, action) => {
            state.overhead = [...state.overhead, action.payload]
            console.log(action.payload)
        },

        onDeleteOverhead: (state, action) => {
            state.overhead = state.overhead.filter(item => item.id !== action.payload.id)
        },

        changePaymentTypeOverhead: (state, action) => {
            state.overhead = state.overhead.map(item => {
                if (item.id === action.payload.id) {
                    return {...action.payload.data}
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
                state.staffSalary = action.payload.salaries;
            })
            .addCase(fetchAccountantBookKeepingStaffSalary.rejected, state => {
                state.loading = 'error'
            })


            .addCase(fetchAccountantStaffSalaryMonths.pending, state => {
                state.loading = 'loading'
            })
            .addCase(fetchAccountantStaffSalaryMonths.fulfilled, (state, action) => {
                state.staffSalaryMonths = action.payload.data;
            })
            .addCase(fetchAccountantStaffSalaryMonths.rejected, state => {
                state.loading = 'error'
            })


            .addCase(fetchAccountantStaffSalaryMonthInside.pending, state => {
                state.loading = 'loading'
            })
            .addCase(fetchAccountantStaffSalaryMonthInside.fulfilled, (state, action) => {
                state.staffSalaryMonth = action.payload.data;
            })
            .addCase(fetchAccountantStaffSalaryMonthInside.rejected, state => {
                state.loading = 'error'
            })


            .addCase(fetchAccountantBookKeepingOverhead.pending, state => {
                state.loading = 'loading'
            })
            .addCase(fetchAccountantBookKeepingOverhead.fulfilled, (state, action) => {
                state.overhead = action.payload.overheads;
            })
            .addCase(fetchAccountantBookKeepingOverhead.rejected, state => {
                state.loading = 'error'
            })


            .addCase(fetchAccountantBookKeepingCollection.pending, state => {
                state.loading = 'loading'
            })
            .addCase(fetchAccountantBookKeepingCollection.fulfilled, (state, action) => {
                state.collection = action.payload;
            })
            .addCase(fetchAccountantBookKeepingCollection.rejected, state => {
                state.loading = 'error'
            })

            .addCase(fetchAccountantBookKeepingTypesMoney.pending, state => {
                state.loading = 'loading'
            })
            .addCase(fetchAccountantBookKeepingTypesMoney.fulfilled, (state, action) => {
                state.typesMoney = action.payload.account_reports;
            })
            .addCase(fetchAccountantBookKeepingTypesMoney.rejected, state => {
                state.loading = 'error'
            })




            .addCase(fetchAccountantDate.pending, state => {
                state.loading = 'loading'
            })
            .addCase(fetchAccountantDate.fulfilled, (state, action) => {
                state.date = action.payload.date;
            })
            .addCase(fetchAccountantDate.rejected, state => {
                state.loading = 'error'
            })




            .addCase(fetchAccountantInvestment.pending, state => {
                state.loading = 'loading'
            })
            .addCase(fetchAccountantInvestment.fulfilled, (state, action) => {
                state.invesment = action.payload;
            })
            .addCase(fetchAccountantInvestment.rejected, state => {
                state.loading = 'error'
            })




    }
})


const {actions, reducer} = accountantSlice;

export default reducer

export const {
    changePaymentType,
    onAddDevidend,
    onAddPayable,
    onDeleteDividend,
    changePaymentTypeDividend,
    changePaymentTypePayable,
    onDeletePayable,
    onAddStaff,
    onAddOverhead,
    onDeleteOverhead,
    changePaymentTypeOverhead
} = actions






