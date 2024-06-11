import React, {useState, useEffect} from 'react';
import {useForm} from "react-hook-form";
import classNames from "classnames";
import {useDispatch, useSelector} from "react-redux";

import InputForm from "components/platform/platformUI/inputForm";
import Button from "components/platform/platformUI/button";
import Select from "components/platform/platformUI/select";
import {fetchData} from "slices/registerSlice";

import cls from "./style.module.sass";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";
import {setMessage} from "slices/messageSlice";

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
        name: "password",
        label: "Parol",
        type: "password"
    }, {
        name: "password_confirm",
        label: "Parolni tasdiqlang",
        type: "password"
    }
]

const shifts = [
    {
        name: "1-smen"
    }, {
        name: "2-smen"
    }
]

const types = [
    {
        id: "teacher",
        name: "O'qituvchi"
    }, {
        id: "employer",
        name: "Ishchi"
    }, {
        id: "student",
        name: "Student"
    }
]

const Register = () => {

    const {request} = useHttp()
    const dispatch = useDispatch()
    const {register, handleSubmit} = useForm()
    const {data} = useSelector(state => state.register)
    const [selectedSubjects, setSelectedSubjects] = useState([])
    const [selectedLocation, setSelectedLocation] = useState([])
    const [selectedJob, setSelectedJob] = useState(null)
    const [studyTime, setStudyTime] = useState(null)
    const [studyLang, setStudyLang] = useState(null)
    const [subjects, setSubjects] = useState([])
    const [locations, setLocations] = useState([])
    const [languages, setLanguages] = useState([])
    const [jobs, setJobs] = useState([])
    const [type, setType] = useState("")
    /// check pass
    const [isCheckLen, setIsCheckLen] = useState(false)
    const [isCheckPass, setIsCheckPass] = useState(false)
    /// save pass
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    /// change pass type
    const [isPass, setIsPass] = useState(true)
    const [isPassCon, setIsPassCon] = useState(true)

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

    const registerSelectList = [
        {
            name: "loc",
            label: "O'quv markazi joylashuvi",
            opts: locations,
            onFunc: (value) => setSelectedLocation(value)
        }, {
            name: "subs",
            label: "Fan",
            opts: subjects,
            onFunc: (value) => onChangeSub(value)
        }, {
            name: "lang",
            label: "Ta'lim tili",
            opts: languages,
            onFunc: (value) => setStudyLang(value)
        }, {
            name: "shift",
            label: "Ta'lim vaqti",
            opts: shifts,
            onFunc: (value) => setStudyTime(value)
        }, {
            name: "job",
            label: "Ish faoliyati",
            opts: jobs,
            onFunc: (value) => setJobs(value)
        }
    ]

    const onSubmit = (data) => {
        const res = {
            ...data,
            shift: studyTime,
            language: +studyLang,
            job: +selectedJob,
            location: +selectedLocation,
            selectedSubjects: selectedSubjects.map(item => item.id)
        }
        console.log(res, "res")
        const route = type === "employer" ? "register_staff" : type === "student" ? "register" : "register_teacher"
        request(`${BackUrl}${route}`, "POST", JSON.stringify(res), headers())
            .then(res => {
                console.log(res)
                dispatch(setMessage({
                    msg: res.msg,
                    type: "success",
                    active: true
                }))
            })
            .catch(err => console.log(err))
        setStudyTime(null)
        setStudyLang(null)
        setSelectedJob([])
        setSelectedLocation([])
        setSelectedSubjects([])
    }

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
        setSelectedSubjects(selectedSubjects.filter(item => item.id !== +id))
        console.log(selectedSubjects.filter(item => item.id !== +id))
    }

    const onCheckLength = (value) => {
        setIsCheckLen(value.length < 8)
        setIsCheckPass(confirmPassword.length !== 0 ? value !== confirmPassword : false)
        setPassword(value)
    }

    const onCheckPasswords = (value) => {
        setIsCheckPass(value !== password)
        setConfirmPassword(value)
    }

    return (
        <div className={cls.main}>
            <div className={cls.main__container}>
                <Select
                    title={"Ish faoliyat"}
                    options={types}
                    onChangeOption={setType}
                />
                <h1>Registratsiya</h1>
                <form
                    className={cls.form}
                    onSubmit={handleSubmit(onSubmit)}
                >
                    {
                        registerInputList.map(item => {
                            if (item.type === "password") {
                                const check = (
                                    (isPass && item.name === "password")
                                    ||
                                    (isPassCon && item.name === "password_confirm")
                                )
                                return (
                                    <div className={cls.form__inner}>
                                        <InputForm
                                            onChange={
                                                item.name === "password"
                                                    ?
                                                    onCheckLength
                                                    :
                                                    onCheckPasswords
                                            }
                                            register={register}
                                            name={item.name}
                                            title={item.label}
                                            type={
                                                check ? item.type : "text"
                                            }
                                            required
                                        />
                                        {
                                            check
                                                ?
                                                <i
                                                    className={classNames("fas fa-eye-slash", cls.icon)}
                                                    onClick={() => {
                                                        item.name === "password" ? setIsPass(false) : setIsPassCon(false)
                                                    }}
                                                />
                                                :
                                                <i
                                                    className={classNames("fas fa-eye", cls.icon)}
                                                    onClick={() => {
                                                        item.name === "password" ? setIsPass(true) : setIsPassCon(true)
                                                    }}
                                                />
                                        }
                                        {
                                            (
                                                (isCheckLen && item.name === "password")
                                                ||
                                                (isCheckPass && item.name === "password_confirm")
                                            )
                                                ?
                                                <p className={cls.error}>
                                                    {
                                                        item.name === "password"
                                                            ?
                                                            "Parolingiz 8 ta dan kam bo'lmasligi kerak"
                                                            :
                                                            "Parol har xil"
                                                    }
                                                </p> : null
                                        }
                                    </div>
                                )
                            }
                            return (
                                <InputForm
                                    register={register}
                                    name={item.name}
                                    title={item.label}
                                    type={item.type}
                                    required
                                />
                            )
                        })
                    }
                    <textarea
                        {...register("info")}
                        placeholder={"Qo'shimcha ma'lumot (shart emas)"}
                        cols="30"
                        rows="10"
                    />
                    {
                        registerSelectList.map(item => {
                            const render = <Select
                                title={item.label}
                                options={item.opts}
                                onChangeOption={item.onFunc}
                            />
                            if (type !== "student" && item.name === "shift") return null
                            if (type !== "employer" && item.name === "job") return null
                            if (type === "employer" && item.name === "subs") return null
                            if (item.name === "subs") {
                                return (
                                    <>
                                        {render}
                                        {
                                            selectedSubjects.length > 0
                                                ?
                                                <div className={cls.place}>
                                                    {
                                                        selectedSubjects.map((item, i) => {
                                                            return <p
                                                                key={i}
                                                                className={cls.place__inner}
                                                            >
                                                                {item.name}
                                                                <i
                                                                    className={classNames("fas fa-times", cls.innerIcon)}
                                                                    onClick={() => onDeleteSub(item.id)}
                                                                />
                                                            </p>
                                                        })
                                                    }
                                                </div>
                                                :
                                                null
                                        }
                                    </>
                                )
                            }
                            return (
                                render
                            )
                        })
                    }
                    <Button type={'submit'}>Yakunlash</Button>
                </form>
            </div>
        </div>
    );
};

export default Register;