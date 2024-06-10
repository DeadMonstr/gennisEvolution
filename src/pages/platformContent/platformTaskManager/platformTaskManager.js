import React, {useCallback, useEffect, useRef, useState} from 'react';
import classNames from "classnames";
import {useForm} from "react-hook-form";
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
    fetchLeadsData,
} from "slices/taskManagerSlice";

import cls from "./platformTaskManager.module.sass";
import unknownUser from "assets/user-interface/user_image.png";
import taskCardBack from "assets/background-img/TaskCardBack.png";
import taskCardBack2 from "assets/background-img/TaskCardBack2.png";
import taskCardBack4 from "assets/background-img/TaskCardBack4.png";
import DefaultLoaderSmall from "components/loader/defaultLoader/defaultLoaderSmall";
import {setMessage} from "slices/messageSlice";
import {useParams} from "react-router-dom";

const options = [
    {
        name: "yes",
        label: "ha"
    },
    {
        name: "no",
        label: "yo'q"
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

    useEffect(() => {
        if (activeMenu === "newStudents") {
            dispatch(fetchNewStudentsData(locationId))
        } else if (activeMenu === "lead") {
            dispatch(fetchLeadsData(locationId))
        } else {
            dispatch(fetchDebtorStudentsData(locationId))
        }

    }, [activeMenu,locationId])

    const {request} = useHttp()
    const dispatch = useDispatch()
    const {register, handleSubmit} = useForm()
    const [activeModal, setActiveModal] = useState(false)
    const [date, setDate] = useState(new Date())
    const [studentId, setStudentId] = useState()
    const [studentSelect, setStudentSelect] = useState()
    const [isCompleted, setIsCompleted] = useState(false)
    /// isConfirm
    const [dellLead, setDellLead] = useState(false)
    const [isConfirm, setIsConfirm] = useState(false)

    const {
        newStudents,
        newStudentsStatus,
        completedNewStudents,
        debtorStudent,
        debtorStudentStatus,
        completedDebtorStudent,
        leads,
        leadsStatus,
        progress,
        progressStatus
    } = useSelector(state => state.taskManager)


    const {surname, name} = useSelector(state => state.me)

    // console.log(newStudents, "newStudents")
    // console.log(debtorStudent, "debtorStudent")
    // console.log(leads, "leads")

    // console.log(debtorStudent, "debtorStudent")
    // console.log(completedDebtorStudent, "completedDebtorStudent")
    // console.log(isCompleted, "isCompleted")

    useEffect(() => {
        dispatch(fetchingProgress())
        request(`${BackUrl}daily_statistics/${locationId}`, "POST", JSON.stringify(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`), headers())
            .then(res => {
                dispatch(fetchedProgress(res.info))
                if (!res.info) {
                    dispatch(setMessage({
                        msg: res?.status,
                        type: "success",
                        active: true
                    }))
                }
            })
            .catch(err => console.log(err))
    }, [date, leads, debtorStudent, newStudents,locationId])

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
                    setActiveModal(false)
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
                    setActiveModal(false)
                })
                .catch(err => console.log(err))
        } else if (activeMenu === "lead") {
            request(`${BackUrl}lead_crud/${studentId}`, "POST", JSON.stringify({...res,location_id: locationId}), headers())
                .then(res => {
                    console.log(res)
                    dispatch(changeLead(res?.lead))
                    setActiveModal(false)
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
                // setChangeLead(false)
                // dispatch(onDeleteLead({id: changeLeadData.id}))
                // dispatch(setMessage({
                //     msg: `${changeLeadData.name} o'chirildi `,
                //     type: "success",
                //     active: true
                // }))
            })

        // if (data.confirm === "no") {
        //     setDellLead(false)
        // }
    }

    const renderCards = useCallback((item, index, ref, activeStatus) => {
        if (item?.status === activeStatus) {
            return (
                <TaskCard
                    key={index}
                    item={item}
                    index={index}
                    ref={ref}
                    activeMenu={activeMenu}
                    setStudentId={setStudentId}
                    onClick={onClick}
                    onDelete={setDellLead}
                />
            )
        }
    }, [newStudents, debtorStudent, leads, activeMenu])

    return (
        <div className={cls.tasks}>
            <div className={cls.tasks__inner}>
                <div className={cls.header}>
                    <h1>My tasks</h1>

                </div>
                <div className={cls.info}>
                    <div className={cls.info__progress}>
                        <div className={cls.completeTask}>
                            <div className={cls.completeTask__progress}>
                                <div
                                    className={classNames(cls.taskItem, {
                                        [cls.active]: !isCompleted
                                    })}
                                    onClick={() => setIsCompleted(false)}
                                >
                                    <div className={cls.taskItem__info}>
                                        <div className={cls.icon}>
                                            <i className="far fa-calendar-times"/>
                                        </div>
                                        <h2>Tasks <br/> In Progress</h2>
                                    </div>
                                    <Completed
                                        progress={`${
                                            progress
                                                ?
                                                progress?.in_progress_tasks - progress?.completed_tasks
                                                :
                                                0
                                        }`}
                                        progressStatus={progressStatus}
                                    />
                                </div>
                                <div
                                    className={classNames(cls.taskItem, {
                                        [cls.active]: isCompleted
                                    })}
                                    onClick={() => setIsCompleted(true)}
                                >
                                    <div className={cls.taskItem__info}>
                                        <div className={cls.icon}>
                                            <i className="far fa-check-circle"/>
                                        </div>
                                        <h2>Project <br/> Completed</h2>
                                    </div>
                                    <Completed
                                        progress={`${
                                            progress ? progress?.completed_tasks : 0
                                        }`}
                                        progressStatus={progressStatus}
                                    />
                                </div>
                            </div>
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
                                                    setIsCompleted(false)
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
                    <div className={cls.info__date}>
                        <Calendar onChange={setDate} value={date}/>
                    </div>
                </div>
                <div className={cls.items}>
                    {
                        activeMenu === "lead"
                            ?
                            <Leads
                                isCompleted={isCompleted}
                                arr={leads}
                                arrStatus={leadsStatus}
                                renderCards={renderCards}
                            />
                            :
                            activeMenu === "newStudents"
                                ?
                                <Student
                                    // isCompleted={isCompleted}
                                    arr={isCompleted ? completedNewStudents : newStudents}
                                    // completedArr={completedNewStudents}
                                    arrStatus={newStudentsStatus}
                                    renderCards={renderCards}
                                />
                                :
                                <Student
                                    // isCompleted={isCompleted}
                                    arr={isCompleted ? completedDebtorStudent : debtorStudent}
                                    // completedArr={completedDebtorStudent}
                                    arrStatus={debtorStudentStatus}
                                    renderCards={renderCards}
                                />
                    }
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
                        <InputForm
                            title={"Kament"}
                            placeholder={"Kament"}
                            name={"comment"}
                            register={register}
                            required
                        />
                        <InputForm
                            title={"Sana"}
                            type={"date"}
                            placeholder={"Keyinga qoldirish"}
                            name={"date"}
                            register={register}
                            required
                        />
                        {
                            activeMenu === "debtors" ? <Select
                                options={options}
                                onChangeOption={onChange}
                            /> : null
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
        return (
            colorStatusList.map((item, i) => {
                if (item === "green") return null
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

    return (
        <motion.div
            key={index}
            className={cls.scroll}
            ref={wrapper}
        >
            <motion.div
                className={cls.scroll__inner}
                drag={"x"}
                dragConstraints={{left: -width, right: 0}}
            >
                {
                    arr.map(((item, i) => {
                        return (
                            renderCards(item, i, ref, status)
                        )
                    }))
                }
            </motion.div>
        </motion.div>
    )
}

const TaskCard = ({activeMenu, onClick, item, index, ref, onDelete, setStudentId}) => {

    useEffect(() => {
        switch (activeMenu) {
            case "lead":
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
                    generalBack: item?.status === "red" ?
                        "#FFE4E6" : "#FEF9C3",
                    strBack: item?.status === "red" ?
                        "deeppink" : "#d7d700",
                    backImage: item?.status === "red" ?
                        `url(${taskCardBack})` : `url(${taskCardBack2})`
                })
                break;
        }
    }, [activeMenu])

    const [style, setStyle] = useState({})

    return (
        <motion.div
            key={index}
            className={cls.item}
            style={{backgroundColor: style.generalBack}}
            // ref={el => ref.current[index] = el}
        >
            {
                activeMenu === "lead" ?
                    <i
                        className={classNames("fas fa-trash", cls.icon)}
                        onClick={() => {
                            // console.log(true, item.id)
                            onDelete(true)
                            setStudentId({id: item.id, status: item.status})
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
                    {
                        activeMenu === "" ? <>
                            <li className={cls.infoList__item}>Ingliz tili: <span>390000</span></li>
                            <li className={cls.infoList__item}>IT: <span>390000</span></li>
                        </> : null
                    }
                    {
                        activeMenu === "lead" ? null : <li className={cls.infoList__item}>
                            Koment: <span>{item?.history[item?.history.length - 1]?.comment}</span>
                        </li>
                    }
                    {
                        activeMenu === "newStudents" ?
                            <li className={cls.infoList__item}>Smen: <span>{item?.shift}</span></li> : null
                    }
                    {
                        activeMenu === "debtors" ?
                            <li className={cls.infoList__item}>Tel status: <span>{item?.payment_reason}</span>
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
                    onClick={() => item.status === "green" ? null : onClick(item?.id)}
                >
                    <img src={unknownUser} alt=""/>
                </div>
            </div>
        </motion.div>
    )
}

export default PlatformTaskManager;