import {useDispatch, useSelector} from "react-redux";
import React, {useCallback, useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {useHttp} from "hooks/http.hook";
import {fetchDataToChange} from "slices/dataToChangeSlice";
import cls from "../AccountantBookKeeping.module.sass";
import {BackUrl, headers} from "constants/global";
import {changePaymentTypeDividend, onAddDevidend, onDeleteDividend} from "slices/accountantSlice";
import Table from "components/platform/platformUI/table";
import Modal from "components/platform/platformUI/modal";
import Confirm from "components/platform/platformModals/confirm/confirm";
import ConfimReason from "components/platform/platformModals/confirmReason/confimReason";
import Select from "components/platform/platformUI/select";
import Form from "components/platform/platformUI/form/Form";
import InputForm from "components/platform/platformUI/inputForm";
import Button from "components/platform/platformUI/button";


const Dividend = ({data, locations}) => {
    const {dataToChange} = useSelector(state => state.dataToChange)


    const [add, setAdd] = useState(false)

    const [activeChangeModal, setActiveChangeModal] = useState(false)
    const [activeChangeModalName, setActiveChangeModalName] = useState("")
    const [activeCheckPassword, setActiveCheckPassword] = useState(false)
    const [changingData, setChangingData] = useState({})
    const {isCheckedPassword} = useSelector(state => state.me)
    const [isConfirm, setIsConfirm] = useState(false)
    const [loc, setLoc] = useState(false)
    const {register, handleSubmit} = useForm()

    const dispatch = useDispatch()


    const {request} = useHttp()


    useEffect(() => {

        dispatch(fetchDataToChange())
    }, [])


    const changeModal = (name) => {
        setActiveChangeModalName(name)
        if (!isCheckedPassword) {
            setActiveCheckPassword(true)
        } else {
            setActiveChangeModal(true)
        }
    }


    const renderData = () => {
        return data.map((item, i) => (
            <tr>
                <td>{i + 1}</td>
                <td>{item.amount}</td>
                <td
                    onClick={() => {
                        if (!item.status) {
                            changeModal("changeTypePayment")
                            setChangingData({
                                id: item.id,
                                payment_type: item.payment_type.id,
                                userId: item.id,
                            })
                        }


                    }}
                >
                                    <span
                                        className={cls.typePayment}
                                    >
                                        {/*Cash*/}
                                        {item.payment_type.name}
                                    </span>
                </td>
                <td>{item.date}</td>
                <td>{item.location}</td>
                <td>
                    {
                        !item.status &&
                        <span
                            onClick={() => {
                                changeModal("deletePayment")
                                setChangingData({
                                    id: item.id,
                                    msg: "Divendni o'chirishni hohlaysizmi"
                                })
                            }}

                            className={cls.delete}
                        >
                        <i className="fas fa-times"/>
                    </span>
                    }

                </td>
            </tr>
        ))
    }

    const render = renderData()

    const changePayment = (id, value) => {

        // setActiveChangeModal(false)
        // dispatch(changePaymentType({id: id ,typePayment: value}))

        request(`${BackUrl}crud_dividend/${changingData.id}`, "POST", JSON.stringify({payment_type_id: value}), headers())
            .then(res => {
                console.log(res)
                dispatch(changePaymentTypeDividend({id: id, payment_type: res.payment_type}))

                // dispatch(onAddDevidend(res.dividend))
                // setAdd(false)
            })
    }


    const getConfirmDelete = (data) => {
        // const newData = {
        //     id: changingData.id,
        //     userId: changingData.userId,
        //     type: changingData.type,
        //     ...data
        // }


        setActiveChangeModal(false)


        request(`${BackUrl}delete_dividend/${changingData.id}`, "POST", JSON.stringify(data), headers())
            .then(res => {
                dispatch(onDeleteDividend({id: changingData.id}))
                // dispatch(changePaymentType({id: id, payment_type: res.payment_type}))

                // dispatch(onAddDevidend(res.dividend))
                // setAdd(false)
            })

    }


    const renderPaymentType = useCallback(() => {
        return dataToChange?.payment_types?.map((item, i) => {
            return (
                <label key={i} className="radioLabel" htmlFor="">
                    <input className="radio" {...register("type_payment", {required: true})} type="radio"
                           value={item.id}/>
                    <span>{item.name}</span>
                </label>
            )
        })
    }, [dataToChange?.payment_types])


    const onSubmit = (data) => {

        const newData = {
            ...data,
            locations: loc,
        }

        request(`${BackUrl}take_dividend`, "POST", JSON.stringify(newData), headers())
            .then(res => {
                console.log(res)
                dispatch(onAddDevidend(res.dividend))
                setAdd(false)
            })
    }

    return (
        <>
            <div className={cls.plus} onClick={() => setAdd(true)}>
                <i className="fas fa-plus"></i>
            </div>
            <Table>
                <thead>
                <tr>
                    <th>№</th>
                    <th>Amount</th>
                    <th>Payment type</th>
                    <th>Date</th>
                    <th>Location</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {render}
                </tbody>
            </Table>

            {
                activeChangeModalName === "deletePayment" && isCheckedPassword ?
                    <>
                        <Modal activeModal={activeChangeModal} setActiveModal={() => setActiveChangeModal(false)}>
                            <Confirm setActive={setActiveChangeModal} text={changingData.msg}
                                     getConfirm={setIsConfirm}/>
                        </Modal>
                        {
                            isConfirm === "yes" ?
                                <Modal
                                    activeModal={activeChangeModal}
                                    setActiveModal={() => {
                                        setActiveChangeModal(false)
                                        setIsConfirm("")
                                    }}
                                >
                                    <ConfimReason getConfirm={getConfirmDelete} reason={true}/>
                                </Modal> : null
                        }
                    </>
                    : activeChangeModalName === "changeTypePayment" && isCheckedPassword ?
                        <Modal activeModal={activeChangeModal} setActiveModal={() => setActiveChangeModal(false)}>
                            <div className="changeTypePayment">
                                <Select
                                    options={dataToChange.payment_types}
                                    name={""}
                                    title={"Payment turi"}
                                    onChangeOption={changePayment}
                                    id={changingData.id}
                                    defaultValue={changingData.payment_type}
                                />
                            </div>
                        </Modal> : null
            }
            <Modal activeModal={add} setActiveModal={() => setAdd(false)}>
                <div className={cls.add}>
                    <Form typeSubmit={"hand"} onSubmit={handleSubmit(onSubmit)}>
                        <InputForm register={register} title={"Amount"} type={"number"} name={"amount"}/>
                        <InputForm register={register} title={"Date"} type={"date"} name={"date"}/>
                        <InputForm register={register} title={"Desc"} name={"desc"}/>
                        <Select value={loc} onChangeOption={setLoc} options={locations}/>
                        <div className={cls.payment_type}>
                            {renderPaymentType()}
                        </div>
                        <Button type={"submit"}>Submit</Button>
                    </Form>
                </div>
            </Modal>
        </>
    )
}


export default Dividend