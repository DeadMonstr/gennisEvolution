import {useDispatch, useSelector} from "react-redux";
import React, {useCallback, useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {useAuth} from "hooks/useAuth";
import {useHttp} from "hooks/http.hook";
import {fetchDataToChange} from "slices/dataToChangeSlice";
import cls from "../AccountantBookKeeping.module.sass";
import {BackUrl, headers} from "constants/global";
import {changePaymentTypePayable, onAddPayable, onDeletePayable} from "slices/accountantSlice";
import Table from "components/platform/platformUI/table";
import Modal from "components/platform/platformUI/modal";
import Confirm from "components/platform/platformModals/confirm/confirm";
import ConfimReason from "components/platform/platformModals/confirmReason/confimReason";
import Select from "components/platform/platformUI/select";
import Form from "components/platform/platformUI/form/Form";
import InputForm from "components/platform/platformUI/inputForm";
import Button from "components/platform/platformUI/button";
import {fetchBill} from "../../../../../slices/billSlice";

const AccountPayable = ({locations, dataPayable}) => {

    const status = [
        {name: "Debtor", status: true},
        {name: "Not in debt", status: false}
    ]

    const {dataToChange} = useSelector(state => state.dataToChange)


    const {data} = useSelector(state => state.billSlice)
    const [add, setAdd] = useState(false)
    const {register, handleSubmit} = useForm()
    const {selectedLocation} = useAuth()
    const dispatch = useDispatch()
    const [loc, setLoc] = useState(null)

    const [activeChangeModal, setActiveChangeModal] = useState(false)
    const [activeChangeModalName, setActiveChangeModalName] = useState("")
    const [activeCheckPassword, setActiveCheckPassword] = useState(false)
    const [changingData, setChangingData] = useState({})
    const {isCheckedPassword} = useSelector(state => state.me)
    const [isConfirm, setIsConfirm] = useState(false)




    const [account, setSelectedAccount] = useState(null)


    const {request} = useHttp()


    console.log(account)

    useEffect(() => {
        dispatch(fetchBill())
    }, [])

    useEffect(() => {
        dispatch(fetchDataToChange(selectedLocation))
    }, [selectedLocation])

    const changeModal = (name) => {
        setActiveChangeModalName(name)
        if (!isCheckedPassword) {
            setActiveCheckPassword(true)
        } else {
            setActiveChangeModal(true)
        }
    }


    const renderDebtType = useCallback(() => {
        return status.map((item, i) => {
            return (
                <label key={i} className="radioLabel" htmlFor="">
                    <input className="radio" {...register("status", {required: true})} type="radio"
                           value={item.status}/>
                    <span>{item.name}</span>
                </label>
            )
        })
    }, [status])

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


    const renderData = () => {
        return dataPayable.map((item, i) => (
            <tr>
                <td>{i + 1}</td>
                <td>{item.amount}</td>
                <td>{item.desc}</td>
                <td>{item.date}</td>
                <td
                    onClick={() => {

                        changeModal("changeTypePayment")

                        setChangingData({
                            id: item.id,
                            payment_type: item.payment_type.id,
                            userId: item.id,
                        })

                    }}
                >
                    <span
                        className={cls.typePayment}
                    >
                        {/*Cash*/}
                        {item.payment_type.name}
                    </span>
                </td>
                <td>{item.debtor === true ?
                    <i className={`fa fa-check ${cls.item_check}`}/> :
                    <i className={`fa fa-times ${cls.item_false}`}/>}
                </td>
                <td>
                    {
                        !item.status &&
                        <span
                            onClick={() => {
                                changeModal("deletePayment")
                                setChangingData({
                                    id: item.id,
                                    msg: "Account payable o'chirishni hohlaysizmi"
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


        request(`${BackUrl}crud_account_payable/${changingData.id}/`, "POST", JSON.stringify({payment_type_id: value}), headers())
            .then(res => {
                console.log(res)
                dispatch(changePaymentTypePayable({id: id, data: res.payment_type}))

                // dispatch(onAddDevidend(res.dividend))
                setActiveChangeModal(false)
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


        request(`${BackUrl}delete_account_payable/${changingData.id}/`, "POST", JSON.stringify(data), headers())
            .then(res => {
                dispatch(onDeletePayable({id: changingData.id}))
                // dispatch(changePaymentType({id: id, payment_type: res.payment_type}))
                // dispatch(onAddDevidend(res.dividend))
                // setAdd(false)
            })

    }


    const onSubmit = (data) => {


        request(`${BackUrl}add_account_payable`, "POST", JSON.stringify({
            ...data,
            location_id: loc,
            account_id: Number(account)
        }), headers())
            .then(res => {
                dispatch(onAddPayable(res.account_payable))
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
                    <th>Desc</th>
                    <th>Date</th>
                    <th>Payment type</th>
                    <th>Status</th>
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
                        <InputForm register={register} type={"number"} title={"Amount sum"} name={"amount_sum"}/>
                        <InputForm register={register} title={"Desc"} name={"desc"}/>
                        <InputForm register={register} title={"Date"} type={"date"} name={"date"}/>

                        <Select onChangeOption={setSelectedAccount} options={data}/>
                        <Select value={loc} onChangeOption={setLoc} options={locations}/>

                        <div className={cls.debtor_type}>
                            {renderDebtType()}
                        </div>

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


export default AccountPayable