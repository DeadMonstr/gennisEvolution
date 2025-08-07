import React, {useEffect, useMemo, useState} from 'react';

import cls from "./platformSchoolStudentsRegister.module.sass"
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
import {useNavigate, useParams} from "react-router-dom";
import Pagination from "components/platform/platformUI/pagination";

const PlatformSchoolStudentsRegister = () => {

    const {id} = useParams()

    const [active, setActive] = useState(false)
    const [students,setStudents] = useState([])
    const [search, setSearch] = useState("")

    let PageSize = useMemo(() => 50, [])
    const [currentPage, setCurrentPage] = useState(1);

    const searchedUsers = useMemo(() => {
        const filteredHeroes = students.slice()
        setCurrentPage(1)
        return filteredHeroes.filter(item =>
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.surname.toLowerCase().includes(search.toLowerCase())
        )
    }, [students, search])

    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return searchedUsers.slice(firstPageIndex, lastPageIndex);
    }, [PageSize, currentPage, searchedUsers]);

    const onActiveAdd = () => {
        setActive(true)
    }

    const {request} = useHttp()

    useEffect(() => {
        request(`${BackUrl}school/school_students/${id}`,"GET",null,headers())
            .then(data => {
                setStudents(data.school_users)
            })
    },[id])


    const navigate = useNavigate()
    const onClickRegister = (item) => {
        localStorage.setItem("schoolStudent", JSON.stringify({id: item.id, name: item.name, surname: item.surname}))
        navigate("../newRegister")
    }


    return (
        <div className={cls.students}>
            <h1>O'quvchilar ro'yxati</h1>

            <div className={cls.header}>
                <Search search={search} setSearch={setSearch}/>

                {/*<Button onClickBtn={onActiveAdd}>Qo'shmoq</Button>*/}
            </div>


            <div className={cls.wrapper}>

                <Table>
                    <thead>
                    <tr>
                        <th>№</th>
                        <th>Ism</th>
                        <th>Familya</th>
                        <th>O'qituvchi</th>
                        <th>Maktab</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        currentTableData.map(item => {
                            return (
                                <tr>
                                    <td>{item.id}</td>
                                    <td>{item.name}</td>
                                    <td>{item.surname}</td>
                                    <td>{item.teacher.name} {item.teacher.surname}</td>
                                    <td>{item.school.number}</td>
                                    <td className={cls.change}>
                                        <i className="fas fa-pen" onClick={() => onClickRegister(item)}></i>
                                    </td>

                                </tr>
                            )
                        })
                    }

                    </tbody>
                </Table>
                <Pagination
                    className="pagination-bar"
                    currentPage={currentPage}
                    totalCount={students.length}
                    pageSize={PageSize}
                    onPageChange={page => {
                        setCurrentPage(page)
                    }}
                />
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

export default PlatformSchoolStudentsRegister;