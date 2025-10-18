import {createAsyncThunk} from "@reduxjs/toolkit";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";



const renderQuery = ({
                         PageSize,
                         currentPage,
                         currentPage2,
                         search,
                         activeFilters,
                         locationId,
                         type_pagination,
                     }) => {

    const offsetPage = currentPage2 ? currentPage2 : currentPage;
    const offset = (offsetPage - 1) * (PageSize || 50);

    return `${PageSize ? `?offset=${offset}&limit=${PageSize}` : ""}${
        locationId ? `&locationId=${locationId}` : ""
    }${search ? `&search=${search}` : ""}${
        activeFilters.teacher ? `&teacherId=${activeFilters.teacher}` : ""
    }${activeFilters.moneyType ? `&color=${activeFilters.moneyType}` : ""}${
        activeFilters.status ? `&groupStatus=${activeFilters.status}` : ""
    }${activeFilters?.name ? `&overheadType=${activeFilters.name}` : ""}${
        activeFilters.typePayment ? `&paymentType=${activeFilters?.typePayment}` : ""
    }${
        activeFilters?.day === "all" || activeFilters.day === undefined
            ? ""
            : `&day=${activeFilters?.day}`
    }${
        activeFilters?.year !== "all" && activeFilters.year !== undefined
            ? `&year=${activeFilters?.year}`
            : ""
    }${
        activeFilters?.month !== "all" && activeFilters.month !== undefined
            ? `&month=${activeFilters?.month}`
            : ""
    }${type_pagination ? `&type_pagenation=${type_pagination}` : ""}`;
};



export const fetchAccounting = createAsyncThunk(
    "newAccountingSlice/fetchAccounting",
    async ({
               data,
               isArchive,
               PageSize,
               currentPage,
               currentPage2,
               search,
               activeFilters,
               locationId,
               route,
               deleted,
               type_pagination,
           }) => {
        const { request } = useHttp();

        const query = renderQuery({
            PageSize,
            currentPage,
            currentPage2,
            search,
            activeFilters,
            locationId,
            type_pagination,
        });

        const url = `${BackUrl}account/account_info/${route}${query}${
            isArchive ? "&typeFilter=archive/" : ""
        }${deleted ? `&deleted=1` : ""}`;

        return await request(
            url,
            "GET",
            JSON.stringify(data),
            headers()
        );
    }
);
