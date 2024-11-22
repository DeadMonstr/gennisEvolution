import {createAsyncThunk} from "@reduxjs/toolkit";

import {BackUrl , headers} from "../../../../../../constants/global";
import {useHttp} from "../../../../../../hooks/http.hook";

export const fetchData = createAsyncThunk(
    "registerSlice/fetchData",
    async () => {
        const {request} = useHttp();

        return await request(`${BackUrl}universities`, "GET", null, headers())
    }
)

export const fetchDataMk = createAsyncThunk(
    "registerSlice/fetchDataMk",
    async () => {
        const {request} = useHttp()

        return await request(`${BackUrl}schools`, "GET", null, headers())
    }
)

export const fetchFakultet = createAsyncThunk(
    "registerSlice/fetchFakultet",
    async (univer) => {
        const {request} = useHttp()

        return await request(`${BackUrl}faculties/${univer}`, "GET", null, headers())
    }
)


export const fetchGetHomeInfo = createAsyncThunk(
    "blockTestSlice/fetchGetHomeInfo",
    async () => {
        const {request} = useHttp()
        return await request(`${BackUrl}get_home_info`, "GET", null, headers())
    }
)

export const fetchDefenations = createAsyncThunk(
    "blockTestSlice/fetchDefenations",
    async () => {
        const {request} = useHttp()
        return await request(`${BackUrl}defenations`, "GET", null, headers())
    }
)