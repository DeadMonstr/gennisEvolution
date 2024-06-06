import React, {useCallback, useEffect, useState} from 'react';
import cls from "./capital.module.sass"
import BackButton from "components/platform/platformUI/backButton/backButton";
import ImgInput from "components/platform/platformUI/imgInput";
import InputForm from "components/platform/platformUI/inputForm";
import Select from "components/platform/platformUI/select";
import DefaultLoaderSmall from "components/loader/defaultLoader/defaultLoaderSmall";
import Button from "components/platform/platformUI/button";
import Modal from "components/platform/platformUI/modal";
import {BackUrl, BackUrlForDoc, headers, headersImg} from "constants/global";
import {fetchCapital, onAddCapitalReducer, onChangeCapitalReducer} from "slices/capitalCategorySlice";
import {setMessage} from "slices/messageSlice";
import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import {useHttp} from "hooks/http.hook";
import {useNavigate, useParams} from "react-router-dom";
import {fetchDataToChange} from "slices/dataToChangeSlice";
import Confirm from "components/platform/platformModals/confirm/confirm";
import Table from "components/platform/platformUI/table";


const Capital = () => {


    const {locationId,id} = useParams()
    const {capital, tools,terms} = useSelector(state => state.capitalCategory)


    const {
        register: register2,
        handleSubmit: handleSubmit2,
        setValue: setValue2,
        reset: reset2
    } = useForm();


    const [day, setDay] = useState(null)
    const [month, setMonth] = useState(null)
    const [loading, setLoading] = useState(false)
    const [canChange, setCanChange] = useState(false)
    const [canDelete, setCanDelete] = useState(false)
    const {dataToChange} = useSelector(state => state.dataToChange)
    const [img, setImg] = useState()


    const dispatch = useDispatch()
    const {request} = useHttp()

    useEffect(() => {
        dispatch(fetchCapital(id))
        dispatch(fetchDataToChange())
    },[id])


    useEffect(() => {
        if (tools.length && tools?.length < 2) {
            setMonth(tools[0].value)
        }
    }, [tools])


    useEffect(() => {
        if (Object.keys(capital).length) {
            setDay(capital.day)
            setValue2("capital_name", capital.name)
            setValue2("number", capital.number)
            setValue2("term", capital.term)
            setValue2("price", capital.price)
            setValue2("payment_type_id", capital?.payment_type.id.toString())
        }
    },[capital])

    const navigate = useNavigate()

    const onDelete = (data) => {
        if (data === "yes") {
            request(`${BackUrl}add_capital/${locationId}`,"DELETE", JSON.stringify({capital_id:capital.id}), headers())
                .then(res => {
                    dispatch(setMessage({
                        msg: res.msg,
                        type: "success",
                        active: true
                    }))
                    navigate(-1)
                })
        }
    }
    const onChange = (data) => {
        const formData = new FormData()

        formData.append(`img`, img);
        formData.append(`info`, JSON.stringify({
            ...data,
            month,
            day,
            capital_id: capital.id
        }));
        setLoading(true)

        request(`${BackUrl}add_capital/${locationId}`,"PUT", formData, headersImg())
            .then(res => {
                dispatch(onChangeCapitalReducer({capital: res.capital}))

                dispatch(setMessage({
                    msg: res.msg,
                    type: "success",
                    active: true
                }))
                setCanChange(false)
                setLoading(false)
                reset2()
                setDay(null)
            })
    }




    const renderPaymentType = useCallback(() => {
        return dataToChange?.payment_types?.map((item, index) => {
            return (
                <label key={index} className="radioLabel" htmlFor="">
                    <input
                        className="radio"
                        {...register2("payment_type_id", {required: true,})}
                        type="radio"
                        value={item.id}
                    />
                    <span>{item.name}</span>
                </label>
            )
        })
    }, [dataToChange?.payment_types])


    const renderDate = useCallback(() => {
        return tools?.map((item, index) => {
            if (item.value === month) {
                return (
                    <div className="date__item" key={index}>
                        <Select
                            number={true}
                            name={"day"}
                            title={"Kun"}
                            defaultValue={day}
                            onChangeOption={setDay}
                            options={item?.days}
                        />
                    </div>
                )
            }
        })
    }, [tools, month, day])

    const renderedDays = renderDate()

    return (
        <div className={cls.capital}>
            <div className={cls.subheader}>
                <BackButton/>
                <h1>Kapital</h1>
                <div onClick={() => setCanChange(true)} className={cls.change}>
                    <i className="fas fa-pen"></i>
                </div>
            </div>


            <div className={cls.header}>
                <img src={BackUrlForDoc+capital.img} alt=""/>

                <div className={cls.info}>
                    <h1>Nomi: <span>{capital.name}</span></h1>
                    <h1>Raqami: <span>{capital.number}</span></h1>
                    <h1>Narxi: <span>{capital.price}</span></h1>
                    <h1>Muddat (yil): <span>{capital.term}</span></h1>
                    <h1>Sana: <span>{capital.year}-{capital.month}-{capital.day}</span></h1>
                    <h1>To'lov turi: <span>{capital.payment_type?.name}</span></h1>
                    <h1>Total down cost: <span>{capital.total_down_cost}</span></h1>
                </div>
            </div>

            <Modal activeModal={canChange} setActiveModal={setCanChange}>
                <form className={cls.addModal} id="addCapital" onSubmit={handleSubmit2(onChange)}>
                    <h1>Mahsulot o'zgartirish</h1>
                    <ImgInput databaseImg={capital.img} img={img} setImg={setImg}/>
                    <InputForm title={"Nomi"} register={register2}
                               name={"capital_name"} type={"text"} required/>
                    <InputForm title={"Raqami"} register={register2}
                               name={"number"} type={"text"} required/>
                    <InputForm title={"Narxi"} register={register2} name={"price"}
                               type={"number"} required/>
                    <InputForm title={"Muddat (yil)"} register={register2}
                               name={"term"} type={"number"} required/>
                    {
                        tools?.length >= 2 ?
                            <Select
                                name={"month"}
                                title={"Oy"}
                                defaultValue={month}
                                onChangeOption={setMonth}
                                options={tools}
                            /> :
                            null
                    }

                    {renderedDays}
                    {renderPaymentType()}

                    <div className={cls.btns}>
                        {
                            loading ? <DefaultLoaderSmall/> :
                                <>
                                    <Button
                                        name={"submit1"}
                                        formId={"addCapital"}
                                        type={"submit"}
                                    >
                                        Tasdiqlash
                                    </Button>
                                    <Button
                                        formId={""}
                                        name={"submit2"}
                                        onClickBtn={() => setCanDelete(true)}
                                        type={"danger"}
                                    >
                                        O'chirish
                                    </Button>
                                </>
                        }
                    </div>
                    {/*<Button type={"submit"}>Tasdiqlash</Button>*/}
                </form>
            </Modal>

            <Modal activeModal={canDelete} setActiveModal={setCanDelete}>
                <Confirm text={'Kapitalni uchirishni hohlaysizmi'} setActive={setCanDelete} getConfirm={onDelete}/>
            </Modal>


            <h1>Terms</h1>

            <div className={cls.wrapper}>
                <Table className={cls.tableTerm}>
                    <thead>
                    <tr>
                        <th>№</th>
                        <th>Capital</th>
                        <th>Date</th>
                        <th>Down cost</th>
                    </tr>
                    </thead>
                    <tbody>

                    {
                        terms.map((item,index) => {
                            return (
                                <tr>
                                    <td>{index+1}</td>
                                    <td>{item.capital.name}</td>
                                    <td>{item.date}</td>
                                    <td>{item.down_cost}</td>
                                </tr>
                            )
                        })
                    }


                    </tbody>
                </Table>
            </div>
        </div>
    );
};

export default Capital;