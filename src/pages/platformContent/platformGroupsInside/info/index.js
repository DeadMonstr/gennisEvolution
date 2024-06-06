import React, {useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

import {ROLES} from "constants/global";
import {useAuth} from "hooks/useAuth";
import Information from "./information/information";
import Students from "./students/students";
import DefaultLoader from "components/loader/defaultLoader/DefaultLoader";
import {fetchStatistics} from "slices/groupSlice";

import cls from "./style.module.sass";

const Info = () => {

    const {data, id, statistics, fetchGroupStatus} = useSelector(state => state.group)
    const {role} = useAuth()
    const dispatch = useDispatch()
    const stringCheck = (name, length = 10) => {
        if (name.length > length) {
            return (
                <>
                    {name.substring(0, length)}...
                </>
            )
        }
        return name
    }

    useEffect(() => {
        dispatch(fetchStatistics(id))
    }, [id])

    const navigate = useNavigate()

    const LinkToUser = (e, id) => {
        if (role !== ROLES.Student) {
            navigate(`../../../profile/${id}`)
        }
    }

    const keys = Object.keys(data)

    if (fetchGroupStatus === "loading" || fetchGroupStatus === "idle") {
        return <DefaultLoader/>
    }

    // eslint-disable-next-line array-callback-return
    return (
        <div className={cls.main}>
            {
                keys.map(key => {
                    if (key === "information") {
                        return <Information
                            data={data[key]}
                            statistics={statistics}
                        />
                    }
                    if (key === "students") {
                        return (
                            <div className={cls.wrapper}>
                                <Students
                                    data={data[key]}
                                    LinkToUser={LinkToUser}
                                    stringCheck={stringCheck}
                                />
                            </div>
                        )
                    }
                })
            }
        </div>
    )
};

export default Info;