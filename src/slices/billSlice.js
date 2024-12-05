import {createSlice , createAsyncThunk} from "@reduxjs/toolkit";



const initialState = {
    data: [
        {id: 1 , name: "dasdda"},
        {id : 2 , name: "dasdda"},
        {id: 3, name: "dasdda"},
    ],
    loading: false,
    error: false
}


// export const fetchBill = createAsyncThunk(
//     "billSlice/fetchBill",
//     async () => {
//         const {request} = useHttp()
//         return await request(`${BackUrl}bill`,"GET",null,headers())
//     }
// )

const billSlice = createSlice({
    name: "billSlice",
    initialState,
    reducers: {

        onAddBill: (state , action) => {
            state.data = [...state.data , action.payload]
        },
        onDeleteBill: (state , action) => {
            state.data = state.data.filter(bill => bill.id !== action.payload.id)
        },
        onEditBill: (state , action) => {
            state.data = state.data.map(bill => {
                if (bill.id === action.payload.id) {
                    return action.payload
                }
                return bill
            })
        },

    },
    extraReducers: builder => {}
        // builder
            // .addCase(fetchBill.pending , state => {
            //     state.loading = true
            // })
            // .addCase(fetchBill.fulfilled , (state , action) => {
            //     state.loading = false
            //     state.error = true
            //     state.data = action.payload
            // })
            // .addCase(fetchBill.rejected , state => {
            //     state.loading = false
            //     state.error = true
            // })
})


export default billSlice.reducer

export const {onAddBill , onDeleteBill , onEditBill} = billSlice.actions