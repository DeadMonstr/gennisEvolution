import {createAsyncThunk} from "@reduxjs/toolkit";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";



const renderQuery = ({PageSize , currentPage , search , activeFilters , locationId}) => {
    return `${PageSize ? `?offset=${(currentPage - 1) * 50}&limit=${PageSize}` : ""}${locationId ? `&locationId=${locationId}` : ""}${search ? `&search=${search}` : ""}${activeFilters.teacher ? `&teacherId=${activeFilters.teacher}` : ""}${activeFilters.moneyType ? `&color=${activeFilters.moneyType}` : ""}${activeFilters.status ? `&groupStatus=${activeFilters.status}` : ""}${activeFilters?.name ? `&overheadType=${activeFilters.name}` : ""}${activeFilters.typePayment ? `&paymentType=${activeFilters?.typePayment}` : ""}${activeFilters?.day ==="all" || activeFilters.day === undefined ? "" : `&day=${activeFilters?.day}` }${activeFilters?.year !== "all" && activeFilters.year !== undefined ? `&year=${activeFilters?.year}` : ""}${activeFilters?.month !== "all" && activeFilters.month !== undefined ? `&month=${activeFilters?.month}` : ""}`
}



const renderQuery2 = ({PageSize , book_overheads , search , activeFilters , locationId}) => {
    return `${PageSize ? `?offset=${(book_overheads - 1) * 50}&limit=${PageSize}` : ""}${locationId ? `&locationId=${locationId}` : ""}${search ? `&search=${search}` : ""}${activeFilters.teacher ? `&teacherId=${activeFilters.teacher}` : ""}${activeFilters.moneyType ? `&color=${activeFilters.moneyType}` : ""}${activeFilters.status ? `&groupStatus=${activeFilters.status}` : ""}${activeFilters?.name ? `&overheadType=${activeFilters.name}` : ""}${activeFilters.typePayment ? `&paymentType=${activeFilters?.typePayment}` : ""}${activeFilters?.day ==="all" || activeFilters.day === undefined ? "" : `&day=${activeFilters?.day}` }${activeFilters?.year !== "all" && activeFilters.year !== undefined ? `&year=${activeFilters?.year}` : ""}${activeFilters?.month !== "all" && activeFilters.month !== undefined ? `&month=${activeFilters?.month}` : ""}`
}

export const fetchAccounting = createAsyncThunk(
    "newAccountingSlice/fetchAccounting",
    async ({data , isArchive , PageSize , currentPage , search , activeFilters , locationId , route , deleted}) => {
        const {request} = useHttp()
        return await request(`${BackUrl}account/account_info/${route}${renderQuery({PageSize , currentPage , search , activeFilters , locationId})}${isArchive ? "&typeFilter=archive/" : ""}${deleted ? `&deleted=${1 }` : ""}`, locationId ? "GET" : "POST", locationId ? null : JSON.stringify(data), headers())

    }
)