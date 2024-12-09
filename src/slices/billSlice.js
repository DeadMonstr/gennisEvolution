import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {useHttp} from "../hooks/http.hook";
import {BackUrl, headers} from "../constants/global";


const initialState = {
    data: [],
    profile: [],
    dataPayable: [],
    dataPayables: [],
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
    async ({id , monthId}) => {
        const {request} = useHttp()
        request(`${BackUrl}account_payables/${id}/${monthId}/`, "POST", null, headers())
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
                state.dataPayables = action.payload?.payables

                console.log(action.payload , "action")
            })
            .addCase(fetchDataPayables.rejected, state => {
                state.loading = false
                state.error = true
            })
})


export default billSlice.reducer

export const {onAddBill, onDeleteBill, onEditBill} = billSlice.actions