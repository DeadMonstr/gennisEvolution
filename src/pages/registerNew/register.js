import React, {useState, useEffect, useMemo} from 'react';
import {useForm} from "react-hook-form";
import classNames from "classnames";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

import InputForm from "components/platform/platformUI/inputForm";
import Button from "components/platform/platformUI/button";
import Input from "components/platform/platformUI/input";
import Select from "components/platform/platformUI/select";
import {fetchData} from "slices/registerSlice";
import {setMessage} from "slices/messageSlice";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";

import cls from "./style.module.sass";
import DefaultLoaderSmall from "components/loader/defaultLoader/defaultLoaderSmall";
import {RegisterStudent} from "pages/registerNew/registerStudent/registerStudent";
import {RegisterParent} from "pages/registerNew/registerParent/registerParent";
import {RegisterTeacher} from "pages/registerNew/registerTeacher/registerTeacher";
import {RegisterWorker} from "pages/registerNew/registerWorker/registerWorker";

const registerInputList = [
    {
        name: "username",
        label: "Username",
        type: "text"
    }, {
        name: "name",
        label: "Ism",
        type: "text"
    }, {
        name: "surname",
        label: "Familiya",
        type: "text"
    }, {
        name: "father_name",
        label: "Otasining ismi",
        type: "text"
    }, {
        name: "birth_day",
        label: "Tug'ilgan sana",
        type: "date"
    }, {
        name: "phone",
        label: "Telefon raqami",
        type: "number"
    }, {
        name: "phoneParent",
        label: "Ota-ona telefon raqami",
        type: "number"
    }, {
        name: "password",
        label: "Parol",
        type: "password"
    }, {
        name: "password_confirm",
        label: "Parolni tasdiqlang",
        type: "password"
    },
    {
        name: "address",
        label: "Manzil",
        type: "text"
    }
]

const shifts = [
    {
        name: "Hamma vaqt"
    }, {
        name: "1-smen"
    }, {
        name: "2-smen"
    },
]
const genders = [
    {
        name: "Erkak",
    },
    {
        name: "Ayol"
    }
]

const types = [
    {
        id: "student",
        name: "Student"
    }, {
        id: "teacher",
        name: "O'qituvchi"
    }, {
        id: "employer",
        name: "Ishchi"
    },
    {
        id: "parent",
        name: "Ota/ona"
    }
]

const Register = () => {
    const dispatch = useDispatch()
    const {data} = useSelector(state => state.register)
    const [subjects, setSubjects] = useState([])
    const [locations, setLocations] = useState([])
    const [languages, setLanguages] = useState([])
    const [jobs, setJobs] = useState([])
    const [selectedSubjects, setSelectedSubjects] = useState([])
    const [type, setType] = useState("student")
    useEffect(() => {
        dispatch(fetchData())
    }, [])
    useEffect(() => {
        if (data) {
            setSubjects(data.subject)
            setLocations(data.location)
            setLanguages(data.language)
            setJobs(data.jobs)
        }
    }, [data])
    const onChangeSub = (id) => {
        const filteredSubjects = subjects.filter(item => item.id === +id)
        setSubjects(subjects => {
            return subjects.map(item => {
                if (item.id === +id) {
                    return {...item, disabled: true}
                }
                return item
            })
        })
        setSelectedSubjects(arr => [...arr, ...filteredSubjects])
    }


    const onDeleteSub = (id) => {
        setSubjects(subjects => {
            return subjects.map(item => {
                if (item.id === +id) {
                    return {...item, disabled: false}
                }
                return item
            })
        })
        setSelectedSubjects(selectedSubjects?.filter(item => item.id !== +id))
    }



    const renderComponent = () => {
        switch (type) {
            case "student":
                return <RegisterStudent
                    language={languages}
                    deleteSub={onDeleteSub}
                    onChangeSub={onChangeSub}
                    selectedSubjects={selectedSubjects}
                    setSelectedSubjects={setSelectedSubjects}
                    locations={locations} subjects={subjects}
                    languages={languages}
                    shifts={shifts}
                    genders={genders}
                    setSubjects={setSubjects}
                />
            case "parent":
                return <RegisterParent
                    locations={locations}
                    genders={genders}

                />
            case "employer":
                return <RegisterWorker
                    language={languages}
                    locations={locations}
                    jobs={jobs}
                    languages={languages}
                    shifts={shifts}
                    genders={genders}
                />
            case "teacher":
                return <RegisterTeacher
                    language={languages}
                    deleteSub={onDeleteSub}
                    onChangeSub={onChangeSub}
                    selectedSubjects={selectedSubjects}
                    setSelectedSubjects={setSelectedSubjects}
                    locations={locations} subjects={subjects}
                    languages={languages}
                    genders={genders}
                    setSubjects={setSubjects}
                />
        }
    }

    return (
        <div className={cls.main}>

            <div className={cls.main__container}>
                <Select
                    title={"Ish faoliyat"}
                    options={types}
                    onChangeOption={setType}
                    defaultValue={types[0]}
                />
                <h1>Registratsiya</h1>
                {renderComponent()}
            </div>
        </div>
    );
};

export default Register;














