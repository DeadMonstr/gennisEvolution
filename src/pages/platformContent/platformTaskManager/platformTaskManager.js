import React, {useEffect, useState} from 'react';
import classNames from "classnames";
import {useForm} from "react-hook-form";
import Calendar from "react-calendar";
import {useDispatch, useSelector} from "react-redux";
import 'react-calendar/dist/Calendar.css';

import Modal from "components/platform/platformUI/modal";
import InputForm from "components/platform/platformUI/inputForm";
import Button from "components/platform/platformUI/button";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";
import {
    fetchedItems,
    changeNewStudents,
    changeNewStudentsDel
} from "slices/taskManagerSlice"

import cls from "./platformTaskManager.module.sass";
import unknownUser from "assets/user-interface/user_image.png";
import taskCardBack from "assets/background-img/TaskCardBack.png";
import taskCardBack2 from "assets/background-img/TaskCardBack2.png";
import taskCardBack3 from "assets/background-img/TaskCardBack3.png";

const PlatformTaskManager = () => {
    useEffect(() => {
        request(`${BackUrl}new_students_calling/${location}`, "GET", null, headers())
            .then(res => {
                console.log(res)
                dispatch(fetchedItems(res))
            })
            .catch(err => console.log(err))
    }, [])

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

    const {request} = useHttp()
    const dispatch = useDispatch()
    const {register, handleSubmit} = useForm()
    const [activeMenu, setActiveMenu] = useState(menuList[0]?.name)
    const [activeModal, setActiveModal] = useState(false)
    const [date, setDate] = useState(new Date())
    const [studentId, setStudentId] = useState()
    const {
        tasks,
        newStudents,
        tasksLoadingStatus
    } = useSelector(state => state.taskManager)
    const {location} = useSelector(state => state.me)

    const onSubmit = (data) => {
        const res = {
            id: studentId,
            ...data
        }
        console.log(res)
        request(`${BackUrl}new_students_calling`, "POST", JSON.stringify(res), headers())
            .then(res => {
                console.log(res)
                if (res?.student.name) {
                    dispatch(changeNewStudents(res?.student))
                } else {
                    dispatch(changeNewStudentsDel(res?.student))
                }
            })
            .catch(err => console.log(err))
    }

    const onClick = (id) => {
        setActiveModal(true)
        setStudentId(id)
    }

    return (
        <div className={cls.tasks}>
            <div className={cls.tasks__inner}>
                <div className={cls.header}>
                    <h1>My Projects</h1>
                    <div className={cls.header__userInfo}>
                        <img src={unknownUser} alt=""/>
                        <div className={cls.inner}>
                            <h2>Albert Flores</h2>
                            <p>Project Manager</p>
                        </div>
                    </div>
                </div>
                <div className={cls.info}>
                    <div className={cls.info__progress}>
                        <div className={cls.completeTask}>
                            <div className={cls.completeTask__progress}>
                                <div className={cls.taskItem}>
                                    <div className={cls.taskItem__info}>
                                        <div className={cls.icon}>
                                            <i className="far fa-calendar-times"/>
                                        </div>
                                        <h2>Tasks <br/> In Progress</h2>
                                    </div>
                                    <h1>17</h1>
                                </div>
                                <div className={cls.taskItem}>
                                    <div className={cls.taskItem__info}>
                                        <div className={cls.icon}>
                                            <i className="far fa-check-circle"/>
                                        </div>
                                        <h2>Project <br/> Completed</h2>
                                    </div>
                                    <h1>17</h1>
                                </div>
                            </div>
                            <div className={cls.completeTask__precent}>
                                <div className={cls.circleProgress}>
                                    <h1>75%</h1>
                                </div>
                                <h2>All Rating</h2>
                            </div>
                        </div>
                        <div className={cls.menuTask}>
                            <h1>My Tasks</h1>
                            <div className={cls.menuTask__list}>
                                <div className={cls.other}>
                                    {
                                        menuList.map(item =>
                                            <h2
                                                className={classNames(cls.other__item, {
                                                    [cls.active]: activeMenu === item.name
                                                })}
                                                onClick={() => setActiveMenu(item.name)}
                                            >
                                                {item.label}
                                            </h2>
                                        )
                                    }
                                </div>
                                <div className={cls.completed}>
                                    <h2>Completed</h2>
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
                        activeMenu === "lead" ? <>
                            <div className={cls.items__red}>
                                <TaskCard
                                    amount={780000}
                                    activeMenu={activeMenu}
                                    onClick={onClick}
                                />
                            </div>
                            <div className={cls.items__yellow}>
                                <TaskCard
                                    amount={280000}
                                    activeMenu={activeMenu}
                                    onClick={onClick}
                                />
                            </div>
                            <div>
                                <TaskCard
                                    amount={280000}
                                    activeMenu={activeMenu}
                                    onClick={onClick}
                                />
                            </div>
                        </> : activeMenu === "newStudents" ? <>
                            <div className={cls.items__red}>
                                {
                                    newStudents.map(item => {
                                        return (
                                            <TaskCard
                                                item={item}
                                                amount={780000}
                                                activeMenu={activeMenu}
                                                onClick={onClick}
                                            />
                                        )
                                    })
                                }
                            </div>
                            <div className={cls.items__yellow}>
                                <TaskCard
                                    amount={280000}
                                    activeMenu={activeMenu}
                                    onClick={onClick}
                                />
                            </div>
                        </> : <>
                            <div className={cls.items__red}>
                                <TaskCard
                                    amount={780000}
                                    activeMenu={activeMenu}
                                    onClick={onClick}
                                />
                            </div>
                            <div className={cls.items__yellow}>
                                <TaskCard
                                    amount={280000}
                                    activeMenu={activeMenu}
                                    onClick={onClick}
                                />
                            </div>
                        </>
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
                            placeholder={"Kament"}
                            name={"comment"}
                            register={register}
                            required
                        />
                        <InputForm
                            type={"date"}
                            placeholder={"Keyinga qoldirish"}
                            name={"date"}
                            register={register}
                            required
                        />
                        <Button>Add</Button>
                    </form>
                </div>
            </Modal>
        </div>
    );
};

const TaskCard = ({amount, activeMenu, onClick, item}) => {
    useEffect(() => {
        switch (activeMenu) {
            case "debtors":
                setStyle({
                    generalBack: status === "red" ?
                        "rgba(255, 192, 203, 0.55)" : "rgba(255,252,192,0.55)",
                    strBack: status === "red" ?
                        "deeppink" : "#d7d700",
                    backImage: status === "red" ?
                        `url(${taskCardBack})` : `url(${taskCardBack2})`
                });
                break;
            case "newStudents":
                setStyle({
                    generalBack: "#E0F2FE",
                    strBack: "#3B82F6",
                    backImage: `url(${taskCardBack3})`
                });
                break;
            case "lead":
                setStyle({
                    generalBack: "" || "" || "",
                    backImage: `` || `` || ``,

                })
        }
    }, [activeMenu])

    const status = amount > 500000 ? "red" : "yellow"
    const [style, setStyle] = useState({})

    return (
        <div
            className={cls.item}
            style={{backgroundColor: style.generalBack}}
            onClick={() => onClick(item?.id)}
        >
            <div className={cls.item__info}>
                <h2
                    className={cls.debt}
                    style={{backgroundColor: style.strBack}}
                >
                    {
                        activeMenu === "debtors" ? -amount : item?.registered_date
                    }
                </h2>
                <h2 className={cls.username}>{item?.name} {item?.surname}</h2>
                <ul className={cls.infoList}>
                    <li className={cls.infoList__item}>Number: <span>{item?.number}</span></li>
                    {
                        activeMenu === "newStudents" ? item?.subject.map(item => {
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
                    <li className={cls.infoList__item}>
                        Koment: <span>{item?.history[item?.history.length - 1]?.comment}</span>
                    </li>
                    {
                        activeMenu === "newStudents" ?
                            <li className={cls.infoList__item}>Smen: <span>{item?.shift}</span></li> : null
                    }
                    {
                        activeMenu === "debtors" ?
                            <li className={cls.infoList__item}>Tel qilingan: <span>01.01.2024</span></li> : null
                    }
                </ul>
            </div>
            <div
                className={cls.item__image}
                style={{backgroundImage: style.backImage}}
            >
                <div className={cls.circle}>
                    <img src={unknownUser} alt=""/>
                </div>
            </div>
        </div>
    )
}

export default PlatformTaskManager;