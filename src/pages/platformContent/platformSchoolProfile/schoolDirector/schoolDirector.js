import React, {useEffect, useMemo, useState} from 'react';

import cls from "./schoolDirector.module.sass"
import Table from "components/platform/platformUI/table";
import {useDispatch, useSelector} from "react-redux";
import Pagination from "components/platform/platformUI/pagination";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";
import Input from "components/platform/platformUI/input";
import Button from "components/platform/platformUI/button";
import {useParams} from "react-router-dom";
import Modal from "components/platform/platformUI/modal";
import Confirm from "components/platform/platformModals/confirm/confirm";
import {addSchoolDirector, changeSchoolDirector, deleteSchoolDirector} from "slices/schoolProfileSlice";
import {setMessage} from "slices/messageSlice";


export const SchoolDirector = () => {

    const {id} = useParams()

    const {director} = useSelector(state => state.schoolProfile)


    let PageSize = useMemo(() => 50, [])
    const [currentPage, setCurrentPage] = useState(1);
    const [activeAdd, setActiveAdd] = useState(false)
    const [activeChange, setActiveChange] = useState(false)
    const [changingData, setChangingData] = useState({})
    const [activeDelete, setActiveDelete] = useState(false)

    const dispatch= useDispatch()




    const onClickAdd = () => {
        setActiveAdd(true)
    }

    const onClickChange = (data) => {
        setActiveChange(true)
        setChangingData(data)
    }

    const onClickDelete = (id) => {
        setActiveDelete(true)
        setChangingData({id})
    }


    const {request} = useHttp()

    const onDelete = (data) => {
        if (data === "yes") {
            request(`${BackUrl}school/crud_school_user/${changingData.id}`,"DELETE", null, headers())
                .then(() => {
                    dispatch(deleteSchoolDirector())
                })
        }

        setActiveDelete(false)

    }


    return (
        <div className={cls.wrapper}>
            <div className={cls.header}>

                <div className={cls.add} onClick={onClickAdd}>
                    <i className="fas fa-plus"></i>
                </div>
            </div>
            <div className={cls.container}>
                <Table>
                    <thead>
                        <tr>
                            <th>№</th>
                            <th>Username</th>
                            <th>Ism</th>
                            <th>Familya</th>
                            <th>Tel</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>

                    {
                        !!Object.keys(director).length && <tr>
                            <td>{1}</td>
                            <td>{director.username}</td>
                            <td>{director.name}</td>
                            <td>{director.surname}</td>
                            <td>{director.phone}</td>
                            {/*<td>{item.share}</td>*/}
                            <td className={cls.change}>
                                <i className="fas fa-pen" onClick={() => onClickChange(director)}></i>
                            </td>
                            <td className={cls.delete}>
                                <i className="fas fa-trash" onClick={() => onClickDelete(director.id)}></i>
                            </td>
                        </tr>

                    }

                    </tbody>

                </Table>


                <Modal activeModal={activeAdd} setActiveModal={setActiveAdd}>
                    <CrudDirector setActiveModal={setActiveAdd}/>
                </Modal>

                <Modal activeModal={activeChange} setActiveModal={setActiveChange}>
                    <CrudDirector info={changingData} setActiveModal={setActiveChange}/>
                </Modal>

                <Modal activeModal={activeDelete} setActiveModal={setActiveDelete}>
                    <Confirm getConfirm={onDelete} text={"Directorni o'chirishni hohlaysizmi"} setActive={setActiveDelete}/>
                </Modal>


            </div>
        </div>
    );
};

const CrudDirector = ({info,setActiveModal}) => {

    const {id} = useParams()

    const [name,setName] = useState("")
    const [surname,setSurname] = useState("")
    const [phone,setPhone] = useState("")
    const [username,setUsername] = useState("")
    // const [share,setShare] = useState("")
    const [loading,setLoading] = useState(false)
    const [error,setError] = useState("")

    const [isChange,setIsChange] = useState(false)



    useEffect(() => {
        if (info) {
            setName(info.name)
            setSurname(info.surname)
            setPhone(info.phone)
            // setShare(info.share)
            setIsChange(true)
            setUsername(info.username)
        }
    },[info])


    const {request} = useHttp()


    const dispatch = useDispatch()


    const onSubmit = () => {

        if (!username) return;

        const data = {
            name,
            surname,
            phone,
            school_id: id,
            type_user: "director",
            username
        }


        if (isChange) {
            request(`${BackUrl}school/crud_school_user/${info.id}`,"PUT",JSON.stringify(data),headers())
                .then(res => {
                    dispatch(setMessage({
                        msg: "Director muvaffaqiyatli o'zgartirildi",
                        type: "success",
                        active: true
                    }))
                    dispatch(changeSchoolDirector(res.user))
                })
        } else {
            request(`${BackUrl}school/crud_school_user/`,"POST",JSON.stringify(data),headers())
                .then(res => {
                    dispatch(setMessage({
                        msg: "Director muvaffaqiyatli yaratildi",
                        type: "success",
                        active: true
                    }))
                    dispatch(addSchoolDirector(res.user))
                })
        }

        setActiveModal(false)

    }

    useEffect(() => {
        if (!username) return;

        if (username !== info?.username) {
            setLoading(true)
            request(`${BackUrl}checks/check_username`,"POST", JSON.stringify(username))
                .then(res => {
                    setLoading(false)
                    if (res.found) {
                        setError("Username band")
                    } else {
                        setError("")
                    }
                })
        }
    },[username,info])

    return (
        <div className={cls.addModal}>
            <h1>
                {
                    isChange ?
                        "Director malumotlarini o'zgartirish"
                        :
                        "Director qo'shish"
                }
            </h1>
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
                    value={name}
                    title={"Ism"}
                    name={"name"}
                    type={"text"}
                    onChange={setName}
                />
                <Input
                    value={surname}
                    title={"Familya"}
                    name={"surname"}
                    type={"text"}
                    onChange={setSurname}
                />
                <Input
                    value={phone}
                    title={"Tel"}
                    name={"phone"}
                    type={"text"}
                    onChange={setPhone}
                />
                {/*<Input*/}
                {/*    title={"Ulushi"}*/}
                {/*    name={"share"}*/}
                {/*    type={"number"}*/}
                {/*    onChange={setShare}*/}
                {/*/>*/}
            </div>
            <Button disabled={error} onClickBtn={onSubmit} type={"submit"}>Qo'shish</Button>
        </div>
    )
}


