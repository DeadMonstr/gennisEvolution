import React, {useCallback, useEffect, useState} from 'react';


import cls from "./platformSchoolTeacher.module.sass"
import Button from "components/platform/platformUI/button";

import SchoolTeacherStudents from "./teacherStudents/SchoolTeacherStudents";
import SchoolTeacherAccount from "./teacherAccount/SchoolTeacherAccount";
import Modal from "components/platform/platformUI/modal";
import classNames from "classnames";
import Confirm from "components/platform/platformModals/confirm/confirm";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {fetchSchoolTeachers} from "slices/schoolProfileSlice";
import Input from "components/platform/platformUI/input";
import BackButton from "components/platform/platformUI/backButton/backButton";
import schoolTeacherProfile, {fetchSchoolTeacherProfile} from "slices/schoolTeacherProfileSlice";

const links = [
    "Profile", "O'quvchilar ro'yxati","Hisob"
]


const PlatformSchoolTeacher = () => {

    const {id} = useParams()

    const [activeLink,setActiveLink] = useState(0)
    const dispatch = useDispatch()


    useEffect(() => {
        if (id)
        dispatch(fetchSchoolTeacherProfile(id))
    },[id])


    const renderPage = useCallback(() => {
        switch (activeLink) {
            case 0:
                return <Profile/>
            case 1:
                return <SchoolTeacherStudents/>
            case 2:
                return <SchoolTeacherAccount/>
            default: <Profile/>
        }
    },[activeLink])







    return (
        <div className={cls.teacherProfile}>
            <BackButton/>
            <div className={cls.wrapper}>

                <div className={cls.links}>
                    {
                        links.map((item,index) => {
                            return (
                                <div onClick={() => setActiveLink(index)} className={classNames(cls.links__item, {[cls.active]: activeLink === index})}>
                                    {item}
                                </div>
                            )
                        })
                    }
                </div>

                {renderPage()}

            </div>


        </div>
    );
};

const Profile = () => {

    const {id} = useParams()
    const [changeActive,setChangeActive] = useState(false)
    const [deleteActive,setDeleteActive] = useState(false)


    const {data} = useSelector(state => state.schoolTeacherProfile)

    const onClickChange = () => {
        setChangeActive(true)
    }

    const onClickDelete = () => {
        setDeleteActive(true)
    }


    const {request} = useHttp()

    const onDelete = () => {
        request(`${BackUrl}/${id}`,"DELETE", null, headers())
            .then(res => {
                console.log(res)
            })
    }

    return (
        <div className={cls.header}>


            <div className={cls.info}>

                <h2>Ism: {data?.name} </h2>
                <h2>Familya: {data?.surname} </h2>
                <h2>Tel raqam: {data?.phone} </h2>

            </div>






            <Modal activeModal={changeActive} setActiveModal={setChangeActive}>
                <ChangeTeachers info={data}/>
            </Modal>

            <Modal activeModal={deleteActive} setActiveModal={setDeleteActive}>
                <Confirm text={"O'qituvchini o'chirishni hohlaysizmi ?"} getConfirm={onDelete} setActive={setDeleteActive}/>
            </Modal>
        </div>
    )
}


const ChangeTeachers = ({info}) => {

    const {id} = useParams()

    const [name,setName] = useState("")
    const [surname,setSurname] = useState("")
    const [phone,setPhone] = useState("")
    const [share,setShare] = useState("")


    useEffect(() => {
        if (info) {
            setName(info.name)
            setSurname(info.surname)
            setPhone(info.phone)
            setShare(info.share)
        }
    },[info])


    const {request} = useHttp()




    const onSubmit = () => {

        const data = {
            name,
            surname,
            phone,
            share
        }


        request(`${BackUrl}/${id}`,"PUT",JSON.stringify(data),headers())
            .then(res => {
                console.log(res)
            })

    }






    return (
        <div className={cls.addModal}>
            <h1>O'qituvchini malumotlarini o'zgartirish" </h1>
            <div className={cls.wrapper}>
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
                <Input
                    title={"Ulushi"}
                    name={"share"}
                    type={"number"}
                    value={share}
                    onChange={setShare}
                />
            </div>
            <Button onClickBtn={onSubmit} type={"submit"}>Qo'shish</Button>
        </div>
    )
}



export default PlatformSchoolTeacher;