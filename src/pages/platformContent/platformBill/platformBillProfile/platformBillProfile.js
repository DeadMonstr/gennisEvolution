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
    onEditBill,
    onAddPayable, fetchAccountantPayableHistory, onAddPayableHistory,
    onDeletePayableHistory, onDeletePayable, onChangePayablePayment, onChangeHistoryPayment
} from "../../../../slices/billSlice";
import Modal from "../../../../components/platform/platformUI/modal";
import InputForm from "../../../../components/platform/platformUI/inputForm";
import {useForm} from "react-hook-form";
import Form from "../../../../components/platform/platformUI/form/Form";
import {BackUrl, headers} from "../../../../constants/global";
import {useHttp} from "../../../../hooks/http.hook";
import Confirm from "../../../../components/platform/platformModals/confirm/confirm";
import ConfimReason from "../../../../components/platform/platformModals/confirmReason/confimReason";

import {useAuth} from "../../../../hooks/useAuth";
import {fetchDataToChange} from "../../../../slices/dataToChangeSlice";

import Table from "../../../../components/platform/platformUI/table";
import Select from "../../../../components/platform/platformUI/select";
import {fetchLocations} from "../../../../slices/locationsSlice";
import Textarea from "../../../../components/platform/platformUI/textarea";
import classNames from "classnames";


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


            <AccountPayableBill years={dataPayable} dataAccount={data} locations={locations}/>


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

export const AccountPayableBill = ({years, locations, dataAccount}) => {

    const status = [
        {name: "Payable", status: true},
        {name: "Receable", status: false}
    ]

    const {id} = useParams()


    const {payable, history} = useSelector(state => state.billSlice)

    const {dataToChange,} = useSelector(state => state.dataToChange)
    const [add, setAdd] = useState(false)
    const {register, handleSubmit, reset} = useForm()
    const {selectedLocation} = useAuth()
    const dispatch = useDispatch()


    const [deleted, setDeleted] = useState(false)
    const [archive, setArchive] = useState(true)

    const [activeChangeModal, setActiveChangeModal] = useState(false)
    const [changePayment, setChangePayment] = useState(false)
    const [changePaymentData, setChangePaymentData] = useState(null)
    const [changingData, setChangingData] = useState({})

    const [isConfirm, setIsConfirm] = useState(false)

    const [activeBill, setActiveBill] = useState(false)


    const [deleteItem, setDeleteItem] = useState(null)

    const [activeHistory, setActiveAddHistory] = useState(false)

    const [activeBillData, setActiveBillData] = useState(null)


    const [year, setYear] = useState(null)

    const [month, setMonth] = useState(null)


    const {request} = useHttp()


    useEffect(() => {
        if (activeBillData) {
            dispatch(fetchAccountantPayableHistory({id: activeBillData?.id}))
        }
    }, [activeBillData])


    useEffect(() => {
        if (month && year) {
            const monthId = years?.years?.filter(item => item?.value === year)[0]?.months.filter(item => item.month === month)[0]?.id
            dispatch(fetchDataPayables({id, monthId, archive, deleted}))

        }
    }, [month, year, deleted, archive])

    useEffect(() => {
        dispatch(fetchDataToChange(selectedLocation))
    }, [])


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

            <>


                <tr onClick={() => {
                    setActiveBillData(item)
                }}>


                    <td>{i + 1}</td>
                    <td onClick={() => {
                        setActiveBill(true)
                        setActiveBillData(item)
                    }}
                    >{item.amount}</td>
                    <td>{item.remaining_sum}</td>
                    <td>{item.desc}</td>
                    <td>{item.date}</td>
                    <td
                        onClick={() => {


                            setChangingData(item)
                            setChangePayment(true)

                        }}
                    >
                    <span
                        className={cls.typePayment}
                    >
                        {item.payment_type.name}
                    </span>
                    </td>
                    <td>
                        {
                            !item.status &&
                            <span
                                onClick={() => {
                                    setActiveChangeModal(true)


                                    setDeleteItem(item)
                                }}
                                className={cls.delete}
                            >
                        <i className="fas fa-times"/>
                    </span>
                        }
                    </td>
                    <td>
                        <span
                            onClick={() => {
                                setActiveAddHistory(true)

                            }}
                            className={cls.add_icon}
                        >
                            <i className="fas fa-plus"/>
                        </span>

                    </td>

                </tr>

            </>

        ))
    }

    const render = renderData()


    const onSubmit = (data) => {
        request(`${BackUrl}add_account_payable`, "POST", JSON.stringify({
            ...data,
            account_id: id,
            status: data.status === "true" ? true : false
        }), headers())
            .then(res => {
                reset()
                dispatch(onAddPayable(res.account_payable))
                setAdd(false)
            })
    }


    const onDeletePayableData = (data) => {


        request(`${BackUrl}delete_account_payable/${deleteItem.id}/`, "POST", JSON.stringify(data), headers())
            .then(res => {
                console.log(res)
                dispatch(onDeletePayable(deleteItem.id))
                setActiveChangeModal(false)
            })
            .catch(err => {
                console.log(err)
            })


    }

    const ChangePayment = (id) => {

        request(`${BackUrl}crud_account_payable/${changingData.id}/`, "POST", JSON.stringify({payment_type_id: Number(id)}), headers())
            .then(res => {
                setChangePayment(false)
                dispatch(onChangePayablePayment({id: changingData.id, data: res.payment_type}))
            })
            .catch(err => {
                console.log(err)
            })

    }

    return (
        <div className={cls.bill}>
            <div className={cls.billFilter}>

                <Button onClickBtn={() => setDeleted(!deleted)}>Deleted</Button>
                <Button
                        onClickBtn={() => setArchive(!archive)}>Archive</Button>
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
                    <th>Remaining sum</th>
                    <th>Desc</th>
                    <th>Date</th>
                    <th>Payment type</th>
                    <th>Status</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {month ? render : null}
                </tbody>
            </Table>


            <Modal activeModal={activeChangeModal} setActiveModal={() => setActiveChangeModal(!activeChangeModal)}>
                <Confirm
                    setActive={setActiveChangeModal}
                    text={"O'chirishni xohlaysizmi ?"}
                    getConfirm={setIsConfirm}
                />
            </Modal>
            {
                isConfirm === "yes" ?
                    <Modal
                        activeModal={activeChangeModal}
                        setActiveModal={() => {
                            setActiveChangeModal(false)
                            setIsConfirm(false)
                        }}
                    >
                        <ConfimReason getConfirm={onDeletePayableData} reason={true}/>
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

                        <Button onSubmit={handleSubmit(onSubmit)} type={"submit"}>Submit</Button>
                    </Form>
                </div>
            </Modal>

            <Modal activeModal={changePayment} setActiveModal={setChangePayment}>

                <div className={cls.change}>
                    <Select options={dataToChange?.payment_types} onChangeOption={ChangePayment}/>
                </div>


            </Modal>


            <AddPayableHistory
                activeHistory={activeHistory}
                setActiveAddHistory={setActiveAddHistory}
                activeBillData={activeBillData}
                dataToChange={dataToChange}
            />


            <PayableHistory history={history} activeBill={activeBill} setActiveBill={setActiveBill}/>

        </div>
    )
}


export const PayableHistory = ({history, activeBill, setActiveBill}) => {

    const [activeChangeModal, setActiveChangeModal] = useState(false)
    const dispatch = useDispatch()

    const [isConfirm, setIsConfirm] = useState(false)

    const [dataHistory, setDataHistory] = useState(null)
    const [changingData, setChangingData] = useState({})


    const {dataToChange,} = useSelector(state => state.dataToChange)


    const [changePayment, setChangePayment] = useState(false)
    const {request} = useHttp()

    const onDeleteHistory = (id) => {
        request(`${BackUrl}delete_history/${dataHistory.id}/`, "DELETE", null, headers())
            .then(res => {
                console.log(res)
                setActiveChangeModal(false)

                dispatch(onDeletePayableHistory(dataHistory.id))
            })
            .catch(err => {
                console.log(err)
            })

    }


    const ChangePayment = (id) => {

        request(`${BackUrl}crud_history/${changingData.id}/`, "POST", JSON.stringify({payment_type_id: Number(id)}), headers())
            .then(res => {
                setChangePayment(false)
                dispatch(onChangeHistoryPayment({id: changingData.id, data: res.history}))
            })
            .catch(err => {
                console.log(err)
            })

    }
    return (
        <Modal activeModal={activeBill} setActiveModal={() => setActiveBill(false)}>

            <div className={cls.add}>

                <Table className={cls.table}>
                    <thead>
                    <tr>
                        <th>No</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Payment type</th>
                        <th></th>
                    </tr>
                    </thead>

                    <tbody>
                    {history?.map((item, i) => (
                        <tr>
                            <td>{i + 1}</td>
                            <td>{item.sum}</td>
                            <td>{item.date}</td>
                            <td> <span
                                onClick={() => {
                                    setChangingData(item)
                                    setChangePayment(true)
                                }}

                                className={cls.typePayment}
                            >
                        {item.payment_type.name}
                    </span></td>
                            <td>
                                <span

                                    onClick={() => {
                                        setActiveChangeModal(true)
                                        setDataHistory(item)
                                    }} className={cls.delete}>
                                    <i className={"fa fa-times"}/>
                                </span></td>
                        </tr>
                    ))}
                    </tbody>

                </Table>
            </div>

            <Modal activeModal={activeChangeModal} setActiveModal={() => setActiveChangeModal(!activeChangeModal)}>
                <Confirm
                    setActive={setActiveChangeModal}
                    text={"O'chirishni xohlaysizmi ?"}
                    getConfirm={setIsConfirm}
                />
            </Modal>
            {
                isConfirm === "yes" ?
                    <Modal
                        activeModal={activeChangeModal}
                        setActiveModal={() => {
                            setActiveChangeModal(false)
                            setIsConfirm(false)
                        }}
                    >
                        <ConfimReason getConfirm={onDeleteHistory} reason={true}/>
                    </Modal> : null
            }


            <Modal activeModal={changePayment} setActiveModal={setChangePayment}>

                <div className={cls.change}>
                    <Select options={dataToChange?.payment_types} onChangeOption={ChangePayment}/>
                </div>


            </Modal>
        </Modal>


    )
}

export const AddPayableHistory = ({activeHistory, setActiveAddHistory, activeBillData, dataToChange}) => {

    const {register, handleSubmit, reset} = useForm()


    const dispatch = useDispatch()

    const {request} = useHttp()


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

    const onSubmitHistory = (data) => {
        request(`${BackUrl}create_payable_history/${activeBillData.id}/`, "POST", JSON.stringify(data), headers())
            .then(res => {
                reset()
                console.log(res.history)
                setActiveAddHistory(false)
                dispatch(onAddPayableHistory(res.history))
                // setAdd(false)
            })
            .catch(err => {
                console.log(err)
            })
    }

    return (

        <Modal activeModal={activeHistory} setActiveModal={() => setActiveAddHistory(false)}>

            <div className={cls.add}>

                <Form onSubmit={handleSubmit(onSubmitHistory)}>
                    <InputForm register={register} type={"number"} title={"Amount sum"} name={"sum"}/>

                    <InputForm register={register} title={"Date"} type={"date"} name={"date"}/>

                    <Textarea register={register} title={"Desc"} name={"reason"}/>

                    <div className={cls.payment_type}>
                        {renderPaymentType()}
                    </div>

                </Form>
            </div>
        </Modal>
    )
}
export default PlatformBillProfile;