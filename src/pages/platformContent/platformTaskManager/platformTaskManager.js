import React, {createContext, useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react';
import classNames from "classnames";
import {get, useForm} from "react-hook-form";
import Calendar from "react-calendar";
import {useDispatch, useSelector} from "react-redux";
import 'react-calendar/dist/Calendar.css';
import {motion, useDragControls, useMotionValue, useMotionValueEvent} from "framer-motion";

import Modal from "components/platform/platformUI/modal";
import InputForm from "components/platform/platformUI/inputForm";
import Button from "components/platform/platformUI/button";
import ConfimReason from "components/platform/platformModals/confirmReason/confimReason";
import Select from "components/platform/platformUI/select";
import Confirm from "components/platform/platformModals/confirm/confirm";
import DefaultLoader from "components/loader/defaultLoader/DefaultLoader";
import PlatformMessage from "components/platform/platformMessage";
import {useHttp} from "hooks/http.hook";
import {BackUrl, formatDate, headers} from "constants/global";
import {
    changeNewStudents,
    changeNewStudentsDel,
    changeLead,
    deleteLead,
    fetchedProgress,
    fetchingProgress,
    fetchNewStudentsData,
    fetchDebtorStudentsData,
    fetchLeadsData,
    fetchCompletedDebtorsData, fetchedSearch, fetchingSearch, fetchDebtorsData,
    onDelDebtors, onChangeProgress
} from "slices/taskManagerSlice";

import cls from "./platformTaskManager.module.sass";
import unknownUser from "assets/user-interface/user_image.png";
import taskCardBack from "assets/background-img/TaskCardBack.png";
import taskCardBack2 from "assets/background-img/TaskCardBack2.png";
import taskCardBack4 from "assets/background-img/TaskCardBack4.png";
import switchXButton from "assets/icons/bx_task-x.svg";
import switchCompletedBtn from "assets/icons/progress.svg";


import DefaultLoaderSmall from "components/loader/defaultLoader/defaultLoaderSmall";
import {setMessage} from "slices/messageSlice";
import {useParams} from "react-router-dom";
import Input from "components/platform/platformUI/input";
import PlatformSearch from "components/platform/platformUI/search";
import Table from "components/platform/platformUI/table";
import {fetchDataToChange} from "slices/dataToChangeSlice";

const FuncContext = createContext(null)
const options = [
    {
        name: "tel ko'tardi",
        label: "yes"
    },
    {
        name: "tel ko'tarmadi",
        label: "no"
    }
]
const menuList = [
    {
        name: "debtors",
        label: "Qarzdorlar"
    },
    {
        name: "newStudents",
        label: "Yangi o’quvchilar"
    },
    {
        name: "leads",
        label: "Lead"
    }
]
const colorStatusList = ["red", "yellow", "green"]

const PlatformTaskManager = () => {

    const {locationId} = useParams()

    const {
        unCompleted,
        completed,


        newStudents,
        newStudentsStatus,
        completedNewStudents,
        debtorStudent,
        debtorStudentStatus,
        completedDebtorStudent,
        leads,
        completedLeads,
        leadsStatus,
        progress,
        progressStatus,
        allProgress,
        search,
        searchStatus,
        isTable,
        unCompletedStatus,
        completedStatus
    } = useSelector(state => state.taskManager)




    const [activeMenu, setActiveMenu] = useState(menuList[0].name)
    const [isCompleted, setIsCompleted] = useState(false)

    const [year, setYear] = useState()
    const [month, setMonth] = useState()


    const dispatch = useDispatch()
    const {request} = useHttp()
    const {register, handleSubmit, setValue} = useForm()


    const [activeModal, setActiveModal] = useState(false)
    const [date, setDate] = useState(new Date())
    const [studentId, setStudentId] = useState()
    const [studentSelect, setStudentSelect] = useState()
    const [dellLead, setDellLead] = useState(false)
    const [isConfirm, setIsConfirm] = useState(false)
    const [searchValue, setSearchValue] = useState("")
    const [getUser, setGetUser] = useState({})
    const [tableData, setTableDate] = useState([])

    const [data, setData] = useState([])
    const [banListColors,setBanListColors] = useState([])








    useEffect(() => {
        const oldCompleted = JSON.parse(localStorage.getItem("isCompleted"))
        if (oldCompleted) {
            setIsCompleted(oldCompleted)
        } else {
            setIsCompleted(false)
        }
    }, [])



    // Cards color banList

    useEffect(() => {


        if (isCompleted) {
            switch (activeMenu) {
                case "leads":
                    setBanListColors(["red","yellow"])
                    break;
            }
        } else {
            switch (activeMenu) {
                case "debtors":
                    setBanListColors(["green"])
                    break;
                case "students":
                    setBanListColors(["green"])
                    break;
                case "leads":
                    setBanListColors(["green"])
                    break;
            }
        }



    },[isCompleted,activeMenu])



    // Fetch data from type and date

    useEffect(() => {
        if (!locationId && !date) return;

        const formatted = formatDate(date)

        if (isCompleted) {
            switch (activeMenu) {
                case "debtors":
                    dispatch(fetchCompletedDebtorsData({locationId, date: formatted}))
                    break;
                // case "newStudents":
                //     dispatch()
                //     break;
                // case "leads":
                //     dispatch()
                //     break;


            }
        } else {
            switch (activeMenu) {
                case "debtors":
                    dispatch(fetchDebtorsData({locationId, date: formatted}))
                    break;
                // case "newStudents":
                //     dispatch()
                //     break;
                // case "leads":
                //     dispatch()
                //     break;


            }
        }


    }, [activeMenu, locationId, date,isCompleted])


    // set current data from fetched data

    useEffect(() => {
        if (!locationId && !date) return;


        if (isCompleted) {
            switch (activeMenu) {
                case "debtors":
                    setData(completed.debtors)
                    break;
                // case "newStudents":
                //     dispatch()
                //     break;
                // case "leads":
                //     dispatch()
                //     break;


            }
        } else {
            switch (activeMenu) {
                case "debtors":
                    setData(unCompleted.debtors)
                    break;
                // case "newStudents":
                //     dispatch()
                //     break;
                // case "leads":
                //     dispatch()
                //     break;


            }
        }


    }, [
        unCompleted.debtors,
        unCompleted.students,
        unCompleted.leads,
        completed.debtors,
        completed.debtors,
        completed.debtors,
    ])




    // length fetched data


    const calcLengthData = useCallback((type, isCompleted) => {
        if (isCompleted) {
            switch (type) {
                case "debtors":
                    return completed.debtors.length;
                case "newStudents":
                    return completed.students.length;
                case "leads":
                    return completed.leads.length;
            }
        } else {
            switch (type) {
                case "debtors":
                    return unCompleted.debtors.length;
                case "newStudents":
                    return unCompleted.students.length;
                case "leads":
                    return unCompleted.leads.length;
            }
        }
    }, [
        unCompleted.debtors.length,
        unCompleted.students.length,
        unCompleted.leads.length,
        completed.debtors.length,
        completed.debtors.length,
        completed.debtors.length,
    ])





    const renderMenuItems = useCallback(() => {
        return menuList.map((item, i) => {
            return (
                <div className={cls.otherItems}>
                    <p
                        className={classNames(cls.other__item, {
                            [cls.active]: activeMenu === item.name
                        })}
                    >
                        {calcLengthData(item.name, isCompleted)}
                    </p>
                    <h2
                        key={i}
                        className={classNames(cls.other__item, {
                            [cls.active]: activeMenu === item.name
                        })}
                        onClick={() => {
                            setActiveMenu(item.name)
                            // setIsCompleted(false)
                            setSearchValue("")
                        }}
                    >
                        {item.label}
                    </h2>
                </div>
            )
        })
    }, [activeMenu, menuList, unCompleted, completed])


    // useEffect(() => {
    //     dispatch(fetchedProgress())
    //
    // }, [])

    // useEffect(() => {
    //     dispatch(fetchingProgress())
    //     request(`${BackUrl}daily_statistics/${locationId}`, "POST", JSON.stringify({
    //         date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    //     }), headers())
    //         .then(res => {
    //             // dispatch(fetchedProgress(res.info))
    //             if (!res.info) {
    //                 dispatch(setMessage({
    //                     msg: res.status,
    //                     type: "success",
    //                     active: true
    //                 }))
    //             }
    //         })
    //         .catch(err => console.log(err))
    // }, [date, leads, debtorStudent, newStudents, locationId])


    // useEffect(() => {
    //
    //
    //     request(`${BackUrl}task_new_students_filter/${locationId}`, "POST", JSON.stringify({date: `${date?.getFullYear()}-${date?.getMonth() + 1}-${date?.getDate()}`}), headers())
    //         .then(res => {
    //             console.log(res, "res")
    //             setTableDate(res)
    //
    //             if (!res.info) {
    //                 dispatch(setMessage({
    //                     msg: res.status,
    //                     type: "success",
    //                     active: true
    //                 }))
    //             }
    //         })
    //         .catch(err => console.log(err))
    // }, [date, locationId])


    const onChangeIsCompleted = (status) => {
        localStorage.setItem("isCompleted", status)
        setData([])
        setIsCompleted(status)
    }


    function showMessage(msg) {
        setValue("comment", "")
        setValue("date", "")
        setStudentSelect(null)
        setActiveModal(false)
        dispatch(setMessage({
            msg: msg,
            type: "success",
            active: true
        }))
    }

    const onSubmit = (data) => {
        const res = {
            id: studentId,
            ...data
        }


        if (activeMenu === "newStudents") {

            request(`${BackUrl}task_new_students_calling/${locationId}`, "POST", JSON.stringify(res), headers())
                .then(res => {
                    if (res?.student.id) {
                        dispatch(changeNewStudentsDel({student: res.student}))
                        showMessage(res.student.msg)
                    } else {
                        showMessage(res.msg)
                    }
                })
                .catch(err => console.log(err))

        } else if (activeMenu === "debtors") {

            const result = {
                select: studentSelect,
                ...res
            }
            request(`${BackUrl}call_to_debts`, "POST", JSON.stringify(result), headers())
                .then(res => {




                    dispatch(onDelDebtors({student: res.student_id}))
                    dispatch(onChangeProgress({progress: res.task_statistics, allProgress: res.task_daily_statistics}))

                    showMessage(res.message)
                })
                .catch(err => console.log(err))


        } else if (activeMenu === "lead") {

            request(`${BackUrl}lead_crud/${studentId}`, "POST", JSON.stringify({
                ...res,
                location_id: locationId
            }), headers())
                .then(res => {
                    if (res.lead) {
                        dispatch(changeLead(res?.lead))
                    }
                    showMessage(res.msg)
                })
                .catch(err => console.log(err))


        }
    }

    const onClick = (id) => {
        setActiveModal(true)
        setStudentId(id)
    }

    const onChange = (value) => {
        setStudentSelect(value)
    }

    const onDelete = (data) => {
        const res = {
            location_id: locationId,
            status: studentId?.status,
            ...data
        }
        request(`${BackUrl}lead_crud/${studentId?.id}`, "DELETE", JSON.stringify(res), headers())
            .then((res) => {
                setIsConfirm(false)
                setDellLead(false)
                dispatch(deleteLead({id: studentId?.id}))
                dispatch(setMessage({
                    msg: res.msg,
                    type: "success",
                    active: true
                }))
            })

        if (data.confirm === "no") {
            setDellLead(false)
        }
    }

    // const searchedUsers = useCallback(() => {
    //     let filteredArr;
    //     switch (activeMenu) {
    //         case "newStudents":
    //             if (isCompleted)
    //                 filteredArr = completedNewStudents
    //             else
    //                 filteredArr = newStudents
    //             break;
    //         case "lead":
    //             if (isCompleted)
    //                 filteredArr = completedLeads
    //             else
    //                 filteredArr = leads
    //             break;
    //         default:
    //             if (isCompleted)
    //                 filteredArr = completedDebtorStudent
    //             else
    //                 filteredArr = debtorStudent
    //             break;
    //     }
    //
    // }, [activeMenu, search])


    const onSearch = (value) => {
        setSearchValue(value)
        if (value !== "") {
            dispatch(fetchingSearch())

            request(`${BackUrl}search_student_in_task/${locationId}`, "POST", JSON.stringify({
                text: value,
                type: activeMenu,
                status: isCompleted
            }), headers())
                .then(res => {
                    dispatch(fetchedSearch(res.students))
                })
                .catch(err => console.log(err))
        }


    }


    const contextObj = useMemo(() => ({
        activeMenu: activeMenu,
        getStudentId: setStudentId,
        click: onClick,
        onDelete: setDellLead,
        isCompleted: isCompleted,
        dispatch: dispatch,
        location: locationId,
        getSelect: setGetUser,
        completedLength: completedDebtorStudent.length
    }), [activeMenu, isCompleted, locationId, completedDebtorStudent])


    // const resetStat = () => {
    //     request(`${BackUrl}`, "")
    // }


    const renderData =useCallback(() => {

        if (unCompletedStatus === "loading" || unCompletedStatus === "idle") {
            return <DefaultLoaderSmall/>
        }

        switch (isTable) {
            case true:
                return (
                    <TableData
                        isCompleted={isCompleted}
                        arr={data}
                        activeType={activeMenu}
                    />
                )
            case false:
                return (
                    <RenderCards
                        isCompleted={isCompleted}
                        arr={data}
                        activeType={activeMenu}
                        banList={banListColors}
                        status={false}
                    />
                )
        }
    },[isTable,data,isCompleted,activeMenu,banListColors,unCompletedStatus,completedStatus])


    return (
        <div className={cls.tasks}>
            <div className={cls.tasks__inner}>
                <div className={cls.header}>
                    <PlatformSearch search={searchValue} setSearch={onSearch}/>
                    {/*<h1>My tasks</h1>*/}
                    {/*<div className={cls.header__search}>*/}

                    <div style={{display: "flex"}}>

                        <SwitchButton
                            isCompleted={isCompleted}
                            setIsCompleted={onChangeIsCompleted}
                            setSearchValue={setSearchValue}
                        />
                    </div>

                    {/*<PlatformSearch search={search} setSearch={setSearch}/>*/}
                    {/*<Input*/}
                    {/*    placeholder={"Qidiruv"}*/}
                    {/*    // onChange={}*/}
                    {/*/>*/}
                    {/*</div>*/}
                </div>


                <div className={cls.contentTask}>
                    <div className={cls.contentTask__inner}>
                        <h1>My tasks</h1>
                        <Completed
                            style={isCompleted ? "#34c9eb" : "#ff8c42"}
                            progress={isCompleted ? allProgress?.completed_tasks : allProgress?.in_progress_tasks}
                            progressStatus={progressStatus}
                        />
                    </div>

                    {
                        tableData.is_selected === true && !isCompleted ? null : <div className={cls.menuTask}>
                            <div className={cls.menuTask__list}>
                                <div className={cls.other}>
                                    {renderMenuItems()}
                                </div>
                            </div>
                        </div>
                    }


                </div>
                <div className={cls.tasks__handler}>


                    <FuncContext.Provider value={contextObj}>
                        <div className={cls.items}>
                            {/*<div className={cls.items__inner}>*/}




                            {renderData()}
                            {/*{*/}
                            {/*    activeMenu === "lead"*/}
                            {/*        ?*/}
                            {/*        <Leads*/}
                            {/*            isCompleted={isCompleted}*/}
                            {/*            arr={searchValue ? search : isCompleted ? completedLeads : leads}*/}
                            {/*            arrStatus={leadsStatus}*/}
                            {/*        />*/}
                            {/*        :*/}
                            {/*        activeMenu === "newStudents"*/}
                            {/*            ?*/}
                            {/*            tableData.is_selected === true && !isCompleted ?*/}
                            {/*                <TableData tableData={tableData}/> :*/}
                            {/*                <Student*/}
                            {/*                    arr={searchValue ? search : isCompleted ? completedNewStudents : newStudents}*/}
                            {/*                    arrStatus={newStudentsStatus}*/}
                            {/*                />*/}
                            {/*            :*/}
                            {/*            <Student*/}
                            {/*                setNumber={setNumber}*/}
                            {/*                arr={searchValue ? search : isCompleted ? completedDebtorStudent : debtorStudent}*/}
                            {/*                arrStatus={searchValue ? searchStatus : debtorStudentStatus}*/}
                            {/*            />*/}
                            {/*}*/}


                            {/*</div>*/}
                            {/*{*/}
                            {/*    debtorStudentStatus !== "loading"*/}
                            {/*        ?*/}
                            {/*        (debtorStudent.length + completedDebtorStudent.length) >= 100*/}
                            {/*            ?*/}
                            {/*            null*/}
                            {/*            :*/}
                            {/*            (debtorStudent.length !== 0 && activeMenu === "debtors" && !isCompleted)*/}
                            {/*                ?*/}
                            {/*                <div*/}
                            {/*                    className={cls.scroll__plus}*/}
                            {/*                    onClick={() => onGetStudents(number)}*/}
                            {/*                >*/}
                            {/*                    <i className={classNames("fas fa-plus", cls.icon)}/>*/}
                            {/*                </div>*/}
                            {/*                :*/}
                            {/*                null*/}
                            {/*        :*/}
                            {/*        null*/}
                            {/*}*/}
                        </div>
                    </FuncContext.Provider>


                    <div className={cls.tasks__banner}>
                        <div className={cls.info}>
                            <div className={cls.info__date}>
                                <Calendar
                                    defaultValue={date}
                                    onChange={setDate}
                                />
                            </div>
                        </div>
                        <div className={cls.info__progress}>
                            <div className={cls.completeTask}>
                                <div className={cls.completeTask__precent}>
                                    <div>
                                        <div className={cls.circleProgress}>
                                            <Completed
                                                progress={`${allProgress?.completed_tasks_percentage || 0}%`}
                                                // progressStatus={progressStatus}
                                            />
                                        </div>
                                        <h2>All Rating</h2>
                                    </div>
                                    <div>
                                        <div className={cls.circleProgress}>
                                            <Completed
                                                progress={`${progress?.completed_tasks_percentage || 0}%`}
                                                // progressStatus={progressStatus}
                                            />

                                        </div>
                                        <h2>{activeMenu}</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </div>


            <Modal activeModal={activeModal} setActiveModal={setActiveModal}>
                <div className={cls.userbox}>
                    <div className={cls.userbox__img}>
                        <img src={getUser.img ? getUser.img : unknownUser} alt=""/>
                    </div>
                    <h2 className={cls.userbox__name}>
                        <span>{getUser.name} {getUser.surname}</span> <br/>
                    </h2>
                    <div className={cls.userbox__info}>
                        <div className={cls.userbox__infos}>
                            <p className={cls.userbox__subjects}>
                                balance :
                                <span>{getUser.balance ? getUser.balance : <>balance yuq</>} </span>
                            </p>
                            <p className={cls.userbox__number}>
                                Number :
                                <span>{getUser.phone} </span>
                            </p>
                        </div>
                    </div>
                    {
                        isCompleted ? null : <form onSubmit={handleSubmit(onSubmit)}>
                            <div className={cls.userbox__inputs}>
                                {
                                    activeMenu === "debtors" ? <Select
                                        options={options}
                                        // defaultValue={options[0].name}
                                        onChangeOption={onChange}
                                    /> : null
                                }
                                {
                                    studentSelect === "tel ko'tarmadi" ? null : <>
                                        <InputForm placeholder="koment" type="text" register={register} name={"comment"}
                                                   required/>
                                        <InputForm placeholder="keyingiga qoldirish" type="date" register={register}
                                                   name={"date"}
                                                   required/>
                                    </>
                                }
                            </div>
                            <div className={cls.userbox__footer_btn}>
                                <Button type={"submit"}>
                                    Button
                                </Button>
                            </div>
                        </form>
                    }
                </div>
                {getUser.history?.length >= 1 ? <div className={cls.wrapperList}>
                    {
                        getUser.history && getUser.history?.map((item) => {
                            return (
                                <div className={cls.wrapperList__box}>
                                    <div className={cls.wrapperList__items}>
                                        <div className={cls.wrapperList__number}>
                                            Telefon qilingan :
                                            <span>
                                            {activeMenu === "newStudents" ? item.day : item.added_date}
                                        </span>
                                        </div>
                                        <div className={cls.wrapperList__comment}>
                                            Comment : <span>{item.comment}</span>
                                        </div>
                                        <div className={cls.wrapperList__smen}>
                                            {item.shift}
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div> : null}
            </Modal>
            <Modal activeModal={dellLead} setActiveModal={() => setDellLead(false)}>
                <Confirm setActive={setDellLead} getConfirm={setIsConfirm} text={"O'chirishni hohlaysizmi"}/>
            </Modal>
            {
                isConfirm === "yes" ?
                    <Modal
                        activeModal={dellLead}
                        setActiveModal={() => {
                            setDellLead(false)
                            setIsConfirm(false)
                        }}
                    >
                        <ConfimReason getConfirm={onDelete} reason={true}/>
                    </Modal> : null
            }
            <PlatformMessage/>
        </div>
    )
        ;
};

const TableData = ({arr}) => {

    const stringCheck = (name, length = 10) => {
        if (name?.length > length) {
            return (
                <>
                    {name.substring(0, length)}...
                    <div className={cls.popup}>
                        {name}
                    </div>
                </>
            )
        }
        return name
    }
    const renderData = () => {
        return arr?.map((item, i) => (
            <tr>
                <td>{i + 1}</td>
                <td>{stringCheck(item.name)}</td>
                <td>{stringCheck(item.surname)}</td>
                <td>{item?.phone}</td>
                <td>{stringCheck(item?.reason, 20)}</td>
            </tr>
        ))
    }
    const render = renderData()


    return (
        <Table className={cls.table_results}>
            <thead>
            <tr>
                <th>No</th>
                <th>Ism</th>
                <th>Familiya</th>
                <th>Telefon raqami</th>
                <th>Sababi</th>
            </tr>
            </thead>
            <tbody>
            {render}
            </tbody>
        </Table>
    )
}


const Completed = ({progress, progressStatus, style = "black"}) => {
    if (progressStatus === "loading" || progressStatus === "idle") {
        return <DefaultLoaderSmall/>
    } else {
        return (
            <h1 style={{color: style, fontSize: "2.6rem"}}>{progress} </h1>
        )
    }
}


const RenderCards = ({isCompleted, arr, status, activeType, banList, banListCompleted}) => {




    const filteredItems = useCallback((color) => {
        return arr.filter(item => item.moneyType === color)
    }, [arr])

    if (status === "loading" || status === "idle") {
        return <DefaultLoader/>
    }


    return colorStatusList.map((item, i) => {

        switch (activeType) {
            case "debtors" || "students":
                if (banList.includes(item)) return null
                return (
                    <RenderItem
                        arr={filteredItems(item)}
                        index={i}
                    />
                )
            case "leads":
                if (isCompleted && banListCompleted.includes(item)) return null
                if (!isCompleted && banList.includes(item)) return null

                return (
                    <RenderItem
                        arr={filteredItems(item)}
                        index={i}
                    />
                )
        }
    })
}


// const Leads = ({isCompleted, arr, arrStatus}) => {
//     if (arrStatus === "loading" || arrStatus === "idle") {
//         return <DefaultLoader/>
//     } else {
//         const filteredRed = arr.filter(item => item.status === "red")
//         const filteredYellow = arr.filter(item => item.status === "yellow")
//         const filteredGreen = arr.filter(item => item.status === "green")
//         return (
//             colorStatusList.map((item, i) => {
//                 if (isCompleted && (item === "red" || item === "yellow")) return null
//                 if (!isCompleted && item === "green") return null
//                 return (
//                     <RenderItem
//                         arr={item === "red" ? filteredRed : item === "yellow" ? filteredYellow : filteredGreen}
//                         index={i}
//                     />
//                 )
//             })
//         )
//     }
// }
//
// const Student = ({arr, arrStatus}) => {
//     const filteredRed = arr.filter(item => item.status === "red")
//     const filteredYellow = arr.filter(item => item.status === "yellow")
//
//     if (arrStatus === "loading" || arrStatus === "idle") {
//         return <DefaultLoader/>
//     }
//     return (
//         colorStatusList.map((item, i) => {
//             if (item === "green") return null
//             return (
//                 <RenderItem
//                     arr={item === "red" ? filteredRed : filteredYellow}
//                     index={i}
//
//                 />
//
//
//             )
//         })
//     )
// }

const RenderItem = React.memo(({arr, index}) => {
    useEffect(() => {
        const elem = document.querySelectorAll("#main")
        const elements = document.querySelectorAll("#scroll__inner")
        const components = document.querySelectorAll("#scroll")
        elements.forEach((item, i) => {
            if (!item.innerHTML) {
                components[i].style.display = "none"
                if (elem[i]) elem[i].style.display = "none"
            } else {
                components[i].style.display = "flex"
                if (elem[i]) elem[i].style.display = "flex"
            }
        })
    }, [arr])

    const x = useMotionValue(0)
    const [width, setWidth] = useState(0)
    const wrapper = useRef()
    const {activeMenu, isCompleted} = useContext(FuncContext)

    useEffect(() => {
        setWidth(wrapper.current?.scrollWidth - wrapper.current?.offsetWidth)
        x.set(0)
    }, [arr.length, isCompleted, activeMenu])
    const controls = useDragControls()

    return (
        <motion.div
            key={index}
            className={cls.scroll}
            id="scroll"
            ref={wrapper}
        >
            <motion.div
                className={cls.scroll__inner}
                id="scroll__inner"
                drag={"x"}
                style={{
                    x
                }}
                dragElastic={0}
                dragMomentum={false}
                dragConstraints={{left: -width, right: 0}}
                dragControls={controls}
            >
                {
                    arr.map((item, i) => {
                        return (
                            <TaskCard
                                item={item}
                                index={i}
                            />
                        )
                    })
                }
            </motion.div>
        </motion.div>
    )
})

const TaskCard = ({item, index}) => {

    const {activeMenu, click, onDelete, getStudentId, isCompleted, getSelect} = useContext(FuncContext)
    const [style, setStyle] = useState({})

    useEffect(() => {
        switch (activeMenu) {
            case "lead":
                setStyle({
                    generalBack: item?.moneyType === "red" ?
                        "#FFE4E6" : item?.moneyType === "yellow" ?
                            "#FEF9C3" : "#DCFCE7",
                    backImage: item?.moneyType === "red" ?
                        `url(${taskCardBack})` : item?.moneyType === "yellow" ?
                            `url(${taskCardBack2})` : `url(${taskCardBack4})`,
                    imageColor: item?.moneyType === "red" ?
                        "#E11D48" : item?.moneyType === "yellow" ?
                            "#FDE047" : "#BEF264"
                })
                break;
            default:
                setStyle({
                    generalBack: item?.moneyType === "red" ?
                        "#FFE4E6" : "#FEF9C3",
                    strBack: item?.moneyType === "red" ?
                        "deeppink" : "#d7d700",
                    backImage: item?.moneyType === "red" ?
                        `url(${taskCardBack})` : `url(${taskCardBack2})`
                })
                break;
        }
    }, [activeMenu])

    return (
        <motion.div
            key={index}
            className={cls.item}
            style={{backgroundColor: style.generalBack}}
        >
            {
                activeMenu === "lead" ?
                    <i
                        className={classNames("fas fa-trash", cls.icon)}
                        onClick={() => {
                            onDelete(true)
                            getStudentId({id: item.id, status: item.moneyType})
                        }}
                    /> : null
            }
            <div
                className={classNames(cls.item__info, {
                    [cls.active]: activeMenu === "lead"
                })}
            >
                {
                    activeMenu === "lead" ? null : <h2
                        className={cls.debt}
                        style={{backgroundColor: style.strBack}}
                    >
                        {
                            activeMenu === "debtors" ? item?.balance : item?.registered_date
                        }
                    </h2>
                }
                <h2 className={cls.username}>{item?.name} {item?.surname}</h2>
                <ul
                    className={classNames(cls.infoList, {
                        [cls.active]: activeMenu === "lead"
                    })}
                >
                    <li className={cls.infoList__item}>Number: <span>{item?.phone}</span></li>
                    {
                        activeMenu === "newStudents" ? item?.subject?.map(item => {
                            return (
                                <li className={cls.infoList__item}>Fan: <span>{item}</span></li>
                            )
                        }) : null
                    }
                    {/*{*/}
                    {/*    activeMenu === "debtors" ? <>*/}
                    {/*        <li className={cls.infoList__item}>Ingliz tili: <span>390000</span></li>*/}
                    {/*        <li className={cls.infoList__item}>IT: <span>390000</span></li>*/}
                    {/*    </> : null*/}
                    {/*}*/}
                    {/*{*/}
                    {/*    activeMenu === "lead" ? null : <li className={cls.infoList__item}>*/}
                    {/*        Koment: <span>{item?.history[0]?.comment}  </span>*/}
                    {/*    </li>*/}
                    {/*}*/}
                    {
                        activeMenu === "newStudents" ?
                            <li className={cls.infoList__item}>Smen: <span>{item?.shift}</span></li> : null
                    }
                    {
                        activeMenu === "debtors" ?
                            <li className={cls.infoList__item}>Tel status: <span>{item?.reason}</span>
                            </li> : null
                    }
                </ul>
            </div>
            <div
                className={cls.item__image}
                style={{backgroundImage: style.backImage}}
            >
                <div
                    className={cls.circle}
                    onClick={
                        () =>
                            // (item.status === "green" || isCompleted) ? null :
                        {
                            click(item?.id)
                            getSelect(item)
                        }
                    }
                >
                    <img src={unknownUser} alt=""/>
                </div>
            </div>
        </motion.div>
    )
}

const SwitchButton = ({isCompleted, setIsCompleted, setSearchValue}) => {


    return (
        <div className={cls.switchBox}>
            <div className={`${cls.switch} ${isCompleted ? `${cls.completed}` : `${cls.inProgress} `}`}
                 onClick={() => {
                     setIsCompleted(!isCompleted)
                     setSearchValue("")
                 }}>
                <div className={cls.iconButton}>
                    {isCompleted ?
                        <div className={cls.icon__handlerSucces}>
                            <img className={cls.buttonIcon} src={switchCompletedBtn} alt=""/>
                        </div>

                        :
                        <div className={cls.icon__handler}>
                            <img src={switchXButton} className={cls.buttonIcon} alt=""/>
                        </div>
                    }
                </div>
                <span className={cls.textContent}>
                     {isCompleted ? (
                         <h1 className={cls.textContentSucces}>Completed</h1>
                     ) : (
                         <h1 className={cls.textContent}>In Progress</h1>
                     )}
                  </span>

            </div>
        </div>
    );
};


export default PlatformTaskManager;
