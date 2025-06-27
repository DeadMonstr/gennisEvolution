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

    const {request} = useHttp()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {
        register,
        formState: {errors},
        handleSubmit,
        clearErrors,
        setError,
        setValue
    } = useForm({
        mode: "onBlur"
    })

    const {data} = useSelector(state => state.register)
    const {location} = useSelector(state => state.me)
    const [subjects, setSubjects] = useState([])
    const [locations, setLocations] = useState([])
    const [languages, setLanguages] = useState([])
    const [jobs, setJobs] = useState([])
    const [selectedSubjects, setSelectedSubjects] = useState([])
    const [selectedSex, setSelectedSex] = useState("")
    const [addresses, setAddresses] = useState("")
    const [selectedLocation, setSelectedLocation] = useState(location)
    const [selectedJob, setSelectedJob] = useState(null)
    const [studyTime, setStudyTime] = useState(1)
    const [studyLang, setStudyLang] = useState(1)
    const [type, setType] = useState("student")
    /// check pass
    const [isCheckLen, setIsCheckLen] = useState(false)
    const [isCheckPass, setIsCheckPass] = useState(false)
    /// save pass
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const [activeError, setActiveError] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("schoolStudent"))

        if (data && Object.keys(data).length > 0) {

            setValue("name", data.name)
            setValue("surname", data.surname)

        }


    }, [])

    console.log(jobs , "kob")

    const registerSelectList = useMemo(() => [
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
            onFunc: (value) => setStudyLang(value),
            defValue: 1
        }, {
            name: "shift",
            label: "Ta'lim vaqti",
            opts: shifts,
            onFunc: (value) => setStudyTime(value),
            defValue: 1
        },
        {
            name: "job",
            label: "Ish faoliyati",
            opts: jobs,
            onFunc: (value) => setSelectedJob(value),
            keyValue: "name"
        },
        {
            name: "sex",
            label: "Jinsi",
            opts: genders,
            onFunc: (value) => setSelectedSex(value)
        }
    ], [locations, jobs, shifts, languages, subjects, selectedSex])

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



    const onSubmit = (data) => {
        setLoading(true)

        const newData = JSON.parse(localStorage.getItem("schoolStudent"))
        let res
        if (type === "parent") {
            res = {
                ...data,
                address: addresses,
                sex: selectedSex,
                location_id: +selectedLocation
            }
        } else {

            res = {
                ...data,
                password,
                password_confirm: confirmPassword,
                shift: studyTime,
                language: +studyLang,
                job: selectedJob,
                location: +selectedLocation,
                selectedSubjects: selectedSubjects,
                school_user_id: newData?.id,
            }
        }
        console.log(res)
        const route = type === "employer" ? "register_staff" : type === "student" ? "register" : type === "parent" ? "parent/crud/" : "register_teacher"
        request(`${BackUrl}${route}`, "POST", JSON.stringify(res), headers())
            .then(res => {
                setLoading(false)
                if (data) {
                    localStorage.removeItem("schoolStudent")
                }
                if (type === "parent") {
                    dispatch(setMessage({
                        msg: "Muvofaqqiyatli qo'shildi",
                        type: "success",
                        active: true
                    }))
                } else {
                    dispatch(setMessage({
                        msg: res.msg,
                        type: "success",
                        active: true
                    }))
                }
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
    const checkUsername = (username) => {
        setLoading(true)
        request(`${BackUrl}check_username`, "POST", JSON.stringify(username))
            .then(res => {
                setLoading(false)
                if (res.found) {
                    setError('username', {
                        type: "manual",
                        message: "username band"

                    }, {shouldFocus: true})
                    setActiveError(true)
                    setErrorMessage("Username band")
                } else {
                    setActiveError(false)
                }
            })
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

    const onCheckLength = (value) => {
        setIsCheckLen(value?.length < 8)
        setIsCheckPass(confirmPassword?.length !== 0 ? value !== confirmPassword : false)
        setPassword(value)
    }


    useEffect(() => {
        setIsCheckPass(confirmPassword !== password)

    }, [confirmPassword, password])


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
                    shifts={shifts}
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

                <form
                    id="form"
                    className={cls.form}
                    onSubmit={handleSubmit(onSubmit)}
                >
                    {
                        registerInputList.map(item => {
                            if (type !== "student" && item.name === "phoneParent") return null
                            if (item.name === "username") {
                                return (
                                    <>
                                        <InputForm
                                            register={register}
                                            name={item.name}
                                            title={item.label}
                                            type={item.type}
                                            onBlur={checkUsername}
                                            required
                                        />
                                        {
                                            // activeError ? <span className={cls.form__error}>
                                            //     Username band
                                            // </span> : null
                                            errors?.username &&
                                            <span className={cls.form__error}>
                                                {errors?.username?.message}
                                            </span>
                                        }
                                    </>
                                )
                            }
                            if (item.name === "password") {
                                return (
                                    <div className={cls.form__inner}>
                                        <Input
                                            value={"12345678"}
                                            title={item.label}
                                            type={"password"}
                                            onChange={onCheckLength}
                                            required
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
                                            value={"12345678"}
                                            title={item.label}
                                            type={"password"}
                                            onChange={setConfirmPassword}
                                            required
                                        />
                                        {
                                            isCheckPass ? <p className={cls.error}>Parol har xil</p> : null
                                        }
                                    </div>
                                )
                            }
                            if (item.name === "address") {
                                return (
                                    <Input value={""}
                                           title={item.label}
                                           type={item.type}
                                           onChange={setAddresses}
                                           required
                                    />
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
                            if (type !== "student" && item.name === "shift") return null
                            if (type !== "employer" && item.name === "job") return null
                            if (type === "employer" && item.name === "subs") return null
                            if (type === "parent" && item.name === "shift") return null
                            if (type === "parent" && item.name === "subs") return null
                            if (type !== "parent" && item.name === "address") return null
                            if (type === "parent" && item.name === "lang") return null
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
                            if (item.name === "loc" || item.name === "lang" || item.name === "shift" || item.name === "sex") {
                                return (
                                    <Select
                                        title={item.label}
                                        options={item.opts}
                                        onChangeOption={item.onFunc}
                                        defaultValue={item.defValue}
                                    />
                                )
                            }
                            return (
                                <Select
                                    keyValue={item.keyValue}
                                    title={item.label}
                                    options={item.opts}
                                    onChangeOption={item.onFunc}
                                />
                            )
                        })
                    }
                    {
                        loading ? <DefaultLoaderSmall/> :
                            <Button
                                formId={"form"}
                                // disabled={
                                //     isCheckPass ||
                                //     isCheckLen ||
                                //     activeError ||
                                //     (type !== "employer" ? selectedSubjects.length === 0 : false) ||
                                //     (type === "employer" && !selectedJob) ||
                                //     (type !== "parent" ? selectedSubjects.length === 0 : false)
                                // }
                                type={'submit'}
                            >
                                Yakunlash
                            </Button>

                    }
                </form>
                {/*{renderComponent()}*/}
            </div>
        </div>
    );
};

export default Register;














