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
    },{
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
    }
]

const shifts = [
    {
        id: 1,
        name: "Hamma vaqt"
    }, {
        id: 2,
        name: "1-smen"
    }, {
        id: 3,
        name: "2-smen"
    },
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
    }
]

const Register = () => {

    const {request} = useHttp()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {register, handleSubmit} = useForm()
    const {data} = useSelector(state => state.register)
    const {location} = useSelector(state => state.me)
    const [subjects, setSubjects] = useState([])
    const [locations, setLocations] = useState([])
    const [languages, setLanguages] = useState([])
    const [jobs, setJobs] = useState([])
    const [selectedSubjects, setSelectedSubjects] = useState([])
    const [selectedLocation, setSelectedLocation] = useState(location)
    const [selectedJob, setSelectedJob] = useState(null)
    const [studyTime, setStudyTime] = useState(null)
    const [studyLang, setStudyLang] = useState(null)
    const [type, setType] = useState("student")
    /// check pass
    const [isCheckLen, setIsCheckLen] = useState(false)
    const [isCheckPass, setIsCheckPass] = useState(false)
    /// save pass
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

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

    const registerSelectList = useMemo(() =>  [
        {
            name: "loc",
            label: "O'quv markazi joylashuvi",
            opts: locations,
            onFunc: (value) => setSelectedLocation(value),
            defValue: location
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
            onFunc: (value) => setSelectedJob(value)
        }
    ], [locations, jobs, shifts, languages, subjects])

    const onSubmit = (data) => {
        const res = {
            ...data,
            password,
            password_confirm: confirmPassword,
            shift: studyTime,
            language: +studyLang,
            job: +selectedJob,
            location: +selectedLocation,
            selectedSubjects: selectedSubjects
        }
        const route = type === "employer" ? "register_staff" : type === "student" ? "register" : "register_teacher"
        request(`${BackUrl}${route}`, "POST", JSON.stringify(res), headers())
            .then(res => {
                dispatch(setMessage({
                    msg: res.message,
                    type: "success",
                    active: true
                }))
                navigate("../home")
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
                    defaultValue={types[0]}
                />
                <h1>Registratsiya</h1>
                <form
                    className={cls.form}
                    onSubmit={handleSubmit(onSubmit)}
                >
                    {
                        registerInputList.map(item => {
                            if (type !== "student" && item.name === "phoneParent") return null
                            if (item.name === "password") {
                                return (
                                    <div className={cls.form__inner}>
                                        <Input
                                            value={12345678}
                                            title={item.label}
                                            type={"password"}
                                            onChange={onCheckLength}
                                        />
                                        {
                                            isCheckLen ? <p className={cls.error}>Parolingiz 8 ta dan kam bo'lmasligi
                                                kerak</p> : null
                                        }
                                    </div>
                                )
                            }
                            if (item.name === "password_confirm") {
                                return (
                                    <div className={cls.form__inner}>
                                        <Input
                                            value={12345678}
                                            title={item.label}
                                            type={"password"}
                                            onChange={onCheckPasswords}
                                        />
                                        {
                                            isCheckPass ? <p className={cls.error}>Parol har xil</p> : null
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
                        {...register("comment")}
                        placeholder={"Qo'shimcha ma'lumot (shart emas)"}
                        cols="30"
                        rows="10"
                    />
                    {
                        registerSelectList.map(item => {
                            if (item.name === "loc") {
                                return (
                                    <Select
                                        title={item.label}
                                        options={item.opts}
                                        onChangeOption={item.onFunc}
                                        defaultValue={item.defValue}
                                    />
                                )
                            }
                            if (type !== "student" && item.name === "shift") return null
                            if (type !== "employer" && item.name === "job") return null
                            if (type === "employer" && item.name === "subs") return null
                            if (item.name === "subs") {
                                return (
                                    <>
                                        <Select
                                            title={item.label}
                                            options={item.opts}
                                            onChangeOption={item.onFunc}
                                        />
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
                                <Select
                                    title={item.label}
                                    options={item.opts}
                                    onChangeOption={item.onFunc}
                                />
                            )
                        })
                    }
                    <Button disabled={isCheckPass || isCheckLen} type={'submit'}>Yakunlash</Button>
                </form>
            </div>
        </div>
    );
};

export default Register;