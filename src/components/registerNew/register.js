import React, {useState, useEffect} from 'react';
import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";

import InputForm from "components/platform/platformUI/inputForm";
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
    const {locations} = useSelector(state => state.locations)
    const {data} = useSelector(state => state.register)
    const [selectedSubjects, setSelectedSubjects] = useState([])
    const [subjects, setSubjects] = useState([])

    useEffect(() => {
        dispatch(fetchData())
    }, [])

    useEffect(()=>{
        if (data) {
            setSubjects(data.subject)
            // setLocations(data.location)
            // setLanguages(data.language)
        }
    },[data])

    console.log(locations)

    const onSubmit = (data) => {
        console.log(data, "data")
    }

    const onChangeLoc = (value) => {
        console.log(value, "loc")
    }

    // const onChangeSub = (id) => {
    //     console.log(value, "sub")
    //     subjects
    //     const filteredSubjects = subjects.filter(item => item.name === value)
    //     setSubjects(subjects => {
    //         return subjects.map(item => {
    //             if (item.name === subjectName) {
    //                 return {...item,disabled: true}
    //             }
    //             return item
    //         })
    //     })
    //     setSelectedSubjects(arr => [...arr, value])
    // }

    return (
        <div className={cls.main}>
            <div className={cls.main__container}>
                <h1>Registratsiya</h1>
                <form
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
                        required
                    />
                    <InputForm
                        register={register}
                        name={"phone"}
                        title={"Telefon raqami"}
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
                        onChangeOption={onChangeLoc}
                    />
                    {/*<Select*/}
                    {/*    title={"Fan"}*/}
                    {/*    options={subjects}*/}
                    {/*    onChangeOption={onChangeSub}*/}
                    {/*/>*/}

                    {
                        selectedSubjects.length > 0
                            ?
                            <div className={cls.place}>
                                {
                                    selectedSubjects.map(item => {
                                        return <p className={cls.place__inner}>{item}</p>
                                    })
                                }
                            </div>
                            :
                            null
                    }
                </form>
            </div>
        </div>
    );
};

export default Register;