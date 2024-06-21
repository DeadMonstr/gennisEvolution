import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import classNames from "classnames";
import {get, useForm} from "react-hook-form";
import Calendar from "react-calendar";
import {useDispatch, useSelector} from "react-redux";
import 'react-calendar/dist/Calendar.css';
import {motion} from "framer-motion";

import Modal from "components/platform/platformUI/modal";
import InputForm from "components/platform/platformUI/inputForm";
import Button from "components/platform/platformUI/button";
import ConfimReason from "components/platform/platformModals/confirmReason/confimReason";
import Select from "components/platform/platformUI/select";
import Confirm from "components/platform/platformModals/confirm/confirm";
import DefaultLoader from "components/loader/defaultLoader/DefaultLoader";
import PlatformMessage from "components/platform/platformMessage";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";
import {
    changeNewStudents,
    changeNewStudentsDel,
    changeDebtorStudents,
    changeDebtorStudentsDel,
    changeLead,
    deleteLead,
    fetchedProgress,
    fetchingProgress,
    fetchNewStudentsData,
    fetchDebtorStudentsData,
    fetchLeadsData
} from "slices/taskManagerSlice";

import cls from "./platformTaskManager.module.sass";
import unknownUser from "assets/icons/icon 4.png";
import taskCardBack from "assets/icons/icon 4.png";
import taskCardBack2 from "assets/icons/icon 4.png";
import taskCardBack4 from "assets/icons/icon 4.png";
import DefaultLoaderSmall from "components/loader/defaultLoader/defaultLoaderSmall";
import {setMessage} from "slices/messageSlice";
import {useParams} from "react-router-dom";
import Input from "components/platform/platformUI/input";
import PlatformSearch from "components/platform/platformUI/search";

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
        name: "lead",
        label: "Lead"
    }
]
const colorStatusList = ["red", "yellow", "green"]

const PlatformTaskManager = () => {
    const [activeMenu, setActiveMenu] = useState(menuList[0]?.name)
    const {locationId} = useParams()
    const [isCompleted, setIsCompleted] = useState(false)

    useEffect(() => {
        if (activeMenu === "newStudents") {
            dispatch(fetchNewStudentsData(locationId))
        } else if (activeMenu === "lead") {
            dispatch(fetchLeadsData(locationId))
        } else {
            dispatch(fetchDebtorStudentsData(locationId))
        }

    }, [activeMenu, locationId, isCompleted])

    const {request} = useHttp()
    const dispatch = useDispatch()
    const {register, handleSubmit, setValue} = useForm()
    const [activeModal, setActiveModal] = useState(false)
    const [date, setDate] = useState(new Date())
    const [studentId, setStudentId] = useState()
    const [studentSelect, setStudentSelect] = useState()
    const [dellLead, setDellLead] = useState(false)
    const [isConfirm, setIsConfirm] = useState(false)
    const [search, setSearch] = useState("")
    const [filtered, setFiltered] = useState([])

    const [getUser, setGetUser] = useState({})

    const {
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
        progressStatus
    } = useSelector(state => state.taskManager)

    useEffect(() => {
        dispatch(fetchingProgress())
        request(`${BackUrl}daily_statistics/${locationId}`, "POST", JSON.stringify(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`), headers())
            .then(res => {
                dispatch(fetchedProgress(res.info))
                if (!res.info) {
                    dispatch(setMessage({
                        msg: res.status,
                        type: "success",
                        active: true
                    }))
                }
            })
            .catch(err => console.log(err))
    }, [date, leads, debtorStudent, newStudents, locationId])

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
            request(`${BackUrl}new_students_calling/${locationId}`, "POST", JSON.stringify(res), headers())
                .then(res => {
                    if (res?.student.name) {
                        dispatch(changeNewStudents(res?.student))
                    } else {
                        dispatch(changeNewStudentsDel(res?.student))
                    }
                    showMessage(res.student.msg)
                })
                .catch(err => console.log(err))
        } else if (activeMenu === "debtors") {
            const result = {
                select: studentSelect,
                ...res
            }
            request(`${BackUrl}student_in_debts/${locationId}`, "POST", JSON.stringify(result), headers())
                .then(res => {
                    if (res?.student.name) {
                        dispatch(changeDebtorStudents(res?.student))
                    } else {
                        dispatch(changeDebtorStudentsDel(res?.student))
                    }
                    showMessage(res.student.msg)
                })
                .catch(err => console.log(err))
        } else if (activeMenu === "lead") {
            request(`${BackUrl}lead_crud/${studentId}`, "POST", JSON.stringify({
                ...res,
                location_id: locationId
            }), headers())
                .then(res => {
                    dispatch(changeLead(res?.lead))
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

    const searchedUsers = useCallback(() => {
        let filteredArr;
        switch (activeMenu) {
            case "newStudents":
                if (isCompleted)
                    filteredArr = completedNewStudents
                else
                    filteredArr = newStudents
                break;
            case "lead":
                if (isCompleted)
                    filteredArr = completedLeads
                else
                    filteredArr = leads
                break;
            default:
                if (isCompleted)
                    filteredArr = completedDebtorStudent
                else
                    filteredArr = debtorStudent
                break;
        }
        return filteredArr.filter(item =>
            item?.name?.toLowerCase().includes(search.toLowerCase()) ||
            item?.surname?.toLowerCase().includes(search.toLowerCase()) ||
            item?.username?.toLowerCase().includes(search.toLowerCase())
        )
    }, [activeMenu, search])

    useEffect(() => {
        setFiltered(searchedUsers())
    }, [activeMenu, search])

    const renderCards = useCallback((item, index, ref, activeStatus) => {
        if (item?.status === activeStatus) {
            return (<TaskCard
                key={index}
                item={item}
                index={index}
                ref={ref}
                activeMenu={activeMenu}
                setStudentId={setStudentId}
                onClick={onClick}
                onDelete={setDellLead}
                isCompleted={isCompleted}
                setGetUser={setGetUser}
            />)
        }
    }, [newStudents, debtorStudent, leads, activeMenu])

    return (
        <div className={cls.tasks}>
            <div className={cls.tasks__inner}>
                <div className={cls.header}>
                    <PlatformSearch search={search} setSearch={setSearch}/>
                    {/*<h1>My tasks</h1>*/}
                    {/*<div className={cls.header__search}>*/}
                    <SwitchButton isCompleted={isCompleted} setIsCompleted={setIsCompleted}/>
                    {/*<PlatformSearch search={search} setSearch={setSearch}/>*/}
                    {/*<Input*/}
                    {/*    placeholder={"Qidiruv"}*/}
                    {/*    // onChange={}*/}
                    {/*/>*/}
                    {/*</div>*/}
                </div>
                <div className={cls.contentTask}>
                    <h1>My tasks</h1>
                    <div className={cls.menuTask}>
                        <div className={cls.menuTask__list}>
                            <div className={cls.other}>
                                {
                                    menuList.map((item, i) =>
                                        <h2
                                            key={i}
                                            className={classNames(cls.other__item, {
                                                [cls.active]: activeMenu === item.name
                                            })}
                                            onClick={() => {
                                                setActiveMenu(item.name)
                                                // setIsCompleted(false)
                                            }}
                                        >
                                            {item.label}
                                        </h2>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>

                <div className={cls.tasks__handler}>
                    <div className={cls.tasks__main}>
                        <div className={cls.items}>
                            {
                                activeMenu === "lead"
                                    ?
                                    <Leads
                                        isCompleted={isCompleted}
                                        arr={search ? filtered : isCompleted ? completedLeads : leads}
                                        arrStatus={leadsStatus}
                                        renderCards={renderCards}
                                    />
                                    :
                                    activeMenu === "newStudents"
                                        ?
                                        <Student
                                            arr={search ? filtered : isCompleted ? completedNewStudents : newStudents}
                                            arrStatus={newStudentsStatus}
                                            renderCards={renderCards}
                                        />
                                        :
                                        <Student
                                            arr={search ? filtered : isCompleted ? completedDebtorStudent : debtorStudent}
                                            arrStatus={debtorStudentStatus}
                                            renderCards={renderCards}
                                        />
                            }
                        </div>
                    </div>
                    <div className={cls.tasks__banner}>
                        <div className={cls.info}>
                            <div className={cls.info__date}>
                                <Calendar onChange={setDate} value={date}/>
                            </div>
                        </div>
                        <div className={cls.info__progress}>
                            <div className={cls.completeTask}>
                                {/*<div className={cls.completeTask__progress}>*/}
                                {/*    <div*/}
                                {/*        className={classNames(cls.taskItem, {*/}
                                {/*            [cls.active]: !isCompleted*/}
                                {/*        })}*/}
                                {/*        onClick={() => setIsCompleted(false)}*/}
                                {/*    >*/}
                                {/*        <div className={cls.taskItem__info}>*/}
                                {/*            <div className={cls.icon}>*/}
                                {/*                <i className="far fa-calendar-times"/>*/}
                                {/*            </div>*/}
                                {/*            <h2>Tasks <br/> In Progress</h2>*/}
                                {/*        </div>*/}
                                {/*        <Completed*/}
                                {/*            progress={`${*/}
                                {/*                progress*/}
                                {/*                    ?*/}
                                {/*                    progress?.in_progress_tasks - progress?.completed_tasks*/}
                                {/*                    :*/}
                                {/*                    0*/}
                                {/*            }`}*/}
                                {/*            progressStatus={progressStatus}*/}
                                {/*        />*/}
                                {/*    </div>*/}
                                {/*    <div*/}
                                {/*        className={classNames(cls.taskItem, {*/}
                                {/*            [cls.active]: isCompleted*/}
                                {/*        })}*/}
                                {/*        onClick={() => setIsCompleted(true)}*/}
                                {/*    >*/}
                                {/*        <div className={cls.taskItem__info}>*/}
                                {/*            <div className={cls.icon}>*/}
                                {/*                <i className="far fa-check-circle"/>*/}
                                {/*            </div>*/}
                                {/*            <h2>Project <br/> Completed</h2>*/}
                                {/*        </div>*/}
                                {/*        <Completed*/}
                                {/*            progress={`${*/}
                                {/*                progress ? progress?.completed_tasks : 0*/}
                                {/*            }`}*/}
                                {/*            progressStatus={progressStatus}*/}
                                {/*        />*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                                <div className={cls.completeTask__precent}>
                                    <div className={cls.circleProgress}>
                                        <Completed
                                            progress={`${
                                                progress ? progress?.completed_tasks_percentage : 0
                                            }%`}
                                            progressStatus={progressStatus}
                                        />
                                    </div>
                                    <h2>All Rating</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>


            <Modal
                activeModal={activeModal}
                setActiveModal={setActiveModal}
            >
                <div className={cls.tasks__modal}>
                    <form
                        className={cls.wrapper}
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        {
                            activeMenu === "debtors" ? <Select
                                options={options}
                                onChangeOption={onChange}
                            /> : null
                        }
                        <InputForm
                            title={"Kament"}
                            placeholder={"Kament"}
                            name={"comment"}
                            register={register}
                            required
                        />
                        {
                            studentSelect === "tel ko'tarmadi" ? null : <InputForm
                                title={"Sana"}
                                type={"date"}
                                placeholder={"Keyinga qoldirish"}
                                name={"date"}
                                register={register}
                                required
                            />
                        }
                        <Button type={"submit"}>Add</Button>
                    </form>
                </div>
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
    );
};

const Completed = ({progress, progressStatus}) => {
    if (progressStatus === "loading" || progressStatus === "idle") {
        return <DefaultLoaderSmall/>
    } else {
        return (
            <h1>{progress}</h1>
        )
    }
}

const Leads = ({isCompleted, arr, arrStatus, renderCards}) => {
    if (arrStatus === "loading" || arrStatus === "idle") {
        return <DefaultLoader/>
    } else {
        return (
            colorStatusList.map((item, i) => {
                if (isCompleted && (item === "red" || item === "yellow")) return null
                if (!isCompleted && item === "green") return null
                return (
                    <RenderItem
                        arr={arr}
                        renderCards={renderCards}
                        status={item}
                        index={i}
                    />
                )
            })
        )
    }
}

const Student = ({arr, arrStatus, renderCards}) => {
    if (arrStatus === "loading" || arrStatus === "idle") {
        return <DefaultLoader/>
    } else {
        return (colorStatusList.map((item, i) => {
            if (item === "green") return null
            return (<RenderItem
                arr={arr}
                renderCards={renderCards}
                status={item}
                index={i}
            />)
        }))
    }
}

const RenderItem = ({arr, renderCards, status, index}) => {
    useEffect(() => {
        const elements = document.querySelectorAll(".platformTaskManager_scroll__inner__R2L8r")
        const components = document.querySelectorAll(".platformTaskManager_scroll__ebGEP")
        elements.forEach((item, i) => {
            if (!item.innerHTML) components[i].style.display = "none"
        })
    }, [])

    const [width, setWidth] = useState(0)
    const ref = useRef([])
    const wrapper = useRef()

    useEffect(() => {
        setWidth(wrapper.current?.scrollWidth - wrapper.current?.offsetWidth)
    }, [arr.length])

    return (<motion.div
        key={index}
        className={cls.scroll}
        ref={wrapper}
    >
        <motion.div
            className={cls.scroll__inner}
            drag={"x"}
            dragConstraints={{left: -width, right: 0}}
        >
            {arr.map(((item, i) => {
                return (renderCards(item, i, ref, status))
            }))}
        </motion.div>
    </motion.div>)
}

const TaskCard = ({activeMenu, onClick, item, index, isCompleted, onDelete, setStudentId}) => {

    useEffect(() => {
        switch (activeMenu) {
            case "lead":
                setStyle({
                    generalBack: item?.status === "red" ? "#FFE4E6" : item?.status === "yellow" ? "#FEF9C3" : "#DCFCE7",
                    backImage: item?.status === "red" ? `url(${taskCardBack})` : item?.status === "yellow" ? `url(${taskCardBack2})` : `url(${taskCardBack4})`,
                    imageColor: item?.status === "red" ? "#E11D48" : item?.status === "yellow" ? "#FDE047" : "#BEF264"
                })
                break;
            default:
                setStyle({
                    generalBack: item?.status === "red" ? "#FFE4E6" : "#FEF9C3",
                    strBack: item?.status === "red" ? "deeppink" : "#d7d700",
                    backImage: item?.status === "red" ? `url(${taskCardBack})` : `url(${taskCardBack2})`
                })
                break;
        }
    }, [activeMenu])

    const [style, setStyle] = useState({})

    return (<motion.div
        key={index}
        className={cls.item}
        style={{backgroundColor: style.generalBack}}
    >
        {activeMenu === "lead" ? <i
            className={classNames("fas fa-trash", cls.icon)}
            onClick={() => {
                // console.log(true, item.id)
                onDelete(true)
                setStudentId({id: item.id, status: item.status})
            }}
        /> : null}
        <div
            className={classNames(cls.item__info, {
                [cls.active]: activeMenu === "lead"
            })}
        >
            {activeMenu === "lead" ? null : <h2
                className={cls.debt}
                style={{backgroundColor: style.strBack}}
            >
                {activeMenu === "debtors" ? item?.balance : item?.registered_date}
            </h2>}
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
                            <li className={cls.infoList__item}>{item}: <span>{item.balance && item ? item.balance :
                                <span>balance yuq</span>}</span></li>
                        )
                    }) : null
                }

                {activeMenu === "lead" ? null : <li className={cls.infoList__item}>
                    Koment: <span>{item?.history  ? item?.history[item?.history.length - 1]?.comment : null}</span>
                </li>}
                {activeMenu === "newStudents" ?
                    <li className={cls.infoList__item}>Smen: <span>{item?.shift}</span></li> : null}
                {activeMenu === "debtors" ?
                    <li className={cls.infoList__item}>Tel
                        qilingan: <span>{item?.history  ? item?.history[item?.history.length - 1]?.added_date:null}</span>
                    </li> : null}
            </ul>
        </div>
        <div
            className={cls.item__image}
            style={{backgroundImage: style.backImage}}
        >
            <div
                className={cls.circle}
                onClick={() =>
                    (item.status === "green" || isCompleted) ? null : onClick(item?.id) & setGetUser(item)
                }
            >
                <img src={unknownUser} alt=""/>
            </div>
        </div>
    </motion.div>)
}

const SwitchButton = ({isCompleted, setIsCompleted}) => {


    return (
        <div className={cls.switchBox}>
            <div className={`${cls.switch} ${isCompleted ? `${cls.completed}` : `${cls.inProgress} `}`}
                 onClick={()=> setIsCompleted(!isCompleted)}>
                <div className={cls.iconButton}>
                    {isCompleted ?
                        <div className={cls.icon__handlerSucces}>
                            <img className={cls.buttonIcon} src={switchCompletedBtn}/>
                        </div>

                        :
                        <div className={cls.icon__handler}>
                            <img src={switchXButton} className={cls.buttonIcon}/>
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
