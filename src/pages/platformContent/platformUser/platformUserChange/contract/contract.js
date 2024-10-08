import React, {useEffect, useRef, useState} from 'react';

import Input from "components/platform/platformUI/input";
import Button from "components/platform/platformUI/button";


import "./contract.sass"

import {BackUrl, BackUrlForDoc, headers} from "constants/global";
import {useHttp} from "hooks/http.hook";
import {useDispatch, useSelector} from "react-redux";
import {setMessage} from "slices/messageSlice";
import {useForm} from "react-hook-form";
import InputForm from "components/platform/platformUI/inputForm";


const Contract = ({userId,accessData}) => {

    const {user} = useSelector(state => state.usersProfile)

    const {register,
        handleSubmit,
        formState: {errors},
        setValue
    } = useForm()


    const [date,setDate] = useState({
        ot: "",
        do: ""
    })



    const [file,setFile] = useState(null)
    const [createdPdf,setCreatedPdf] = useState(null)
    const [createdFile,setCreatedFile] = useState(null)


    useEffect(() =>{
        setDate({
            ot: user?.contract_data?.ot,
            do: user?.contract_data?.do
        })
        setValue("name",user?.contract_data?.representative_name)
        setValue("surname",user?.contract_data?.representative_surname)
        setValue("fatherName",user?.contract_data?.representative_fatherName)
        setValue("passportSeries",user?.contract_data?.representative_passportSeries)
        setValue("givenTime",user?.contract_data?.representative_givenTime)
        setValue("givenPlace",user?.contract_data?.representative_givenPlace)
        setValue("place",user?.contract_data?.representative_place)

    },[user])

    useEffect(() => {
        if (accessData) {
            setCreatedPdf(accessData.contract)
        }
    },[accessData])

    const {request} = useHttp()
    const dispatch = useDispatch()

    const onSubmitCreate = (data) => {


        const newData = {
            ...data,
            date
        }


        request(`${BackUrl}create_contract/${userId}`, "POST",JSON.stringify(newData),headers())
            .then(res => {
                if (res.success) {
                    dispatch(setMessage({
                        msg: res.msg,
                        type: "success",
                        active: true
                    }))

                    setCreatedFile(res.file)
                }
                if (res.error) {
                    dispatch(setMessage({
                        msg: res.msg,
                        type: "error",
                        active: true
                    }))

                }
            })
            .catch(r => {
                dispatch(setMessage({
                    msg: "Serverda yoki internetingizda hatolik",
                    type: "error",
                    active: true
                }))
            })
    }

    const onSubmitFile = () => {

        let data = new FormData();
        data.append('file', file);

        const token = sessionStorage.getItem("token")
        const headers = {
            "Authorization": "Bearer " + token,
        }
        request(`${BackUrl}upload_pdf_contract/${userId}`, "POST",data,headers)
            .then(res => {
                if (res.success) {
                    dispatch(setMessage({
                        msg: res.msg,
                        type: "success",
                        active: true
                    }))
                    setCreatedPdf(res.url)
                }
                if (res.error) {
                    dispatch(setMessage({
                        msg: res.msg,
                        type: "error",
                        active: true
                    }))
                }
            })
            .catch(() => {
                dispatch(setMessage({
                    msg: "Serverda yoki internetingizda hatolik",
                    type: "error",
                    active: true
                }))
            })
    }

    const inputRef = useRef()

    const Open = () => {
        inputRef.current.click()
    }

    const changeDate = (e) => {
        setDate( {
            ...date,
            [e.target.name]: e.target.value
        })
    }

    const resetPdf = () => {
        setCreatedPdf(null)
    }


    return (
        <div className="contract">

            <div className="contract_create">
                <h1>Shartnoma yaratish</h1>

                <form action="" onSubmit={handleSubmit(onSubmitCreate)}>

                    <InputForm
                        register={register}
                        type={"text"}
                        name={"name"}
                        title={"Ism"}
                        required={true}
                    />
                    <InputForm
                        register={register}
                        type={"text"}
                        name={"surname"}
                        title={"Familya"}
                        required={true}

                    />
                    <InputForm
                        register={register}
                        type={"text"}
                        name={"fatherName"}
                        title={"Otasining ismi"}
                        required={true}

                    />
                    <InputForm
                        register={register}
                        type={"text"}
                        name={"passportSeries"}
                        title={"Pasport seriasi"}
                        required={true}

                    />
                    <InputForm
                        register={register}
                        type={"text"}
                        name={"givenTime"}
                        title={"Berilgan vaqti"}
                        required={true}

                    />
                    <InputForm
                        register={register}
                        type={"text"}
                        name={"givenPlace"}
                        title={"Berilgan joyi"}
                        required={true}

                    />
                    <InputForm
                        register={register}
                        type={"text"}
                        name={"place"}
                        title={"Manzili"}
                        required={true}

                    />

                    <label htmlFor="">
                        <h1>Dan</h1>
                        <input

                            name="ot"
                            type="date"
                            className="input-fields"
                            onChange={changeDate}
                            value={date?.ot}
                        />
                    </label>
                    <label htmlFor="">
                        <h1>Gacha</h1>
                        <input
                            defaultValue={user?.contract_data?.do}
                            name="do"
                            type="date"
                            className="input-fields"
                            onChange={changeDate}
                            value={date?.do}
                        />
                    </label>
                    <input className="input-submit" type="submit" />
                </form>
                {
                    createdFile ?
                        <a href={`${BackUrlForDoc}${createdFile}`} target="_blank" download={true} rel="noreferrer" >
                            <Button >Download</Button>
                        </a>
                        : null
                }
            </div>
            <div className="contract_open">
                <h1>Shartnoma kiritish</h1>
                {
                    createdPdf ?
                        <div className="contract_open-change">
                            <a href={`${BackUrlForDoc}${createdPdf}`} target={"_blank"} rel="noreferrer">
                                <Button>
                                    Ko'rish
                                </Button>
                            </a>
                            <Button onClickBtn={resetPdf}>
                                O'zgartirish
                            </Button>
                        </div>

                        :
                    <>
                        <div className="contract_open-item" onClick={Open}>
                            {
                                file ?

                                    <div>
                                        <p>Filename: {file.name}</p>
                                        <p>Filetype: {file.type}</p>
                                        <p>Size in bytes: {file.size}</p>
                                        <p>
                                            lastModifiedDate:{' '}
                                            {file.lastModifiedDate.toLocaleDateString()}
                                        </p>
                                </div>
                                :
                                "Pdf fayl kiriting"
                            }
                            <input
                                accept={".pdf"}
                                ref={inputRef}
                                type="file"
                                onChange={(e) => setFile(e.target.files[0])}
                                name="file"
                            />
                        </div>
                        <Button onClickBtn={onSubmitFile}>
                            Kiritish
                        </Button>

                    </>
                }
            </div>
        </div>
    );
};

export default Contract;