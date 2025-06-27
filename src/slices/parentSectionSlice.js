import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {useHttp} from "../hooks/http.hook";
import {BackUrl, headers} from "../constants/global";


const initialState = {
    data: {},
    parents: [],
    loading: false,
    error: null,
}

export const fetchParentData = createAsyncThunk(
    'parentSectionSlice/fetchParentData',
    async (id) => {
        const {request} = useHttp()
        return await request(`${BackUrl}parent/crud/${id}`, "GET", null, headers())
    }
)

export const fetchParentsData = createAsyncThunk(
    'parentSectionSlice/fetchParentsData',
    async ({locationId , type}) => {
        const {request} = useHttp()
        return await request(`${BackUrl}parent/get_list/${locationId}/${type}`, "GET", null, headers())
    }
)

const parentSectionSlice = createSlice({
    name: "parentSectionSlice",
    initialState,
    reducers: {
        onChangeParentSource: (state, action) => {
            state.data = action.payload
        },
        onAddChildrenToParent: (state, action) => {
            state.data = action.payload
        },
        onRemoveChildrenFromParent: (state, action) => {
            state.data = action.payload
        },
        onDeleteParent: (state, action) => {
            state.parents = state.parents.filter(item => item.id !== action.payload)
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchParentData.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchParentData.fulfilled, (state,action) => {
                state.loading = false
                state.data = action.payload
                state.error = null
            })
            .addCase(fetchParentData.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(fetchParentsData.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchParentsData.fulfilled, (state,action) => {
                state.loading = false
                state.parents = action.payload
                state.error = null
            })
            .addCase(fetchParentsData.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })

    }
})

const {actions, reducer} = parentSectionSlice

export default reducer

export const {
    onChangeParentSource,
    onAddChildrenToParent,
    onRemoveChildrenFromParent,
    onDeleteParent,


} = actions