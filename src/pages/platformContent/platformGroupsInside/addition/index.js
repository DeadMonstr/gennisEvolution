import React from "react";
import {useNavigate} from "react-router-dom";

import {ROLES} from "constants/global";
import RequireAuthChildren from "components/requireAuthChildren/requireAuthChildren";

import cls from "./style.module.sass";

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
        role: [ROLES.Admin, ROLES.Teacher, ROLES.Director]
    },
    {
        title: "Davomat",
        icon: "fa-calendar-alt",
        href: "listAttendance",
        role: [ROLES.Admin, ROLES.Teacher, ROLES.Director]
    },
    {
        title: "Darslik Reja",
        icon: "fa-list",
        href: "lessonPlan",
        role: [ROLES.Admin, ROLES.Director]
    },
    {
        title: "Observe Lesson",
        icon: "fa-user-check",
        href: "observeTeacherLesson",
        role: [ROLES.Admin, ROLES.Director]
    },
    {
        title: "Observed Dates",
        icon: "fa-tasks",
        href: "observedTeacherLessons",
        role: [ROLES.Admin, ROLES.Director]
    },

]

const Addition = () => {


    const renderLinks = () => {
        return links.map(item => {
            return (
                <RequireAuthChildren allowedRules={item.role}>
                    <div className={cls.addition__item} onClick={() => onNavigate(item.href)}>
                        <div className={cls.icon}>
                            <i className={`fas ${item.icon}`}/>
                        </div>
                        <div className={cls.info}>{item.title}</div>
                    </div>
                </RequireAuthChildren>
            )
        })
    }


    const navigate = useNavigate()

    const onNavigate = (href) => {
        navigate(`../../${href}`)
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

export default Addition;