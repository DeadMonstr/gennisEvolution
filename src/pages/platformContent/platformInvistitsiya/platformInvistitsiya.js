import {Link, useParams} from "react-router-dom";
import Select from "../../../components/platform/platformUI/select";

import React, {useCallback, useEffect, useState} from "react";
import "./platformInvistitsiya.sass"
import {useDispatch, useSelector} from "react-redux";
import {fetchDataToChange} from "../../../slices/dataToChangeSlice";

import {useHttp} from "../../../hooks/http.hook";

import {InputTest} from "../../../components/platform/platformUI/inputTest/inputTest";
import {useForm} from "react-hook-form";
import Form from "../../../components/platform/platformUI/form/Form";
import Radio from "../../../components/platform/platformUI/radio/radio";
import Button from "../../../components/platform/platformUI/button";
import {BackUrl, headers} from "../../../constants/global";
import {setMessage} from "../../../slices/messageSlice";


const PlatformInvistitsiya = () => {

    const [activeFilter,setActiveFilter] = useState("")
    const [year,setYear] = useState(null)
    const {locationId} = useParams()


    const {history} = useSelector(state => state.accounting)
    const {dataToChange} = useSelector(state => state.dataToChange)
    const [radioSelect, setRadioSelect] = useState(null)

    useEffect(() => {
        dispatch(fetchDataToChange(locationId))
    },[locationId])


    const dispatch = useDispatch()
    const {request} = useHttp()

    const {register , handleSubmit , setValue } = useForm()

    const onClick = (data) => {
        const res = {
            ...data,
            payment_type_id: Number(radioSelect),
            calendar_year: year,
            // location_id: locationId
        }
        request(`${BackUrl}investment/${locationId}` , "POST" , JSON.stringify(res) , headers())
            .then(res => {
                console.log(res)
                dispatch(setMessage({
                    msg: res.message,
                    type: "success",
                    active: true
                }))
                setValue("name" , "")
                setValue("amount" , "")
                setValue("calendar_month" , "")
            })

    }
    return (
        <div className="collection">
            <header>
                <div>
                    <Link to={-1} className="backBtn">
                        <i className="fas fa-arrow-left" />
                        Ortga
                    </Link>
                </div>
            </header>

            <div className="subheader">
                <Form onSubmit={handleSubmit(onClick)}>
                    <InputTest name={"name"} register={register}/>
                    <InputTest type={"number"} name={"amount"} register={register}/>
                    <InputTest type={"date"} name={"calendar_month"} register={register}/>
                    <Select
                        options={dataToChange?.years}
                        title={"Yillar"}
                        onChangeOption={setYear}
                        number={true}
                    />
                    <Select onChangeOption={setRadioSelect} options={dataToChange?.payment_types}/>


                </Form>
            </div>

            <div className="subheader">
                {/*<h1>{history?.data?.result}</h1>*/}
            </div>
            <main>
                {/*<h1 className="studentAtt__title">{data.name} attendance Hamma bali: {data.totalBall}</h1>*/}


                {/*<div className="collection__container">*/}
                {/*    <AccountingTable*/}
                {/*        activeRowsInTable={activeRowsInTableStudentPayment}*/}
                {/*        users={history.data}*/}
                {/*        funcSlice={funcSlice}*/}
                {/*    />*/}
                {/*</div>*/}
            </main>
        </div>
    );
};


export default PlatformInvistitsiya