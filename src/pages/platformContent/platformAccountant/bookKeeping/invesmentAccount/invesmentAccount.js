import {useDispatch, useSelector} from "react-redux";
import React, {useCallback, useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {useHttp} from "hooks/http.hook";
import {fetchDataToChange} from "slices/dataToChangeSlice";
import cls from "pages/platformContent/platformAccountant/bookKeeping/AccountantBookKeeping.module.sass";
import {BackUrl, headers} from "constants/global";
import {
    changePaymentTypeInvesment,
    changePaymentTypeOverhead, fetchAccountantBookKeepingTypesMoney,
    onAddInvesment,
    onAddOverhead,
    onDeleteInvesment,
    onDeleteOverhead
} from "slices/accountantSlice";
import Table from "components/platform/platformUI/table";
import Modal from "components/platform/platformUI/modal";
import Confirm from "components/platform/platformModals/confirm/confirm";
import ConfimReason from "components/platform/platformModals/confirmReason/confimReason";
import Select from "components/platform/platformUI/select";
import Form from "components/platform/platformUI/form/Form";
import InputForm from "components/platform/platformUI/inputForm";
import Button from "components/platform/platformUI/button";


const InvesmentAccount = ({locations}) => {

    const {dataToChange} = useSelector(state => state.dataToChange)
    const {invesment} = useSelector(state => state.accountantSlice)

    const [add, setAdd] = useState(false)

    const [activeChangeModal, setActiveChangeModal] = useState(false)
    const [activeChangeModalName, setActiveChangeModalName] = useState("")
    const [activeCheckPassword, setActiveCheckPassword] = useState(false)
    const [changingData, setChangingData] = useState(null)
    const {isCheckedPassword} = useSelector(state => state.me)
    const [isConfirm, setIsConfirm] = useState(false)
    const [loc, setLoc] = useState(false)
    const {register, handleSubmit} = useForm()

    const dispatch = useDispatch()

    const newLocation = [...locations, {name: "Boshqa", value: "other"}]
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
        return invesment?.map((item, i) => (
            <tr>
                <td>{i + 1}</td>
                <td>{item?.location}</td>
                <td>{item?.name}</td>
                <td>{item?.amount}</td>
                <td
                    onClick={() => {
                        if (!item.status) {
                            changeModal("changeTypePayment")
                            setChangingData({
                                id: item.id,
                                payment_type: item.payment_type_id,
                                userId: item.id,
                            })
                        }


                    }}
                >
                    <span
                        className={cls.typePayment}
                    >
                        {item?.typePayment}
                    </span>
                </td>
                <td>{item?.date}</td>
                {/*<td>{item.reason}</td>*/}
                <td>
                    {
                        !item?.status &&
                        <span
                            onClick={() => {

                                changeModal("deletePayment")
                                setChangingData({
                                    id: item.id,
                                    msg: "Invistitsiya ni o'chirishni hohlaysizmi"
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

        // dispatch(changePaymentType({id: id ,typePayment: value}))

        request(`${BackUrl}update_payment_type/${id}/${value}/`, "POST", null, headers())
            .then(res => {
                dispatch(changePaymentTypeInvesment({id: id, data: res.investment}))
                setActiveChangeModal(false)

                dispatch(fetchAccountantBookKeepingTypesMoney())

            })
    }


    const getConfirmDelete = (data) => {


        dispatch(onDeleteInvesment(changingData?.id))

        request(`${BackUrl}account/delete_investment/${changingData?.id}/`, "DELETE", JSON.stringify(data), headers())
            .then(res => {
                dispatch(fetchAccountantBookKeepingTypesMoney())

                setActiveChangeModal(false)

            })

    }


    const renderPaymentType = useCallback(() => {
        return dataToChange?.payment_types?.map((item, i) => {
            return (
                <label key={i} className="radioLabel" htmlFor="">
                    <input className="radio" {...register("payment_type_id", {required: true})} type="radio"
                           value={item.id}/>
                    <span>{item.name}</span>
                </label>
            )
        })
    }, [dataToChange?.payment_types])


    const onSubmit = (data) => {

        const newData = {
            ...data,
        }

        request(`${BackUrl}account/investment/${loc ? `${loc}/` : ""}`, "POST", JSON.stringify(newData), headers())
            .then(res => {
                dispatch(onAddInvesment(res.investment))
                dispatch(fetchAccountantBookKeepingTypesMoney())

                console.log(res.investment)
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
                    <th>Location</th>
                    <th>Name</th>
                    <th>Amount</th>
                    <th>Payment type</th>
                    <th>Date</th>
                    {/*<th>Reason</th>*/}
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
                        <InputForm register={register} title={"Name"} name={"name"}/>
                        <InputForm register={register} title={"Amount"} type={"number"} name={"amount"}/>
                        <InputForm register={register} title={"Date"} type={"date"} name={"date"}/>

                        <Select value={loc} onChangeOption={setLoc} options={newLocation}/>


                        {loc === "other" ?
                            <InputForm register={register} name={"otherReason"}/> :
                            null
                        }
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


export default InvesmentAccount