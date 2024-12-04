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
    changeNewStudentsDel,
    changeLead,
    deleteLead,
    fetchedProgress,
    fetchingProgress,
    fetchNewStudentsData,
    fetchDebtorStudentsData,
    fetchLeadsData,
    fetchCompletedDebtorsData,
    fetchedSearch,
    fetchingSearch,
    fetchDebtorsData,
    onDelDebtors,
    onChangeProgress,
    fetchUserDataWithHistory,
    fetchNewStudentsTaskData,
    onDelNewStudents,
    fetchCompletedNewStudentsTaskData, fetchCompletedLeadsData, onDelLeads
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
import {Link, useParams} from "react-router-dom";
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
const colorStatusList = ["red", "yellow", "green", "navy"]

const PlatformTaskManager = () => {

    const {locationId} = useParams()

    const {
        unCompleted,
        completed,
        completedDebtorStudent,
        progress,
        progressStatus,
        allProgress,
        isTable,
        unCompletedStatus,
        completedStatus,
        profile
    } = useSelector(state => state.taskManager)


    const [activeMenu, setActiveMenu] = useState(menuList[0].name)
    const [isCompleted, setIsCompleted] = useState(false)


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
    const [tableData, setTableDate] = useState([])


    const [data, setData] = useState([])
    const [banListColors, setBanListColors] = useState([])


    console.log(banListColors)


    useEffect(() => {
        const oldCompleted = JSON.parse(localStorage.getItem("isCompleted"))
        const type = localStorage.getItem("taskMenuType")
        if (oldCompleted) {
            setIsCompleted(oldCompleted)
        } else {
            setIsCompleted(false)
        }

        setActiveMenu(type)
    }, [])


    // Cards color banList

    useEffect(() => {


        if (isCompleted) {
            switch (activeMenu) {
                case "leads":
                    setBanListColors(["red", "yellow"])
                    break;
                case "newStudents":
                    setBanListColors(["green", "red"])
                    break;
                case "debtors":
                    setBanListColors(["green"])
                    break;
            }
        } else {
            switch (activeMenu) {
                case "debtors":
                    setBanListColors(["green"])
                    break;
                case "newStudents":
                    setBanListColors(["green", "red"])
                    break;
                case "leads":
                    setBanListColors(["green"])
                    break;
            }
        }


    }, [isCompleted, activeMenu])


    // Fetch data from type and date

    useEffect(() => {
        if (!locationId && !date) return;

        const formatted = formatDate(date)

        if (isCompleted) {
            switch (activeMenu) {
                case "debtors":
                    dispatch(fetchCompletedDebtorsData({locationId, date: formatted}))
                    break;
                case "newStudents":
                    dispatch(fetchCompletedNewStudentsTaskData({locationId, date: formatted}))
                    break;
                case "leads":
                    dispatch(fetchCompletedLeadsData({locationId, date: formatted}))
                    break;
            }
        } else {
            switch (activeMenu) {
                case "debtors":
                    dispatch(fetchDebtorsData({locationId, date: formatted}))
                    break;
                case "newStudents":
                    dispatch(fetchNewStudentsTaskData({locationId, date: formatted}))
                    break;
                case "leads":
                    dispatch(fetchLeadsData({locationId, date: formatted}))
                    break;


            }
        }


    }, [activeMenu, locationId, date, isCompleted])

    // set current data from fetched data

    useEffect(() => {
        if (!locationId && !date) return;


        if (isCompleted) {
            switch (activeMenu) {
                case "debtors":
                    setData(completed.debtors)
                    break;
                case "newStudents":
                    setData(completed.students)
                    break;
                case "leads":
                    setData(completed.leads)
                    break;


            }
        } else {
            switch (activeMenu) {
                case "debtors":
                    setData(unCompleted.debtors)
                    break;
                case "newStudents":
                    setData(unCompleted.students)
                    break;
                case "leads":
                    setData(unCompleted.leads)
                    break;


            }
        }


    }, [
        unCompleted.debtors,
        unCompleted.students,
        unCompleted.leads,
        completed.debtors,
        completed.students,
        completed.leads,
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
        completed.students.length,
        completed.leads.length,
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
                            localStorage.setItem("taskMenuType", item.name)
                        }}
                    >
                        {item.label}
                    </h2>
                </div>
            )
        })
    }, [activeMenu, menuList, unCompleted, completed])


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


            dispatch(onDelNewStudents({id: res.id}))


            request(`${BackUrl}call_to_new_students`, "POST", JSON.stringify(res), headers())
                .then(res => {


                    console.log(res)

                    if (res?.student.student_id) {
                        dispatch(onChangeProgress({
                            progress: res.student.task_statistics,
                            allProgress: res.student.task_daily_statistics
                        }))

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

            console.log(result)
            request(`${BackUrl}call_to_debts`, "POST", JSON.stringify(result), headers())
                .then(res => {

                    console.log(res)
                    dispatch(onDelDebtors({id: result.id}))
                    dispatch(onChangeProgress({progress: res.task_statistics, allProgress: res.task_daily_statistics}))

                    showMessage(res.message)
                })
                .catch(err => console.log(err))


        } else if (activeMenu === "leads") {

            request(`${BackUrl}task_leads_update/${studentId}`, "POST", JSON.stringify({
                ...res,
                location_id: locationId
            }), headers())
                .then(res => {
                    if (res.lead_id) {
                        dispatch(onDelLeads({id: res?.lead_id}))
                        dispatch(onChangeProgress({
                            progress: res.task_statistics,
                            allProgress: res.task_daily_statistics
                        }))
                    }
                    showMessage(res.msg)
                })
                .catch(err => console.log(err))


        }
    }

    const onClick = (id) => {
        setActiveModal(true)
        dispatch(fetchUserDataWithHistory({id, type: activeMenu}))
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
        request(`${BackUrl}task_leads_delete/${studentId?.id}`, "DELETE", JSON.stringify(res), headers())
            .then((res) => {
                setIsConfirm(false)
                setDellLead(false)
                dispatch(onDelLeads({id: studentId?.id}))
                dispatch(onChangeProgress({progress: res.task_statistics, allProgress: res.task_daily_statistics}))
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


    // const onSearch = (value) => {
    //     setSearchValue(value)
    //     if (value !== "") {
    //         dispatch(fetchingSearch())
    //
    //         request(`${BackUrl}search_student_in_task/${locationId}`, "POST", JSON.stringify({
    //             text: value,
    //             type: activeMenu,
    //             status: isCompleted
    //         }), headers())
    //             .then(res => {
    //                 dispatch(fetchedSearch(res.students))
    //             })
    //             .catch(err => console.log(err))
    //     }
    // }


    const contextObj = useMemo(() => ({
        activeMenu: activeMenu,
        getStudentId: setStudentId,
        click: onClick,
        onDelete: setDellLead,
        isCompleted: isCompleted,
        dispatch: dispatch,
        location: locationId,
        completedLength: completedDebtorStudent.length
    }), [activeMenu, isCompleted, locationId, completedDebtorStudent])


    // const resetStat = () => {
    //     request(`${BackUrl}`, "")
    // }


    const searchedData = useMemo(() => {
        const filteredData = data.slice()

        return filteredData.filter(item =>
            item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.surname.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.username.toLowerCase().includes(searchValue.toLowerCase())
        )
    }, [data, searchValue])


    const renderData = useCallback(() => {

        // if (unCompletedStatus === "loading" || unCompletedStatus === "idle" || completedStatus === "loading" || completedStatus === "idle" ) {
        //     return <DefaultLoaderSmall/>
        // }

        switch (isTable) {
            case true:
                return (
                    <TableData
                        isCompleted={isCompleted}
                        arr={searchedData}
                        activeType={activeMenu}
                    />
                )
            case false:
                return (
                    <RenderCards
                        isCompleted={isCompleted}
                        arr={searchedData}
                        activeType={activeMenu}
                        banList={banListColors}
                        status={unCompletedStatus || completedStatus}
                    />
                )
        }
    }, [isTable, searchedData, isCompleted, activeMenu, banListColors, unCompletedStatus, completedStatus, searchValue])


    return (
        <div className={cls.tasks}>
            <div className={cls.tasks__inner}>
                <div className={cls.header}>
                    <PlatformSearch search={searchValue} setSearch={setSearchValue}/>
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
                            {renderData()}
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
                                            <Completed progress={`${allProgress?.completed_tasks_percentage || 0}%`}/>
                                        </div>
                                        <h2>All Rating</h2>
                                    </div>
                                    <div>
                                        <div className={cls.circleProgress}>
                                            <Completed progress={`${progress?.completed_tasks_percentage || 0}%`}/>
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
                        <Link to={`../profile/${studentId}`}>
                            <img src={profile.img ? profile.img : unknownUser} alt=""/>
                        </Link>

                    </div>
                    <h2 className={cls.userbox__name}>
                        <span>{profile.name} {profile.surname}</span> <br/>
                    </h2>
                    <div className={cls.userbox__info}>
                        <div className={cls.userbox__infos}>
                            <p className={cls.userbox__subjects}>
                                Balance :
                                <span>{profile.balance ? profile.balance : <>No balance</>} </span>
                            </p>
                            <p className={cls.userbox__number}>
                                Number :
                                <span>{profile.phone} </span>
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
                {profile.comments?.length >= 1 ? <div className={cls.wrapperList}>
                    {
                        profile.comments && profile.comments?.map((item) => {
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


const RenderCards = ({isCompleted, arr, status, activeType, banList}) => {


    const filteredItems = useCallback((color) => {
        return arr.filter(item => {

            if (activeType === "leads") {
                return item.status === color
            }

            if (typeof item.moneyType === "string" && item.moneyType) {
                return item.moneyType === color
            }
            return item
        })
    }, [arr, activeType])

    if (status === "loading" || status === "idle") {
        return <DefaultLoader/>
    }


    return colorStatusList.map((item, i) => {

        switch (activeType) {
            case "debtors" :
                if (banList.includes(item)) return null

                return (
                    <RenderItem
                        arr={filteredItems(item)}
                        index={i}
                    />
                )

            case "newStudents":
                if (banList.includes(item)) return null
                return (
                    <RenderItem
                        arr={filteredItems(item)}
                        index={i}
                    />
                )
            case "leads":
                if (banList.includes(item)) return null
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

    const {activeMenu, click, onDelete, getStudentId, isCompleted} = useContext(FuncContext)
    const [style, setStyle] = useState({})

    useEffect(() => {
        switch (activeMenu) {
            case "leads":
                setStyle({
                    generalBack: item?.status === "red" ?
                        "#FFE4E6" : item?.status === "yellow" ?
                            "#FEF9C3" : "#DCFCE7",
                    backImage: item?.status === "red" ?
                        `url(${taskCardBack})` : item?.status === "yellow" ?
                            `url(${taskCardBack2})` : `url(${taskCardBack4})`,
                    imageColor: item?.status === "red" ?
                        "#E11D48" : item?.status === "yellow" ?
                            "#FDE047" : "#BEF264"
                })
                break;
            default:
                setStyle({
                    generalBack: item?.moneyType === "red" ?
                        "#FFE4E6" : item.moneyType === 'navy' ? "navy" : "#FEF9C3",
                    strBack: item?.moneyType === "red" ?
                        "deeppink" : item.moneyType === "navy" ? "color" : "#d7d700",
                    backImage: item?.moneyType === "red" ?
                        `url(${taskCardBack})` : `url(${taskCardBack2})`
                })
                break;
        }
    }, [activeMenu, item.moneyType, item?.status])


    return (
        <motion.div
            key={index}
            className={cls.item}
            style={{backgroundColor: style.generalBack, color: item.moneyType === "navy" ? "white" : ""}}
        >
            {
                (activeMenu === "leads" && !isCompleted) ?
                    <i
                        className={classNames("fas fa-trash", cls.icon)}
                        onClick={() => {
                            onDelete(true)
                            getStudentId({id: item.id, status: item.status})
                        }}
                    /> : null
            }
            <div
                className={classNames(cls.item__info, {
                    [cls.active]: activeMenu === "leads"
                })}

            >
                {
                    activeMenu === "leads" ? null : <h2
                        className={cls.debt}
                        style={{backgroundColor: style.strBack}}
                    >
                        {
                            activeMenu === "debtors" ? item?.balance : item?.registered_date
                        }
                    </h2>
                }
                <h2 style={{color: item.moneyType === "navy" ? "white" : ""}}
                    className={cls.username}>{item?.name} {item?.surname}</h2>
                <ul
                    className={classNames(cls.infoList, {
                        [cls.active]: activeMenu === "leads"
                    })}
                >
                    <li className={cls.infoList__item}>number: <span>{item?.phone}</span></li>
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
                    {
                        activeMenu === "leads" ? null : <li className={cls.infoList__item}>
                            Koment: <span>{item?.comment}  </span>
                        </li>
                    }
                    {
                        activeMenu === "newStudents" ?
                            <>

                                <li className={cls.infoList__item}>Smen: <span>{item?.shift}</span></li>
                                <li className={cls.infoList__item}>Number: <span>{item?.phone}</span></li>
                                <li className={cls.infoList__item}>Parent number: <span>{item?.parent}</span></li>
                            </> : null
                    }
                    {
                        activeMenu === "debtors" ?
                            <>

                                <li className={cls.infoList__item}>Tel status: <span>{item?.reason}</span></li>

                                <li className={cls.infoList__item}>Number: <span>{item?.phone}</span></li>
                                <li className={cls.infoList__item}>Parent number: <span>{item?.parent}</span></li>
                            </>


                            : null
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
