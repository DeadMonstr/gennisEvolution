import React from 'react';
import classNames from "classnames";
import {Link} from "react-router-dom";

import RequireAuthChildren from "components/requireAuthChildren/requireAuthChildren";
import {BackUrlForDoc, ROLES} from "constants/global";

import cls from "./style.module.sass";
import user_img from "assets/user-interface/user_image.png";

const Students = ({data, stringCheck, LinkToUser}) => {
    return (
        <div className={classNames(cls.item,cls.students)}>
            <div className={cls.students__header}>
                <h1>O'quvchilar</h1>
                <RequireAuthChildren allowedRules={[ROLES.Admin,ROLES.Director,ROLES.Programmer]}>
                    <Link
                        to={`../../changeGroupStudents`}
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
    );
};

export default Students;