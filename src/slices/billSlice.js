import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {useHttp} from "../hooks/http.hook";
import {BackUrl, headers} from "../constants/global";


const initialState = {
    data: [],
    profile: [],
    dataPayable: [],
    payable: [],
    history: [],
    loading: false,
    error: false
}


export const fetchBill = createAsyncThunk(
    "billSlice/fetchBill",
    async () => {
        const {request} = useHttp()
        return await request(`${BackUrl}get_accounts`, "GET", null, headers())
    }
)


export const fetchBillProfile = createAsyncThunk(
    "billSlice/fetchBillProfile",
    async (id) => {
        const {request} = useHttp()
        return await request(`${BackUrl}account_profile/${id}/`, "GET", null, headers())
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
    async ({id , monthId , deleted }) => {
        const {request} = useHttp()
        return await    request(`${BackUrl}account_payables/${id}/${monthId}/${deleted}/`, "POST", null, headers())
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
            state.data = [...state.data, action.payload]


        },
        onDeleteBill: (state, action) => {
            state.data = state.data?.filter(item => item.id !== action.payload)

            console.log(action.payload)
        },
        onEditBill: (state, action) => {
            state.profile = action.payload.data

        },

        onAddPayable: (state, action) => {
            state.payable = [...state.payable, action.payload]
        },


        onDeletePayable: (state, action) => {
            state.payable = state.payable?.filter(item => item.id !== action.payload)
        },



        // onChangePayablePayment: (state , action) => {
        //     state.payable = [...state.payable.filter(item => item.id !== action.payload.id) , action.payload.data]
        // },

        onChangePayablePayment: (state, action) => {
            state.payable = state.payable.map(item => {
                if (item.id === action.payload.id) {
                    return {...action.payload.data}
                }
                return item
            })
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
                state.data = action.payload.accounts
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
                state.profile = action.payload.account
            })
            .addCase(fetchBillProfile.rejected, state => {
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

export const {onAddBill, onDeleteBill, onEditBill , onAddPayable , onChangeHistoryPayment, onChangePayablePayment , onAddPayableHistory , onDeletePayable , onDeletePayableHistory} = billSlice.actions