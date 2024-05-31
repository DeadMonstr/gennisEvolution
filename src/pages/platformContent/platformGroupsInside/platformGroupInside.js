import React, {useCallback, useEffect, useState} from 'react';
import classNames from "classnames";

import cls from "./platformGroupInside.module.sass"
import {Link, Route, useNavigate, useParams, Routes, Navigate, NavLink} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {fetchGroup, setActiveBtn} from "slices/groupSlice";
import Modal from "components/platform/platformUI/modal";
import Confirm from "components/platform/platformModals/confirm/confirm";
import CheckPassword from "components/platform/platformModals/checkPassword/CheckPassword";
import RequireAuthChildren from "components/requireAuthChildren/requireAuthChildren";
import {BackUrl, BackUrlForDoc, headers, ROLES} from "constants/global";
import {useHttp} from "hooks/http.hook";
import user_img from "assets/user-interface/user_image.png";
import {useAuth} from "hooks/useAuth";
import BackButton from "../../../components/platform/platformUI/backButton/backButton";
import ObserveTeacherLesson from "pages/platformContent/platformGroupsInside/observeTeacherLesson/ObserveTeacherLesson";
import LessonPlan from "pages/platformContent/platformGroupsInside/lessonPlan/LessonPlan";
import ObservedTeacherLessons
    from "pages/platformContent/platformGroupsInside/observedTeacherLessons/ObservedTeacherLessons";


const PlatformMakeAttendance =  React.lazy(() => import('./makeAttendance/makeAttendance'));
const PlatformListAttendance =  React.lazy(() => import('./listAttendance/listAttendance'));
const PlatformChangeGroupInfo =  React.lazy(() => import('./changeGroupInfo/changeGroupInfo'));
const PlatformChangeGroupTime =  React.lazy(() => import('./changeGroupTime/changeGroupTime'));
const PlatformChangeGroupTeacher =  React.lazy(() => import('./changeGroupTeacher/changeGroupTeacher'));
const PlatformChangeGroupStudents =  React.lazy(() => import('./changeGroupStudents/changeGroupStudents'));
const PlatformAddToGroup=  React.lazy(() => import('./addToGroup/addToGroup'));
const PlatformMoveToGroup=  React.lazy(() => import('./moveToGroup/moveToGroup'));
const PlatformGroupTime =  React.lazy(() => import('pages/platformContent/platformTimeTable/group'));

const PlatformGroupInside = () => {
    const {groupId} = useParams()


    return (
        <Routes>
            <Route path="info" element={<GroupInfo groupId={groupId}/>}/>
            <Route path="makeAttendance" element={<PlatformMakeAttendance/>}/>
            <Route path="listAttendance" element={<PlatformListAttendance/>}/>
            <Route path="changeGroupInfo" element={<PlatformChangeGroupInfo/>}/>
            <Route path="changeGroupTime" element={<PlatformChangeGroupTime/>}/>
            <Route path="changeGroupTeacher" element={<PlatformChangeGroupTeacher/>}/>
            <Route path="changeGroupStudents" element={<PlatformChangeGroupStudents/>}/>
            <Route path="addToGroup" element={<PlatformAddToGroup/>}/>
            <Route path="groupTime" element={<PlatformGroupTime/>}/>
            <Route path="moveToGroup/:oldGroupId/:newGroupId" element={<PlatformMoveToGroup/>}/>
            <Route path="lessonPlan" element={<LessonPlan backBtn={true}/>}/>
            <Route path="observeTeacherLesson/*" element={<ObserveTeacherLesson/>}/>
            <Route path="observedTeacherLessons" element={<ObservedTeacherLessons/>}/>

            <Route path="*"  element={
                <Navigate to="info" replace />
            }
            />
        </Routes>
    )
}


const GroupInfo = ({groupId}) => {
    const {data,btns,groupName,id,teacherId,links,locationId,fetchGroupsStatus,isTime} = useSelector(state => state.group)
    const {isCheckedPassword} = useSelector(state => state.me)

    const [activeOptions,setActiveOptions] = useState(false)
    const [activeChangeModal,setActiveChangeModal] = useState(false)
    const [activeChangeModalName,setActiveChangeModalName] = useState("")
    const [activeCheckPassword,setActiveCheckPassword] = useState(false)


    const renderBtns = useCallback(() => {
        return btns.map(btn => {
            return (
                <div
                    onClick={() => activateBtn(btn.id)}
                    className={classNames(cls.subheader__linksItem, {
                        [cls.active]: btn.active
                    })}
                >
                    {btn.title}
                </div>
            )
        })
    },[btns])



    const renderInfo = useCallback(() => {
        // eslint-disable-next-line array-callback-return
        return btns.map(btn => {
            if (btn.active) {
                if (btn.name === "information") {
                    return(
                        <main className={cls.main}>
                            <InformationsGroup data={data} id={id} locationId={locationId}/>
                        </main>
                    )
                }
                if (btn.name === "addition") {
                    return (
                        <main className={classNames(cls.main,cls.mainFlex)}>
                            <AdditionGroup id={id} teacherId={teacherId}/>
                        </main>
                    )
                }
            }

        })
    },[btns, data, id, locationId, teacherId])

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const changeModal = (name) => {
        setActiveChangeModalName(name)
        if (!isCheckedPassword) {
            setActiveCheckPassword(true)
        } else {
            setActiveChangeModal(true)
        }
    }

    useEffect(() => {
        if (isCheckedPassword && activeChangeModalName) {
            setActiveCheckPassword(false)
            setActiveChangeModal(true)
        }
    },[activeChangeModalName, isCheckedPassword])

    const renderLinks = useCallback(() => {
        return links.map(link => {
            if (link.type === "link") {
                return (
                    <Link to={`../../../${link.link}/${locationId}/${groupId}`} className={cls.option}>
                        <span className={cls.icon}>
                            <i className={`fas ${link.iconClazz}`} />
                        </span>
                        <span>{link.title}</span>
                    </Link>

                    // <Link to={`../${link.link}/${locationId}/${groupId}`} className="option">
                    //     <span className="icon">
                    //         <i className={`fas ${link.iconClazz}`} />
                    //     </span>
                    //     <span>{link.title}</span>
                    // </Link>
                )
            }
            if (link.type === "btn") {
                return (
                    <div
                        onClick={() => changeModal(link.name)}
                        className={cls.option}
                    >
                        <span className={cls.icon}>
                            <i className={`fas ${link.iconClazz}`} />
                        </span>
                        <span>{link.title}</span>
                    </div>
                )
            }
        })
    },[changeModal, groupId, links, locationId])

    const {request} = useHttp()

    const getConfirmDelete = (name) => {
        if (name === "yes") {
            request(`${BackUrl}delete_group/${groupId}`,"GET",null, headers())
                .then(res => console.log(res))
        }
        setActiveChangeModal(false)
    }


    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchGroup(groupId))
    },[dispatch, groupId])

    const activateBtn = (id) => {
        dispatch(setActiveBtn({id}))
    }

    const renderedBtns = renderBtns()
    const renderedInfo = renderInfo()
    const renderedLinks = renderLinks()


    // if (fetchGroupsStatus === "loading") {
    //     return <DefaultLoader/>
    // } else if (fetchGroupsStatus === "error") {
    //     console.log('error')
    // }



    return (
        <div className={cls.insideGroup}>
            <header className={cls.header}>
                <div>
                    <BackButton/>
                </div>
                <div>
                    <h2>{groupName}</h2>
                </div>
                <div>
                    <RequireAuthChildren allowedRules={[ROLES.Admin,ROLES.Director,ROLES.Programmer]}>
                        <div
                            onClick={() => setActiveOptions(!activeOptions)}
                            className={cls.headerBtn}
                        >

                            <i className="fas fa-ellipsis-v" />

                            <div
                                className={classNames(cls.modalOptions, {
                                    [cls.active]: activeOptions
                                })}
                            >
                                {renderedLinks}
                            </div>
                        </div>
                    </RequireAuthChildren>
                </div>
            </header>
            <div className={cls.error}>
                <h1>{!isTime ? "Guruhga dars jadvali belgilanmagan !" : null}</h1>
            </div>

            <div className={cls.subheader}>
                <div className={cls.subheader__links}>
                    {renderedBtns}
                </div>
            </div>

            {renderedInfo}

            <RequireAuthChildren allowedRules={[ROLES.Admin,ROLES.Director,ROLES.Programmer]}>
                <Modal activeModal={activeCheckPassword} setActiveModal={() => setActiveCheckPassword(false)}>
                    <CheckPassword/>
                </Modal>
                {
                    activeChangeModalName === "deleteGroup" && isCheckedPassword ?
                        <Modal activeModal={activeChangeModal} setActiveModal={() => setActiveChangeModal(false)}>
                            <Confirm setActive={setActiveChangeModal} text={"Gruppani ochirishni hohlaysizmi ?"} getConfirm={getConfirmDelete}/>
                        </Modal> : null
                }
            </RequireAuthChildren>

        </div>
    );

}



const InformationsGroup = ({data, id,locationId}) => {

    const {role} = useAuth()
    const renderInformation = (data) => {
        const dataKeys = Object.keys(data)
        return (
            <div className={classNames(cls.main__item, cls.information)}>
                <div className={cls.information__header}>
                    <h1>Gruppa ma'lumotlari</h1>
                    <RequireAuthChildren allowedRules={[ROLES.Admin,ROLES.Director,ROLES.Programmer]}>
                        <Link
                            to={`../changeGroupInfo`}
                            className={cls.information__icons}
                        >
                            <i className="fas fa-edit" />
                        </Link>
                    </RequireAuthChildren>

                </div>
                <div className={cls.information__container}>
                    {
                        dataKeys.map(item => {
                            return (
                                <div className={cls.information__item}>
                                    <span>{data[item].name}: </span>
                                    <span>{data[item].value}</span>
                                </div>
                            )
                        })

                        // data.map(item => {
                        //     return (
                        //         <div className="information__item">
                        //             <span>{item.name}: </span>
                        //             <span>{item.value}</span>
                        //         </div>
                        //     )
                        // })
                    }
                </div>
            </div>
        )
    }

    const stringCheck = (name,length = 10) => {
        if (name.length > length) {
            return (
                <>
                    {name.substring(0,length)}...
                </>
            )
        }
        return name
    }

    const navigate = useNavigate()

    const LinkToUser = (e,id) => {
        if (role !== ROLES.Student) {
            navigate(`../../../profile/${id}`)
        }
    }



    const renderStudents = (data) => {
        return (
            <div className={classNames(cls.main__item,cls.students)}>
                <div className={cls.students__header}>
                    <h1>O'quvchilar</h1>
                    <RequireAuthChildren allowedRules={[ROLES.Admin,ROLES.Director,ROLES.Programmer]}>
                        <Link
                            to={`../changeGroupStudents`}
                            className={cls.students__icons}
                        >
                            <i className="fas fa-edit" />
                        </Link>
                    </RequireAuthChildren>
                </div>
                <div className={cls.students__container}>
                    {
                        data.map(item => {
                            const userImg = item.photo_profile ? `${BackUrlForDoc}${item.photo_profile}` : user_img
                            return (
                                <div className={cls.students__item} onClick={e => LinkToUser(e,item.id)}>
                                    <div>
                                        <img src={userImg} alt=""/>
                                    </div>
                                    <div className={cls.info}>
                                        <span>{stringCheck(item.name)}</span>
                                        <span>{stringCheck(item.surname)}</span>
                                    </div>
                                    <RequireAuthChildren allowedRules={[ROLES.Admin,ROLES.Director,ROLES.Programmer,ROLES.Teacher]}>
                                        <div>
                                            <div className={`${cls.money} ${cls[item.moneyType]}`}>{item.money}</div>
                                        </div>
                                    </RequireAuthChildren>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }

    const keys = Object.keys(data)

    // eslint-disable-next-line array-callback-return
    return keys.map(key => {
        if (key === "information") {
            return renderInformation(data[key])
        }
        if (key === "students") {
            return renderStudents(data[key])
        }
    })
}


const links = [
    {
        title: "Baholash",
        icon: "fa-calendar-check",
        href: "makeAttendance",
        role: [ROLES.Teacher]
    },
    {
        title: "Dars vaqtlari",
        icon: "fa-clock",
        href: "groupTime",
        role: [ROLES.Admin,ROLES.Teacher,ROLES.Director]
    },
    {
        title: "Davomat",
        icon: "fa-calendar-alt",
        href: "listAttendance",
        role: [ROLES.Admin,ROLES.Teacher,ROLES.Director]
    },
    {
        title: "Darslik Reja",
        icon: "fa-list",
        href: "lessonPlan",
        role: [ROLES.Admin,ROLES.Director]
    },
    {
        title: "Observe Lesson",
        icon: "fa-user-check",
        href: "observeTeacherLesson",
        role: [ROLES.Admin,ROLES.Director]
    },
    {
        title: "Observed Dates",
        icon: "fa-tasks",
        href: "observedTeacherLessons",
        role: [ROLES.Admin,ROLES.Director]
    },

]

const AdditionGroup = ({id,teacherId}) => {


    const renderLinks = () => {
        return links.map(item => {
            return (
                <RequireAuthChildren allowedRules={item.role}>
                    <div className={cls.addition__item} onClick={() => onNavigate(item.href)}>
                        <div className={cls.icon}>
                            <i className={`fas ${item.icon}`} />
                        </div>
                        <div className={cls.info}>{item.title}</div>
                    </div>
                </RequireAuthChildren>
            )
        })
    }


    const navigate = useNavigate()

    const onNavigate = (href) => {
        navigate(`../${href}`)
    }

    return (
        <div className={cls.addition}>
            {renderLinks()}
            {/*<RequireAuthChildren allowedRules={[ROLES.Teacher,ROLES.Admin]}>*/}
            {/*    <Link to={`../makeAttendance/${id}/${teacherId}`} className="main__item checkAttendance">*/}
            {/*        <div className="checkAttendance__container">*/}
            {/*            <div  className="subheader__item">*/}
            {/*                <i className="fas fa-calendar-check" />*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </Link>*/}
            {/*</RequireAuthChildren>*/}
            {/*<RequireAuthChildren allowedRules={[ROLES.Teacher,ROLES.Admin,ROLES.Director]}>*/}
            {/*    <Link to={`../listAttendance/${id}`} className="main__item checkAttendance">*/}
            {/*        <div className="checkAttendance__container">*/}
            {/*            <div  className="subheader__item">*/}
            {/*                <i className="fas fa-calendar-alt" />*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </Link>*/}
            {/*</RequireAuthChildren>*/}
            {/*<RequireAuthChildren allowedRules={[ROLES.Teacher,ROLES.Admin,ROLES.Director]}>*/}
            {/*    <Link to={`../groupTime/${id}`} className="main__item checkAttendance">*/}
            {/*        <div className="checkAttendance__container">*/}
            {/*            <div  className="subheader__item">*/}
            {/*                <i className="fas fa-clock" />*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </Link>*/}
            {/*</RequireAuthChildren>*/}

            {/*<RequireAuthChildren allowedRules={[ROLES.Admin,ROLES.Director]}>*/}
            {/*    <Link to={`../observeTeacherLesson`} className="main__item checkAttendance">*/}
            {/*        <div className="checkAttendance__container">*/}
            {/*            <div  className="subheader__item">*/}
            {/*                <i className="fas fa-user-check" />*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </Link>*/}
            {/*</RequireAuthChildren>*/}
            {/*<RequireAuthChildren allowedRules={[ROLES.Admin,ROLES.Director]}>*/}
            {/*    <Link to={`../lessonPlan`} className="main__item checkAttendance">*/}
            {/*        <div className="checkAttendance__container">*/}
            {/*            <div  className="subheader__item">*/}
            {/*                <i className="fas fa-list"></i>*/}
            {/*            </div>*/}

            {/*            <div className={"checkAttendance__info"}>{item.title}</div>*/}

            {/*        </div>*/}
            {/*    </Link>*/}
            {/*</RequireAuthChildren>*/}
            {/*<RequireAuthChildren allowedRules={[ROLES.Admin,ROLES.Director]}>*/}
            {/*    <Link to={`../observedTeacherLessons`} className="main__item checkAttendance">*/}
            {/*        <div className="checkAttendance__container">*/}
            {/*            <div  className="subheader__item">*/}
            {/*                <i className="fas fa-tasks" />*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </Link>*/}
            {/*</RequireAuthChildren>*/}
        </div>

    )
}

export default PlatformGroupInside;