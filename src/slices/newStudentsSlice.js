import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";

const initialState = {
    newStudents: [
        {
            id: 1,
            name: "ulug'bek",
            surname: "fatxullayev",
            username: "adssadad",
            age: 12,
            subjects: []
        }
    ],
    btns: [
        // {
        //     id: 1,
        //     type: "btn",
        //     typeModal: true,
        //     typeOfChild : "text",
        //     confirm: false,
        //     title: "Create group",
        //     name: "createGroup",
        //     activeModal: false,
        //     iconClazz: "",
        //     options: [],
        // },
        {
            id: 1,
            type: "link",
            link: "createGroup",
            title: "Create group",
            location: true
        },
        {
            id: 2,
            type: "btn",
            typeModal: true,
            typeOfChild: "text",
            confirm: false,
            title: "add Group",
            name: "addGroup",
            activeModal: false,
            iconClazz: "",
            options: [],
        },
        // {
        //     id: 2,
        //     type: "btn",
        //     typeOfChild : "icon",
        //     iconClazz : "fas fa-times"
        // },
        // {
        //     id: 3,
        //     type: "select",
        //     name: "language",
        //     title: "Til tanlang",
        //     options : [
        //         {
        //             name: "asdasda"
        //         },
        //         {
        //             name: "asdasas"
        //         }
        //     ]
        // }
    ],
    createGroupTools: {
        subjects: [
            {
                name: "Matematika"
            },
            {
                name: "Ingliz tili"
            },
            {
                name: "Biologiya"
            }
        ]
    },
    checkedUsers: [],
    filteredStudents: [],
    page: 1,
    filteredNewStudents: [],
    filteredNewStudentsStatus: "idle",
    fetchNewStudentsStatus: "idle",
    fetchCreateGroupToolsStatus: "idle",
    fetchFilteredStudentsStatus: "idle",
    totalCount: null
}

export const fetchNewFilteredStudents = createAsyncThunk(
    'newStudentsSlice/fetchNewFilteredStudents',
    async (id) => {
        const {request} = useHttp();
        return await request(`${BackUrl}get_filtered_students_list/${id}`, "GET", null, headers())
    }
)


export const fetchNewStudents = createAsyncThunk(
    'newStudentsSlice/fetchNewStudents',
    async ({locationId, pageSize, currentPage}) => {
        const {request} = useHttp();

        return await request(`${BackUrl}student/newStudents/${locationId}${pageSize ? `?offset=${(currentPage-1) * 50}&limit=${pageSize}` : ""}`, "GET", null, headers())
    }
)

export const fetchNewDeletedStudents = createAsyncThunk(
    'newStudentsSlice/fetchNewDeletedStudents',
    async (id) => {
        const {request} = useHttp();
        return await request(`${BackUrl}newStudentsDeleted/${id}`, "GET", null, headers())
    }
)

export const fetchNewStudentsDeleted = createAsyncThunk(
    'newStudentsSlice/fetchNewStudentsDeleted',
    async (id) => {
        const {request} = useHttp();
        return await request(`${BackUrl}new_del_students/${id}`, "GET", null, headers())
    }
)

export const fetchCreateGroupTools = createAsyncThunk(
    'newStudentsSlice/fetchCreateGroupTools',
    async () => {
        const {request} = useHttp();
        return await request(`${BackUrl}create_group_tools`, "GET", null, headers())
    }
)
// export const  fetchCreateGroupTools = createAsyncThunk(
//     'newStudentsSlice/fetchCreateGroupTools',
//     async (id) => {
//         const {request} = useHttp();
//         return await request(`${BackUrl}create_group_tools2/${id}`,"GET",null,headers())
//     }
// )
export const fetchFilteredStudents = createAsyncThunk(
    'newStudentsSlice/fetchFilteredStudents',
    async (data) => {
        const {request} = useHttp();
        const {location} = data
        return await request(`${BackUrl}get_students/${location}`, "POST", JSON.stringify(data), headers())
    }
)


const newStudentsSlice = createSlice({
    name: "newStudentsSlice",
    initialState,
    reducers: {
        setChecked: (state, action) => {
            const newChSt = state.checkedUsers.filter(item => item.id === action.payload.id)
            if (newChSt.length > 0) {
                state.checkedUsers = state.checkedUsers.filter(item => item.id !== action.payload.id)
            } else {
                const newSt = state.newStudents.filter(item => {
                    if (item.id === action.payload.id) {
                        return {...item, checked: true}
                    }
                })
                const st = [{...newSt[0], checked: true}]

                state.checkedUsers = [...st, ...state.checkedUsers]
            }
        },
        // setChecked: (state,action) => {
        //     state.filteredStudents = state.filteredStudents.map(item => {
        //         if (item.id === action.payload.id) {
        //             return {...item,checked: !item.checked}
        //         }
        //         return item
        //     })
        // },
        setActiveBtn: (state, action) => {
            console.log(true, "setActiveBtn")
            state.btns = state.btns.map(item => {
                if (item.name === action.payload.name) {
                    if (item.typeModal) {
                        return {...item, activeModal: !item.activeModal}
                    }
                }
                return item
            })
        },
        setActiveAllBtn: (state, action) => {
            console.log(true, "setActiveAllBtn")
            state.btns = state.btns.map(item => {
                if (item.typeModal) {
                    return {...item, activeModal: false}
                }

                return item
            })
        },
        deleteCheckedStudents: (state, action) => {
            // eslint-disable-next-line array-callback-return
            state.checkedUsers = state.checkedUsers.filter(item => {
                return action.payload.checkedStudents.every(user => user.id !== item.id)
            })

            state.newStudents = state.newStudents.filter(item => {
                return action.payload.checkedStudents.every(user => user.id !== item.id)
            })
        },
        deleteStudent: (state, action) => {
            state.filteredNewStudents = state.filteredNewStudents.map(item => {
                if (item.id === action.payload.idSubject) {
                    return {
                        ...item,
                        students: item.students.filter(st => st.id !== action.payload.id)
                    }
                }
                return item
            })
            // state.filteredStudents = state.filteredStudents.
        },
        deleteNewStudentSlice: (state, action) => {
            state.newStudents = [...state.newStudents?.filter(item => item.id !== action.payload.id)]
            // state.filteredStudents = state.filteredStudents.
        },

        setPage: (state, action) => {
            state.page = action.payload.page
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchNewStudents.pending, state => {
                state.fetchNewStudentsStatus = 'loading'
            })
            .addCase(fetchNewStudents.fulfilled, (state, action) => {
                state.fetchNewStudentsStatus = 'success';
                console.log("log" , action.payload)
                state.totalCount = action.payload?.pagination
                // let newData = []
                // for (let i = 0; i < 20; i++) {
                //     const data = action.payload.newStudents.map(item => {
                //         return {...item, checked: false}
                //     })
                //     newData = [...newData,...data]
                // }
                // state.newStudents = newData
                state.newStudents = action.payload.newStudents.map(item => {
                    return {...item,checked: false}
                })

                state.checkedUsers = []
            })
            .addCase(fetchNewStudents.rejected, state => {
                state.fetchNewStudentsStatus = 'error'
            })

            .addCase(fetchNewDeletedStudents.pending, state => {
                state.fetchNewStudentsStatus = 'loading'
            })
            .addCase(fetchNewDeletedStudents.fulfilled, (state, action) => {
                state.fetchNewStudentsStatus = 'success';
                console.log(action.payload, "deleted")
                state.newStudents = action.payload.newStudents.map(item => {
                    return {...item,checked: false}
                })
            })
            .addCase(fetchNewDeletedStudents.rejected, state => {
                state.fetchNewStudentsStatus = 'error'
            })

            .addCase(fetchNewStudentsDeleted.pending, state => {
                state.fetchNewStudentsStatus = 'loading'
            })
            .addCase(fetchNewStudentsDeleted.fulfilled, (state, action) => {
                state.fetchNewStudentsStatus = 'success';
                console.log(action.payload)
                state.filteredNewStudents = action.payload
            })
            .addCase(fetchNewStudentsDeleted.rejected, state => {
                state.fetchNewStudentsStatus = 'error'
            })


            .addCase(fetchCreateGroupTools.pending, state => {
                state.fetchCreateGroupToolsStatus = 'loading'
            })
            .addCase(fetchCreateGroupTools.fulfilled, (state, action) => {
                state.fetchCreateGroupToolsStatus = 'success';
                state.createGroupTools = action.payload.createGroupTools
            })
            .addCase(fetchCreateGroupTools.rejected, state => {
                state.fetchCreateGroupToolsStatus = 'error'
            })

            .addCase(fetchFilteredStudents.pending, state => {
                state.fetchFilteredStudentsStatus = 'loading'
            })
            .addCase(fetchFilteredStudents.fulfilled, (state, action) => {
                state.fetchFilteredStudentsStatus = 'success';
                state.filteredStudents = action.payload.data.students
            })
            .addCase(fetchFilteredStudents.rejected, state => {
                state.fetchFilteredStudentsStatus = 'error'
            })
            .addCase(fetchNewFilteredStudents.pending, state => {
                state.filteredNewStudentsStatus = 'loading'
            })
            .addCase(fetchNewFilteredStudents.fulfilled, (state, action) => {
                state.filteredNewStudents = action.payload
                state.filteredNewStudentsStatus = 'success';
            })
            .addCase(fetchNewFilteredStudents.rejected, state => {
                state.filteredNewStudentsStatus = 'error'
            })
    }
})


const {actions, reducer} = newStudentsSlice;

export default reducer

export const {
    setChecked,
    setActiveBtn,
    setActiveAllBtn,
    deleteCheckedStudents,
    deleteStudent,
    setPage,
    deleteNewStudentSlice
} = actions

