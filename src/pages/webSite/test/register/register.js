import React, {useEffect, useState} from "react";


// import Input from "src/components/platform/platformUI/input";
import cls from "./register.module.sass"
import Form from "components/platform/platformUI/form/Form";
import {useForm} from "react-hook-form";

// import {BackUrl, headers} from "src/constants/global";
import {useDispatch, useSelector} from "react-redux";

import {getData, getDataMk, getDataUniversity, getDefanations} from "./selector";
import {fetchData, fetchDataMk, fetchDefenations, fetchGetHomeInfo} from "./model/thunk/thunk";

import {useHttp} from "../../../../hooks/http.hook";

import {BackUrl, headers} from "../../../../constants/global";
import {InputTest} from "../../../../components/platform/platformUI/inputTest/inputTest";
import {Select} from "../select";
import {setMessage} from "../../../../slices/messageSlice";
import Message from "../../../../components/platform/platformMessage";
import Logo from "../../../../assets/logo/logo.jpg"
import home from "../../../../components/webSite/home";
const lan = [
    {name: "UZ"},
    {name: "RU"}
]
export const Register = () => {

    const [activeSwitch, setActiveSwitch] = useState(null)

    const {register, handleSubmit, setValue, reset} = useForm()
    const {request} = useHttp()
    const data = useSelector(getData)
    const dataMk = useSelector(getDataMk)
    const homeInfo = useSelector(getDataUniversity)

    const defenations = useSelector(getDefanations)

    // const navigate = useNavigate()
    const dispatch = useDispatch()
    const [univer, setUniver] = useState(null)
    const [school, setSchool] = useState(null)
    const [fakultet, setFakultet] = useState(null)
    const [fakultets, setFakultets] = useState(null)
    const [loc, setLoc] = useState(null)
    const [lang , setLang] = useState(null)
    const [def , setDef] = useState(null)



    const [studentIdModal, setStudentIdModal] = useState(false)
    const [studentId, setStudentId] = useState(null)


    useEffect(() => {
        dispatch(fetchData())
        dispatch(fetchDataMk())
        dispatch(fetchGetHomeInfo())
        dispatch(fetchDefenations())
    }, [])

    useEffect(() => {

      if (univer){
          request(`${BackUrl}faculties/${univer}`, "GET", null, headers())
              .then(res => {
                  setFakultet(res)
              })
              .catch(err => {
                  console.log(err)
                  setFakultet(null)
              })
      }

    }, [univer])
    const onClick = (data) => {
        const res = {
            ...data,
            school_id: school,
            university_id: univer,
            faculty_id: fakultets,
            location_id: loc,
            language: lang,
            defenation_id: Number(def )

        }
        request(`${BackUrl}student/students_test`, "POST", JSON.stringify(res), headers())
            .then(res => {
                setValue("name", "")
                setValue("surname", "")
                setValue("phone", "")
                setValue("father_name", "")
                if(res.success) {
                    setStudentIdModal(true)
                }
                setStudentId(res)
                dispatch(setMessage({
                    msg: `${res.success === false ? res.msg : `${res.message} , Student id ${res.unique_id}`}`,
                    type: "success",
                    active: true
                }))
                // navigate("/login")
            })
            .catch(err => {
                console.log(err)

            })
    }


    return (


        <div className={cls.container}>
            <Message/>

            {studentIdModal ?
                <div>
                    <h2 className={cls.h2}>
                        <h1>Hurmatli talaba!</h1>

                        Sizga o‘zingizning maxsus ID raqamingiz berildi. Ushbu ID orqali sizga test blankasi taqdim etiladi. <br/> Test topshirish jarayonida ID raqamingizni aniq va to‘g‘ri kiritishingiz muhim. <br/>

                        Diqqat! Ushbu ID raqamingizni eslab qolishingiz yoki xavfsiz joyga yozib qo‘yishingizni tavsiya qilamiz. <br/>
                        <span>  Sizning ID raqamingiz {studentId.unique_id}</span>


                    </h2>
                </div>
                :

                <div className={cls.box__form}>
                    <Form extraClassnameButton={cls.button} onSubmit={handleSubmit(onClick)}>
                        <InputTest
                            title={"Ism"}
                            register={register}
                            name={"name"}
                            type="text"
                            required/>
                        <InputTest
                            title={"Familiya"}
                            register={register}
                            name={"surname"}
                            type="text"
                            required/>
                        <InputTest
                            title={"Ota-onangizni ismi"}
                            register={register}
                            name={"father_name"}
                            type="text"
                            required/>
                        <InputTest
                            title={"Telefon numer"}
                            register={register}
                            name={"phone"}
                            type="number"
                            required
                        />
                        <Select
                            title={"Tilni tanlang"}
                            options={lan}
                            extraClass={cls.select}
                            onChangeOption={setLang}
                        />
                        <Select
                            title={"Location ni tanlang"}
                            onChangeOption={setLoc}
                            extraClass={cls.select}
                            options={homeInfo}
                        />
                        <Select
                            title={"Yo'nalish ni tanlang"}
                            onChangeOption={setDef}
                            extraClass={cls.select}
                            options={defenations}
                        />
                        <Select
                            title={"Maktabni Tanlang"}
                            onChangeOption={setSchool}
                            extraClass={cls.select}
                            options={dataMk}
                        />
                        {/*<Select*/}
                        {/*    title={"Universitet ni tanlang"}*/}
                        {/*    options={data}*/}
                        {/*    extraClass={cls.select}*/}
                        {/*    onChangeOption={setUniver}*/}
                        {/*/>*/}
                        {/*{univer ? <Select*/}
                        {/*    title={"Fakultetni tanlang"}*/}
                        {/*    onChangeOption={setFakultets}*/}
                        {/*    extraClass={cls.select}*/}
                        {/*    options={fakultet}*/}
                        {/*/> : null}*/}
                        {/*<AnimatedMulti*/}
                        {/*    extraClass={cls.select}*/}
                        {/*    options={schoolOptions}*/}
                        {/*/>*/}

                    </Form>
                </div>}

        </div>


    )
}

