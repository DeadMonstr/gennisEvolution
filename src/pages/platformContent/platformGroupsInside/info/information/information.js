import React from "react";
import classNames from "classnames";
import {Link} from "react-router-dom";

import RequireAuthChildren from "components/requireAuthChildren/requireAuthChildren";
import {ROLES} from "constants/global";

import cls from "./style.module.sass";

const Information = ({data, statistics}) => {
    const dataKeys = Object.keys(data)
    return (
        <div className={classNames(cls.item, cls.information)}>
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
                <div className={cls.information__item}>
                    <span>Davomat foizi: </span>
                    <span>{statistics.attendance_percentage}%</span>
                </div>
                <div className={cls.information__item}>
                    <span>Chegirma foizi: </span>
                    <span>{statistics.discount_percentage}%</span>
                </div>
                <div className={cls.information__item}>
                    <span>Chegirma miqdori: </span>
                    <span>{statistics.discount_summ}</span>
                </div>
            </div>
        </div>
    )
}

export default Information;