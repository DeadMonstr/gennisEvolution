import React, {useState, useEffect} from 'react';
import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";

import InputForm from "components/platform/platformUI/inputForm";
import Button from "components/platform/platformUI/button";
import Select from "components/platform/platformUI/select";
import {fetchData} from "slices/registerSlice";

import cls from "./style.module.sass";

const registerList = [
    {
        name: "username",
        label: "Username"
    },
    {
        name: "name",
        label: "Ism"
    },
    {
        name: "surname",
        label: "Familiya"
    },
    {
        name: "name",
        label: "Otasining ismi"
    },
    {
        name: "birth_day",
        label: "Tug'ilgan sana"
    },
    {
        name: "phone",
        label: "Telefon raqami"
    }
]

const Register = () => {

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

    useEffect(() => {
        dispatch(fetchData())
    }, [])

    useEffect(()=>{
        if (data) {
            setSubjects(data.subject)
            setLocations(data.location)
            setLanguages(data.language)
            setJobs(data.jobs)
        }
    },[data])

    const onSubmit = (data) => {
        const res = {
            ...data,
            studyTime,
            studyLang,
            selectedJob,
            selectedSubjects: selectedSubjects.map(item => item.id)
        }
        console.log(res, "res")
        setStudyTime(null)
        setStudyLang(null)
        setSelectedJob([])
        setSelectedLocation([])
        setSelectedSubjects([])
    }

    // console.log(selectedLocation, "loc")
    // console.log(selectedJob, "job")

    const onChangeSub = (id) => {
        const filteredSubjects = subjects.filter(item => item.id === +id)
        setSubjects(subjects => {
            return subjects.map(item => {
                if (item.id === +id) {
                    return {...item,disabled: true}
                }
                return item
            })
        })
        setSelectedSubjects(arr => [...arr, ...filteredSubjects])
    }

    return (
        <div className={cls.main}>
            <div className={cls.main__container}>
                <Select
                    title={"Ish faoliyat"}
                    options={jobs}
                    onChangeOption={setSelectedJob}
                />
                <h1>Registratsiya</h1>
                <form
                    className={cls.form}
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <InputForm
                        register={register}
                        name={"username"}
                        title={"Username"}
                        required
                    />
                    <InputForm
                        register={register}
                        name={"name"}
                        title={"Ism"}
                        required
                    />
                    <InputForm
                        register={register}
                        name={"surname"}
                        title={"Familiya"}
                        required
                    />
                    <InputForm
                        register={register}
                        name={"name"}
                        title={"Otasining ismi"}
                        required
                    />
                    <InputForm
                        register={register}
                        name={"birth_day"}
                        title={"Tug'ilgan sana"}
                        type={"date"}
                        required
                    />
                    <InputForm
                        register={register}
                        name={"phone"}
                        title={"Telefon raqami"}
                        type={"number"}
                        required
                    />
                    <InputForm
                        register={register}
                        name={"password"}
                        title={"Parol"}
                        required
                    />
                    <InputForm
                        register={register}
                        name={"password_confrim"}
                        title={"Parolni tasdiqlang"}
                        required
                    />
                    <textarea
                        {...register("info")}
                        placeholder={"Qo'shimcha ma'lumot (shart emas)"}
                        cols="30"
                        rows="10"
                    />
                    <Select
                        title={"O'quv markazi joylashuvi"}
                        options={locations}
                        onChangeOption={setSelectedLocation}
                    />
                    <Select
                        title={"Fan"}
                        options={subjects}
                        onChangeOption={onChangeSub}
                    />
                    {
                        selectedSubjects.length > 0
                            ?
                            <div className={cls.place}>
                                {
                                    selectedSubjects.map((item, i) => {
                                        return <p key={i} className={cls.place__inner}>{item.name}</p>
                                    })
                                }
                            </div>
                            :
                            null
                    }
                    <Select
                        title={"Ta'lim tili"}
                        options={languages}
                        onChangeOption={setStudyLang}
                    />
                    <Select
                        title={"Ta'lim vaqti"}
                        options={subjects}
                        onChangeOption={setStudyTime}
                    />
                    <Button type={'submit'}>Yakunlash</Button>
                </form>
            </div>
        </div>
    );
};

export default Register;