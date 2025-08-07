import React, {useCallback, useEffect} from 'react';

import cls from "./platformSchoolProfile.module.sass"
import {SchoolDirector} from "./schoolDirector/schoolDirector";
import {SchoolTeachers} from "./schoolTeachers/schoolTeachers";
import classNames from "classnames";
import {useDispatch, useSelector} from "react-redux";
import {fetchSchoolInfo} from "slices/schoolProfileSlice";
import DefaultLoader from "components/loader/defaultLoader/DefaultLoader";
import {useNavigate, useParams} from "react-router-dom";
import Button from "components/platform/platformUI/button";
import Modal from "components/platform/platformUI/modal";
import Confirm from "components/platform/platformModals/confirm/confirm";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";
import Select from "components/platform/platformUI/select";
import Input from "components/platform/platformUI/input";
import {setMessage} from "slices/messageSlice";
import {fetchSchools} from "slices/schoolsSlice";



const links = [
    "Info","Director","Teacher"
]

const PlatformSchoolProfile = () => {


    const {id} = useParams()

    const [activeLink,setActiveLink] = React.useState(links[0])
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchSchoolInfo(id))
    },[id])



    const renderPage = useCallback(() => {
        switch (activeLink) {
            case "Info":
                return <Info />
            case "Director":
                return <SchoolDirector />
            case "Teacher":
                return <SchoolTeachers />
            default:
                return <Info />
        }
    },[activeLink])



    return (
        <div className={cls.schoolProfile}>

            <div className={cls.header}>


                <div className={cls.links}>

                    {
                        links.map(item => {
                            return (
                                <div
                                    onClick={() => setActiveLink(item)}
                                    className={classNames(cls.links__item, {
                                        [cls.active]: activeLink === item
                                    })}
                                >
                                    <span>{item}</span>
                                </div>
                            )
                        })
                    }


                </div>

            </div>


            <div className={cls.container}>
                {renderPage()}
            </div>
        </div>
    );
};


const Info = () => {

    const {fetchSchoolInfoStatus,info} = useSelector(state => state.schoolProfile)


    const [activeModal,setActiveModal] = React.useState(false)
    const [deleteModal,setDeleteModal] = React.useState(false)


    const {request} = useHttp()
    const dispatch = useDispatch()
    const navigate = useNavigate()




    const onClickChange = () => {
        setActiveModal(true)
    }

    const onClickDelete = () => {
        setDeleteModal(true)
    }



    if (fetchSchoolInfoStatus === "Loading") {
        return <DefaultLoader/>
    }

    const onDelete = (data) => {
        if (data === "yes") {
            request(`${BackUrl}school/crud_school/${info.id}`,"DELETE", null, headers())
                .then(res => {
                    setDeleteModal(false)
                    dispatch(setMessage({
                        msg: "Maktab muvaffaqiyatli o'chirildi",
                        type: "success",
                        active: true
                    }))
                    navigate(-1)
            })
        }
    }


    return (
        <div className={cls.info}>


            <div className={cls.info__header}>

                <Button onClickBtn={onClickChange}>
                    <i className="fas fa-pen" />
                </Button>
                <Button type={"danger"} onClickBtn={onClickDelete}>O'chirish</Button>

            </div>


            <div className={cls.info__wrapper}>
                <h1>Maktab: {info.number}</h1>
                <h1>Maktab raqami: {info.phone_number}</h1>
                <h1>Viloyat: {info.region?.name}</h1>
                <h1>Tuman: {info.district?.name}</h1>
            </div>


            <Modal activeModal={activeModal} setActiveModal={setActiveModal}>
                <ChangeSchool info={info} setActive={setActiveModal}/>
            </Modal>

            <Modal activeModal={deleteModal} setActiveModal={setDeleteModal}>
                <Confirm text={"Maktabni o'chirishni hohlaysizmi?"} setActive={setDeleteModal} getConfirm={onDelete}  />
            </Modal>

        </div>
    )
}


const ChangeSchool = ({info,setActive}) => {

    const {id} = useParams()

    const [schools, setSchools] = React.useState([])
    const [regions, setRegions] = React.useState([])
    const [districts, setDistricts] = React.useState([])


    const [school, setSchool] = React.useState("")
    const [region, setRegion] = React.useState("")
    const [district, setDistrict] = React.useState("")
    const [phone, setPhone] = React.useState("")


    useEffect(() => {
        if (info) {
            setSchool(info.number)
            setRegion(info.region?.id)
            setDistrict(info.district?.id)
            setPhone(info.phone_number)
        }
    },[info])


    const {request} = useHttp()

    useEffect(() => {
        request(`${BackUrl}school/school_details`,"GET",null,headers())
            .then(res => {
                setSchools(res.school_numbers)
                setRegions(res.regions)
            })
    },[])


    useEffect(() => {
        if (region) {
            request(`${BackUrl}school/school_details/${region}`,"GET",null,headers())
                .then(res => {
                    setDistricts(res.districts)
                })
        }
    },[region])


    const onChangeRegion = (e) => {
        setRegion(e)
    }

    const onChangeDistrict = (e) => {
        setDistrict(e)
    }

    const onChangeSchool = (e) => {
        setSchool(e)
    }


    const dispatch = useDispatch()

    const onSubmit = () => {

        const data = {
            region,
            district,
            number: school,
            phone
        }



        request(`${BackUrl}school/crud_school/${id}`,"PUT",JSON.stringify(data),headers())
            .then(res => {
                dispatch(setMessage({
                    msg: "Maktab muvaffaqiyatli o'zgartirildi",
                    type: "success",
                    active: true
                }))
                dispatch(fetchSchoolInfo(id))
                setActive(false)
            })
    }







    return (
        <div className={cls.register}>
            <h1>Maktab malumotlarini o'zgartirish</h1>
            <div className={cls.wrapper}>
                <Select
                    value={region}
                    onChangeOption={onChangeRegion}
                    options={regions}
                    title={"Viloyat"}
                />
                <Select
                    value={district}
                    onChangeOption={onChangeDistrict}
                    options={districts}
                    title={"Tuman"}
                />
                <Select
                    value={school}
                    onChangeOption={onChangeSchool}
                    options={schools}
                    keyValue={"number"}
                    title={"Maktab"}
                />
                <Input
                    title={"Maktab tel raqami"}
                    name={"number"}
                    type={"text"}
                    value={phone}
                    onChange={setPhone}
                />
            </div>
            <Button onClickBtn={onSubmit} type={"submit"}>O'zgartirish</Button>
        </div>
    )
}




export default PlatformSchoolProfile;