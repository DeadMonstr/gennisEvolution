import React, {useEffect, useState} from 'react';

import cls from "./platformSchoolTeacherStudents.module.sass"
import Table from "components/platform/platformUI/table";
import Search from "components/platform/platformUI/search";
import Button from "components/platform/platformUI/button";
import Modal from "components/platform/platformUI/modal";
import {useHttp} from "hooks/http.hook";
import {useDispatch} from "react-redux";
import {BackUrl, headers} from "constants/global";
import {setMessage} from "slices/messageSlice";
import {addSchoolTeacher, changeSchoolTeacher} from "slices/schoolProfileSlice";
import Input from "components/platform/platformUI/input";

const PlatformSchoolTeacherStudents = () => {

    const [active, setActive] = useState(false)

    const onActiveAdd = () => {
        setActive(true)
    }


    return (
        <div className={cls.students}>
            <h1>O'quvchilar ro'yxati</h1>

            <div className={cls.header}>
                <Search/>

                <Button onClickBtn={onActiveAdd}>Qo'shmoq</Button>
            </div>


            <div className={cls.wrapper}>

                <Table>
                    <thead>
                    <tr>
                        <th>№</th>
                        <th>Ism</th>
                        <th>Familya</th>
                        <th>Raqam</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>1</td>
                        <td>Abdulaziz</td>
                        <td>Abdulazizov</td>
                        <td>123123</td>
                    </tr>
                    </tbody>
                </Table>

            </div>


            {/*<Modal activeModal={active} setActiveModal={setActive}>*/}
            {/*    <CrudStudent/>*/}
            {/*</Modal>*/}
        </div>
    );
};


const CrudStudent = ({info,setActiveModal}) => {
    const [name, setName] = useState("")
    const [surname, setSurname] = useState("")
    const [phone, setPhone] = useState("")
    const [error, setError] = useState("")
    const [username, setUsername] = useState("")
    const [loading, setLoading] = useState(false)

    const [isChange, setIsChange] = useState(false)


    useEffect(() => {
        if (info) {
            setName(info.name)
            setSurname(info.surname)
            setPhone(info.phone)
            setUsername(info.username)
            setIsChange(true)
        }
    }, [info])


    const {request} = useHttp()


    const dispatch = useDispatch()


    const onSubmit = () => {

        const data = {
            username,
            name,
            surname,
            phone,
            type_user: "teacher",
        }


        if (isChange) {
            request(`${BackUrl}school/crud_school_user/${info.id}`, "PUT", JSON.stringify(data), headers())
                .then(res => {
                    dispatch(setMessage({
                        msg: "O'qituvchi muvaffaqiyatli o'zgartirildi",
                        type: "success",
                        active: true
                    }))
                    dispatch(changeSchoolTeacher(res.user))
                })
        } else {
            request(`${BackUrl}school/crud_school_user/`, "POST", JSON.stringify(data), headers())
                .then(res => {
                    dispatch(setMessage({
                        msg: "O'qituvchi muvaffaqiyatli yaratildi",
                        type: "success",
                        active: true
                    }))
                    dispatch(addSchoolTeacher(res.user))
                })
        }
        setActiveModal(false)
    }

    useEffect(() => {

        if (!username) return;


        if (username !== info?.username) {
            setLoading(true)
            request(`${BackUrl}check_username`, "POST", JSON.stringify(username))
                .then(res => {
                    setLoading(false)
                    if (res.found) {
                        setError("Username band")
                    } else {
                        setError("")
                    }
                })
        }
    }, [username, info])

    return (
        <div className={cls.addModal}>
            <h1>{isChange ? "O'quvchini malumotlarini o'zgartirish" : "O'quvchini qo'shish"}</h1>
            <div className={cls.wrapper}>
                {!!error && <div className={cls.error}>{error}</div>}
                <Input
                    value={username}
                    title={"username"}
                    name={"username"}
                    type={"text"}
                    onChange={setUsername}
                />
                <Input
                    title={"Ism"}
                    name={"name"}
                    type={"text"}
                    value={name}
                    onChange={setName}
                />
                <Input
                    title={"Familya"}
                    name={"surname"}
                    type={"text"}
                    value={surname}
                    onChange={setSurname}
                />
                <Input
                    title={"Tel"}
                    name={"phone"}
                    type={"text"}
                    value={phone}
                    onChange={setPhone}
                />
            </div>
            <Button disabled={error} onClickBtn={onSubmit} type={"submit"}>Qo'shish</Button>
        </div>
    )
}

export default PlatformSchoolTeacherStudents;