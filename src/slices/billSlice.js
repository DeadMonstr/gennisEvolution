import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";


const initialState = {
    data: {
        payable: [],
        receivable: []
    },


    dataAccount: {
        left: [],
        right: []
    },


    total_left: 0,
    total_right: 0,
    total_sum: 0,


    typeProfile: "",

    profile: [],
    dataPayable: [],
    payable: [],
    history: [],

    loading: false,
    error: false
}


export const fetchBill = createAsyncThunk(
    "billSlice/fetchBill",
    async (activePage) => {
        const {request} = useHttp()
        return await request(`${BackUrl}get_accounts`, "GET", null, headers())
    }
)


export const fetchBillProfile = createAsyncThunk(
    "billSlice/fetchBillProfile",
    async (data) => {

        const {id,archive,deleted} = data

        const {request} = useHttp()
        return await request(`${BackUrl}account_profile/${id}/${deleted || false}/`, "GET", null, headers())
    }
)


export const fetchAccountDatas = createAsyncThunk(
    "billSlice/fetchAccountDatas",
    async (id) => {
        const {request} = useHttp()
        return await request(`${BackUrl}account_datas/${id}`, "GET", null, headers())
    }
)


export const fetchDataPayable = createAsyncThunk(
    "billSlice/fetchDataPayable",
    async (id) => {
        const {request} = useHttp()
        return await request(`${BackUrl}payable_datas/${id}/`, "GET", null, headers())
    }
)


export const fetchDataPayables = createAsyncThunk(
    "billSlice/fetchDataPayables",
    async ({id, monthId, deleted, archive}) => {
        const {request} = useHttp()
        return await request(`${BackUrl}account_payables/${id}/${monthId}/${deleted}/${archive}/`, "POST", null, headers())
    }
)


export const fetchAccountantPayableHistory = createAsyncThunk(
    'accountantSlice/fetchAccountantDate',
    async ({id}) => {
        const {request} = useHttp();

        return await request(`${BackUrl}get_payable_histories/${id}/`, "GET", null, headers())
    }
)


const billSlice = createSlice({
    name: "billSlice",
    initialState,
    reducers: {

        onAddBill: (state, action) => {

            if (action.payload.type === "payable") {
                state.data.payable = [...state.data.payable, action.payload.data]
            } else {
                state.data.receivable = [...state.data.receivable, action.payload.data]
            }
        },
        onDeleteBill: (state, action) => {
            state.data = state.data?.filter(item => item.id !== action.payload)

        },
        onEditBill: (state, action) => {
            state.profile = action.payload.data

        },

        onAddLeft: (state, action) => {
            state.dataAccount.left = [...state.dataAccount.left, action.payload]
        },

        onAddRight: (state, action) => {
            state.dataAccount.right = [...state.dataAccount.right, action.payload]
        },




        onDeleteTableData: (state, action) => {
            if (action.payload.side === "left") {
                state.dataAccount.left = state.dataAccount.left.filter(item => item.id !== action.payload.id)

            } else {
                state.dataAccount.right = state.dataAccount.right.filter(item => item.id !== action.payload.id)
            }

        },


        // onChangePayablePayment: (state , action) => {
        //     state.payable = [...state.payable.filter(item => item.id !== action.payload.id) , action.payload.data]
        // },

        onChangePayablePayment: (state, action) => {


            console.log(action.payload.data, "dataaaaaaaaa")

            if (action.payload.side === "left") {
                state.dataAccount.left = state.dataAccount.left.map(item => {
                    if (item.id === action.payload.id) {
                        return {...action.payload.data}
                    }
                    return item
                })
            } else {
                state.dataAccount.right = state.dataAccount.right.map(item => {
                    if (item.id === action.payload.id) {
                        return {...action.payload.data}
                    }
                    return item
                })
            }


        },


        onAddPayableHistory: (state, action) => {
            state.history = [...state.history, action.payload]
        },
        onDeletePayableHistory: (state, action) => {
            state.history = state.history?.filter(item => item.id !== action.payload)
        },
        onChangeHistoryPayment: (state, action) => {
            state.history = state.history.map(item => {
                if (item.id === action.payload.id) {
                    return {...action.payload.data}
                }
                return item
            })
        },


    },


    extraReducers: builder =>
        builder
            .addCase(fetchBill.pending, state => {
                state.loading = true
            })
            .addCase(fetchBill.fulfilled, (state, action) => {
                state.loading = false
                state.error = true
                state.data.payable = action.payload.accounts_payable
                state.data.receivable = action.payload.accounts_receivable

            })
            .addCase(fetchBill.rejected, state => {
                state.loading = false
                state.error = true
            })


            .addCase(fetchBillProfile.pending, state => {
                state.loading = true
            })
            .addCase(fetchBillProfile.fulfilled, (state, action) => {
                state.loading = false
                state.error = true
                state.profile = action.payload.data.account
                state.dataAccount.left = action.payload.data.left || []
                state.dataAccount.right = action.payload.data.right || []
                state.typeProfile = action.payload.data.type_account

            })
            .addCase(fetchBillProfile.rejected, state => {
                state.loading = false
                state.error = true
            })


            .addCase(fetchAccountDatas.pending, state => {
                state.loading = true
            })
            .addCase(fetchAccountDatas.fulfilled, (state, action) => {
                state.loading = false
                state.error = true
                state.total_left = action.payload.account.left
                state.total_right = action.payload.account.right
                state.total_sum = action.payload.account.remaining_sum
            })
            .addCase(fetchAccountDatas.rejected, state => {
                state.loading = false
                state.error = true
            })


            .addCase(fetchDataPayable.pending, state => {
                state.loading = true
            })
            .addCase(fetchDataPayable.fulfilled, (state, action) => {
                state.loading = false
                state.error = true
                state.dataPayable = action.payload
            })
            .addCase(fetchDataPayable.rejected, state => {
                state.loading = false
                state.error = true
            })


            .addCase(fetchDataPayables.pending, state => {
                state.loading = true
            })
            .addCase(fetchDataPayables.fulfilled, (state, action) => {
                state.loading = false
                state.error = true
                state.payable = action.payload.payables

            })
            .addCase(fetchDataPayables.rejected, state => {
                state.loading = false
                state.error = true
            })


            .addCase(fetchAccountantPayableHistory.pending, state => {
                state.loading = true
            })
            .addCase(fetchAccountantPayableHistory.fulfilled, (state, action) => {
                state.loading = false
                state.error = true
                state.history = action.payload.histories


            })
            .addCase(fetchAccountantPayableHistory.rejected, state => {
                state.loading = false
                state.error = true
            })


})


export default billSlice.reducer

export const {
    onAddLeft,
    onAddRight,
    onDeleteBill,
    onEditBill,
    onAddBill,
    onChangeHistoryPayment,
    onChangePayablePayment,
    onAddPayableHistory,
    onDeleteTableData,
    onDeletePayableHistory
} = billSlice.actions