import {Link, useNavigate, useParams} from "react-router-dom";
import React, {useCallback, useEffect, useState} from "react";

import cls from "../platformBill.module.sass"
import Button from "../../../../components/platform/platformUI/button";
import {useDispatch, useSelector} from "react-redux";
import {
    fetchBill,
    fetchBillProfile,
    fetchDataPayable, fetchDataPayables,
    onAddBill,
    onDeleteBill,
    onEditBill
} from "../../../../slices/billSlice";
import Modal from "../../../../components/platform/platformUI/modal";
import InputForm from "../../../../components/platform/platformUI/inputForm";
import {useForm} from "react-hook-form";
import Form from "../../../../components/platform/platformUI/form/Form";
import {BackUrl, headers} from "../../../../constants/global";
import {useHttp} from "../../../../hooks/http.hook";
import Confirm from "../../../../components/platform/platformModals/confirm/confirm";
import ConfimReason from "../../../../components/platform/platformModals/confirmReason/confimReason";
import AccountPayable from "../../platformAccountant/bookKeeping/accountPayable/AccountPayable";
import {useAuth} from "../../../../hooks/useAuth";
import {fetchDataToChange} from "../../../../slices/dataToChangeSlice";
import {changePaymentTypePayable, onAddPayable, onDeletePayable} from "../../../../slices/accountantSlice";
import Table from "../../../../components/platform/platformUI/table";
import Select from "../../../../components/platform/platformUI/select";
import {fetchLocations} from "../../../../slices/locationsSlice";

const PlatformBillProfile = () => {
    const {id} = useParams()

    const navigate = useNavigate()

    const {profile} = useSelector(state => state.billSlice)

    const {data, dataPayable} = useSelector(state => state.billSlice)
    const {register, handleSubmit, setValue} = useForm()
    const [isConfirm, setIsConfirm] = useState(false)

    const [activeModal, setActiveModal] = React.useState(false)
    const [activeModalEdit, setActiveModalEdit] = React.useState(false)

    const {request} = useHttp()


    const {locations} = useSelector(state => state.locations)

    const dispatch = useDispatch()


    useEffect(() => {
        dispatch(fetchLocations())
        dispatch(fetchBill())
    }, [])

    useEffect(() => {
        dispatch(fetchBillProfile(id))

        dispatch(fetchDataPayable(id))
    }, [])

    const onClickDelete = () => {
        request(`${BackUrl}delete_account/${id}/`, "DELETE", null, headers())
            .then(res => {
                dispatch(onDeleteBill(id))
                setValue("name", "")
                setActiveModal(false)
                navigate(-1)
            })
            .catch(err => {
                console.log(err)
            })

    }

    const onEdit = (data) => {
        request(`${BackUrl}crud_account/${id}/`, "POST", JSON.stringify(data), headers())
            .then(res => {
                dispatch(onEditBill({id: id, data: res.account}))
                setValue("name", "")
                setActiveModalEdit(false)
                console.log(res)
            })
            .catch(err => {
                console.log(err)
            })


    }

    return (
        <div className={cls.billProfile}>
            <header>
                <div>
                    <Link to={-1} className="backBtn">
                        <i className="fas fa-arrow-left"/>
                        Ortga
                    </Link>
                </div>
            </header>


            <div className={cls.header}>
                <h2>Nomi : {profile.name} </h2>

                <div style={{display: "flex", gap: "2rem"}}>
                    <Button onClickBtn={() => {
                        setActiveModalEdit(true)
                        setValue("name", profile.name)
                    }}>Edit</Button>
                    <Button onClickBtn={() => setActiveModal(true)}>Delete</Button>
                </div>
            </div>


            <AccountPayableBill years={dataPayable} dataAccount={data} locations={locations} id={id}/>


            <Modal activeModal={activeModal} setActiveModal={() => setActiveModal(!activeModal)}>
                <Confirm
                    setActive={setActiveModal}
                    text={"O'chirishni xohlaysizmi ?"}
                    getConfirm={setIsConfirm}
                />
            </Modal>
            {
                isConfirm === "yes" ?
                    <Modal
                        activeModal={activeModal}
                        setActiveModal={() => {
                            setActiveModal(false)
                            setIsConfirm(false)
                        }}
                    >
                        <ConfimReason getConfirm={onClickDelete} reason={true}/>
                    </Modal> : null
            }

            <Modal setActiveModal={setActiveModalEdit} activeModal={activeModalEdit}>
                <Form onSubmit={handleSubmit(onEdit)} extraClassname={cls.modal}>
                    <InputForm register={register} name={"name"}/>
                </Form>
            </Modal>

        </div>
    );
};

export const AccountPayableBill = ({years, locations, dataAccount, id}) => {

    const status = [
        {name: "Payable", status: true},
        {name: "Receable", status: false}
    ]


    const {dataPayables} = useSelector(state => state.accountantSlice)

    const {dataToChange} = useSelector(state => state.dataToChange)
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


    const [payable , setPayable] = useState(null)


    const [year, setYear] = useState(null)

    const [month, setMonth] = useState(null)


    const {request} = useHttp()


    useEffect(() => {

        const monthId = years?.years?.filter(item => item?.value === year)[0]?.months.filter(item => item.month === month)[0]?.id


        if (month) {
            // dispatch(fetchDataPayables({id, monthId}))

            request(`${BackUrl}account_payables/${id}/${monthId}/`, "POST", null, headers())
                .then(res => {
                    console.log(res, "res")

                    setPayable(res.payables)
                })

        }
    }, [month])


    console.log(payable , "payable")

    useEffect(() => {
        dispatch(fetchDataToChange(selectedLocation))
    }, [])

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
        return payable?.map((item, i) => (
            <tr>
                <td>{i + 1}</td>
                <td>{item.amount}</td>
                <td>{item.desc}</td>
                <td>{item.date}</td>
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

        //
        // request(`${BackUrl}crud_account_payable/${changingData.id}`, "POST", JSON.stringify({payment_type_id: value}), headers())
        //     .then(res => {
        //         console.log(res)
        //         dispatch(changePaymentTypePayable({id: id, payment_type: res.payment_type}))
        //
        //         // dispatch(onAddDevidend(res.dividend))
        //         // setAdd(false)
        //     })

    }


    const getConfirmDelete = (data) => {
        // const newData = {
        //     id: changingData.id,
        //     userId: changingData.userId,
        //     type: changingData.type,
        //     ...data
        // }

        //
        // setActiveChangeModal(false)
        //
        //
        // request(`${BackUrl}delete_account_payable/${changingData.id}`, "POST", JSON.stringify(data), headers())
        //     .then(res => {
        //
        //
        //     })

    }


    const onSubmit = (data) => {


        request(`${BackUrl}add_account_payable`, "POST", JSON.stringify({
            ...data,
            account_id: id
        }), headers())
            .then(res => {
                // dispatch(onAddPayable(res.account_payable))
                setAdd(false)
            })

    }
    return (
        <div className={cls.bill}>
           <div className={cls.billFilter}>
               <Select options={years?.years} onChangeOption={setYear}/>
               <Select
                   options={years?.years?.filter(item => item?.value === year)[0]?.months.map(itemMonth => itemMonth.month)}
                   onChangeOption={setMonth}
               />
               <div className={cls.plus} onClick={() => setAdd(true)}>
                   <i className="fas fa-plus"></i>
               </div>

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
        </div>
    )
}

export default PlatformBillProfile;