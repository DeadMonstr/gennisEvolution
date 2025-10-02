import React, {useEffect, useState} from 'react';
import classNames from "classnames";
import {useDispatch, useSelector} from "react-redux";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";
import {setMessage} from "slices/messageSlice";


import cls from "./returnDeletedTeacher.module.sass"


const ReturnDeletedTeacher = ({userId}) => {

    const {user} = useSelector(state => state.usersProfile)
    const [isDeleted,setDeleted] = useState(false)


    useEffect(() => {
        if (user) {
            setDeleted(user.deleted)
        }
    },[user])

    const {request} = useHttp()
    const dispatch = useDispatch()
    const onClick = () => {
        request(`${BackUrl}base/change/delete/status/${userId}/`,"GET",null,headers())
            // request(`${BackUrl}hello/${userId}`,"GET",null,headers())
            .then(res => {
                dispatch(setMessage({
                    msg: res.msg,
                    type: "success",
                    active: true
                }))
                setDeleted(!isDeleted)

            })
            .catch(() => {
                dispatch(setMessage({
                    msg: "Serverda yoki internetingizda hatolik",
                    type: "error",
                    active: true
                }))
            })
    }


    return (
        <div className={cls.change}>


            <div
                onClick={onClick}
                className={classNames(cls.change_btn,{
                    [cls.red]: isDeleted
                })}
            >
                Foydalanuvchini qaytarish
            </div>
        </div>
    );
};

export default ReturnDeletedTeacher;