

import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";

const initialState = {

    category: {},
    categories: [],
    deletedCapitals: [],
    capital: {},
    terms: [],


    tools: [],
    fetchCategoriesStatus: "idle",
    fetchCategoryStatus: "idle",
}


export const  fetchCategory = createAsyncThunk(
    'capitalCategory/fetchCategory',
    async (data) => {
        const {request} = useHttp();
        return await request(`${BackUrl}get_capital_category/${data.id}/${data.locationId}`,"GET",null,headers())
    }
)

export const  fetchCategories = createAsyncThunk(
    'capitalCategory/fetchCategories',
    async () => {
        const {request} = useHttp();
        return await request(`${BackUrl}get_capital_categories`,"GET",null,headers())
    }
)

export const  fetchCategoryDeletedCapitals = createAsyncThunk(
    'capitalCategory/fetchCategoryDeletedCapitals',
    async (data) => {
        const {request} = useHttp();
        return await request(`${BackUrl}deleted_capitals/${data.id}/${data.locationId}`,"GET",null,headers())
    }
)


export const  fetchCapital = createAsyncThunk(
    'capitalCategory/fetchCapital',
    async (id) => {
        const {request} = useHttp();
        return await request(`${BackUrl}capital_info/${id}`,"GET",null,headers())
    }
)


const capitalCategory = createSlice({
    name: "capitalCategory",
    initialState,
    reducers: {
        onChangeCategory: (state,action) => {
            state.category = action.payload.category
        },

        onAddSubCategory: (state,action) => {
            state.category.addition_categories = [...state.category.addition_categories,action.payload.category]
        },


        onAddCategory: (state,action) => {
            state.categories.push(action.payload.category)
        },

        onAddCapitalReducer: (state,action) => {
            state.category.capitals = [...state.category.capitals,action.payload.capital]
        },

        onChangeCapitalReducer: (state,action) => {
            state.capital = action.payload.capital
        },


        onDeleteCapitalReducer: (state,action) => {
            state.category.capitals = state.category.capitals.filter(item => item.id !== action.payload.id)
        },

    },
    extraReducers: builder => {
        builder
            .addCase(fetchCategory.pending,state => {state.fetchCategoryStatus = 'loading'} )
            .addCase(fetchCategory.fulfilled,(state, action) => {
                state.fetchCategoryStatus = 'success';
                state.category = action.payload.category
                state.tools = action.payload.capital_tools
            })
            .addCase(fetchCategory.rejected,state => {state.fetchCategoryStatus = 'error'} )

            .addCase(fetchCategories.pending,state => {state.fetchCategoriesStatus = 'loading'} )
            .addCase(fetchCategories.fulfilled,(state, action) => {
                state.fetchCategoriesStatus = 'success';
                state.categories = action.payload.categories
            })
            .addCase(fetchCategories.rejected,state => {state.fetchCategoriesStatus = 'error'} )


            .addCase(fetchCategoryDeletedCapitals.pending,state => {state.fetchCategoriesStatus = 'loading'} )
            .addCase(fetchCategoryDeletedCapitals.fulfilled,(state, action) => {
                state.fetchCategoriesStatus = 'success';
                state.deletedCapitals = action.payload.capitals
            })
            .addCase(fetchCategoryDeletedCapitals.rejected,state => {state.fetchCategoriesStatus = 'error'} )


            .addCase(fetchCapital.pending,state => {state.fetchCategoryStatus = 'loading'} )
            .addCase(fetchCapital.fulfilled,(state, action) => {
                state.fetchCategoryStatus = 'success';
                state.capital = action.payload.capital
                state.tools = action.payload.capital_tools
                state.terms = action.payload.terms

            })
            .addCase(fetchCapital.rejected,state => {state.fetchCategoryStatus = 'error'} )
    }
})



const {actions,reducer} = capitalCategory;

export default reducer

export const {
    onAddCategory,
    onChangeCategory,
    onAddCapitalReducer,
    onChangeCapitalReducer,
    onDeleteCapitalReducer,
    onAddSubCategory
} = actions










