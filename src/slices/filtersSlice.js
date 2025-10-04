import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";
import filters from "../components/platform/platformUI/filters";

const initialState = {
    filters: {
        // job: {
        //     id: 1,
        //     title: "Fan boyicha",
        //     type: "btn",
        //     typeChange: "multiple",
        //     activeFilters: [],
        //     filtersList: ["Admin", "Farrosh"]
        // },
        // language: {
        //     id: 2,
        //     title: "Til bo'yicha",
        //     type: "btn",
        //     typeChange: "once",
        //     activeFilters: [],
        //     filtersList: ["Uz", "Ru"]
        // },
        // month: {
        //     id: 3,
        //     title: "Oy bo'yicha",
        //     type: "select",
        //     activeFilters: [],
        //     filtersList: [
        //         {
        //             name: "01"
        //         },
        //         {
        //             name: "03"
        //         },
        //         {
        //             name: "04"
        //         },
        //         {
        //             name: "12"
        //         },
        //     ]
        // },
        // age: {
        //     id: 4,
        //     title: "Oy bo'yicha",
        //     type: "input",
        //     fromTo: {
        //         from: 1,
        //         to: 18
        //     }
        // }
    },

    activeFilters: {},
    fetchFiltersStatus: "idle",
}




export const fetchFilters = createAsyncThunk(
    'filtersSlice/fetchFilters',
    async (data) => {
        const {name,location,type} = data
        const {request} = useHttp();

        return await request(`${BackUrl}base/filters/${name}/${location}/${type}`,"GET",null,headers())
    }
)



const newStudentsSlice = createSlice({
    name: "filtersSlice",
    initialState,
    reducers: {
        resetState: () => initialState,
        setActive: (state, action) => {
            const filterKeys = Object.keys(state.filters);
            filterKeys.map(keys => {
                if (keys === action.payload.activeFilter) {
                    // agar faqat 1tasi tanlansin desa
                    if (state.filters[keys].typeChange === "once") {
                        let newFilter;
                        if (state.filters[keys].activeFilters === action.payload.subFilter) {
                            // qaytadan bosilsa tozalaymiz
                            newFilter = { ...state.filters[keys], activeFilters: [] };
                        } else {
                            // faqat 1tasi yoziladi
                            newFilter = { ...state.filters[keys], activeFilters: action.payload.subFilter };
                        }
                        state.filters = { ...state.filters, [keys]: newFilter };
                    }

                    // agar bir nechta tanlansin desa
                    if (state.filters[keys].typeChange === "multiple") {
                        let newFilter;
                        if (state.filters[keys].activeFilters.includes(action.payload.subFilter)) {
                            // agar tanlangan bo‘lsa → o‘chiramiz
                            newFilter = {
                                ...state.filters[keys],
                                activeFilters: state.filters[keys].activeFilters.filter(item => item !== action.payload.subFilter)
                            };
                        } else {
                            // yangisini qo‘shamiz
                            newFilter = {
                                ...state.filters[keys],
                                activeFilters: [...state.filters[keys].activeFilters, action.payload.subFilter]
                            };
                        }
                        state.filters = { ...state.filters, [keys]: newFilter };
                    }
                }
            });
        },
        setSelectOption: (state, action) => {
            const { activeFilter, selectedOption } = action.payload;
            const current = state.activeFilters[activeFilter];

            let newValue;

            if (
                selectedOption === "all" ||
                (Array.isArray(current) && current.includes(selectedOption)) ||
                current === selectedOption
            ) {
                newValue = null; // "all" bo‘lsa yoki shu filter qayta bosilsa -> olib tashlaymiz
            } else {
                newValue = selectedOption; // oddiy qiymatni qo‘yamiz
            }

            // umumiy activeFilters obyektini yangilash
            const updated = { ...state.activeFilters };
            if (newValue) {
                updated[activeFilter] = newValue;
            } else {
                delete updated[activeFilter]; // "all" bo‘lsa qo‘shmaymiz
            }
            state.activeFilters = updated;

            // filters[activeFilter] ichida ham yangilash
            if (state.filters[activeFilter]) {
                state.filters[activeFilter] = {
                    ...state.filters[activeFilter],
                    activeFilters: newValue ? newValue : [],
                };
            }
        },
        setFromToFilter: (state,action) => {
            const filterKeys = Object.keys(state.filters)
            filterKeys.map(keys => {
                if (keys === action.payload.activeFilter) {
                    const newFilter = {...state.filters[keys],fromTo: action.payload.fromTo }
                    state.filters = {...state.filters,[keys] : newFilter}
                }
            })
        },
        setDateFilter: (state, action) => {
            const { activeFilter, fromTo } = action.payload;

            if (state.filters[activeFilter]) {
                state.filters[activeFilter] = {
                    ...state.filters[activeFilter],
                    fromTo
                };
            }
        },
        setActiveFilter: (state, action) => {
            const { key, value } = action.payload;
            if (state.activeFilters[key] === value) {
                const updated = { ...state.activeFilters };
                delete updated[key];
                state.activeFilters = updated;
            }
            else {
                state.activeFilters = {
                    ...state.activeFilters,
                    [key]: value
                };
            }
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchFilters.pending,state => {state.fetchFiltersStatus = 'loading'} )
            .addCase(fetchFilters.fulfilled,(state, action) => {
                state.fetchFiltersStatus = 'success';
                state.filters = action.payload.filters
            })
            .addCase(fetchFilters.rejected,state => {state.fetchFiltersStatus = 'error'} )

            .addDefaultCase(()=> {})
    }
})



const {actions,reducer} = newStudentsSlice;

export default reducer

export const {
    resetState,
    setActive,
    setFromToFilter,
    setSelectOption,
    setActiveFilter,
    setDateFilter
} = actions

