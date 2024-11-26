import React, {useCallback, useEffect, useState} from 'react';


import cls from "./AccountantBookKeeping.module.sass"
import Select from "components/platform/platformUI/select";
import {useDispatch, useSelector} from "react-redux";
import {fetchLocations} from "slices/locationsSlice";
import Table from "components/platform/platformUI/table";
import Modal from "components/platform/platformUI/modal";
import Confirm from "components/platform/platformModals/confirm/confirm";
import ConfimReason from "components/platform/platformModals/confirmReason/confimReason";
import Form from "components/platform/platformUI/form/Form";
import InputForm from "components/platform/platformUI/inputForm";
import Button from "components/platform/platformUI/button";
import {useForm} from "react-hook-form";
import {BackUrl, headers} from "constants/global";
import {useAuth} from "hooks/useAuth";
import {fetchDataToChange} from "slices/dataToChangeSlice";
import {
    changePaymentType, changePaymentTypeDividend, changePaymentTypePayable, fetchAccountantBookKeepingAccountPayable,
    fetchAccountantBookKeepingDividend, fetchAccountantBookKeepingStaffSalary,
    onAddDevidend,
    onAddPayable, onDeleteDividend, onDeletePayable
} from "slices/accountantSlice";
import {useHttp} from "hooks/http.hook";


const optionsPage = [
    "Dividend", "Account payable", "Staff salary"
]


const AccountantBookKeeping = () => {

    const {locations} = useSelector(state => state.locations)


    const [activePage, setActivePage] = useState("Dividend")
    const [loc, setLoc] = useState()


    const dispatch = useDispatch()


    const {dividends, accountPayable} = useSelector(state => state.accountantSlice)

    useEffect(() => {
        dispatch(fetchLocations())
    }, [])


    useEffect(() => {
        if (locations.length > 0) {
            setLoc(locations[0].value)
        }
    }, [locations])


    useEffect(() => {
        if (loc) {
            if ( activePage === "Dividend") {
                dispatch(fetchAccountantBookKeepingDividend(loc));
            } else if (activePage === "Account payable") {
                dispatch(fetchAccountantBookKeepingAccountPayable(loc))
            }
        } else if (activePage === "Staff salary") {
            dispatch(fetchAccountantBookKeepingStaffSalary())
        }
    }, [loc,activePage])


    const renderPage = useCallback(() => {

        switch (activePage) {
            case "Dividend":
                return <Dividend data={dividends} locations={locations}/>
            case "Account payable":
                return <AccountPayable locations={locations} data={accountPayable}/>
            case "Staff salary":
                return <StaffSalary/>
        }
    }, [activePage, dividends, accountPayable, locations])


    return (
        <div className={cls.bookKeeping}>
            <div className={cls.header}>
                <Select title={"Page"} value={activePage} options={optionsPage} onChangeOption={setActivePage}/>
                {
                    (activePage === "Dividend" || activePage === "Account payable") &&
                    <Select value={loc} onChangeOption={setLoc} options={locations}/>
                }
                {/*<Select/>*/}
            </div>
            <div className={cls.wrapper}>
                {renderPage()}
            </div>
        </div>
    );
};


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
                <td>{item.date}</td>
                <td>{item.location}</td>
                <td>
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
                </td>
            </tr>
        ))
    }

    const render = renderData()

    const changePayment = (id, value) => {
        // setActiveChangeModal(false)
        // dispatch(changePaymentType({id: id ,typePayment: value}))
        console.log(id, value)
        console.log(changingData, "changingID")

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


const StaffSalary = () => {



    return (
        <>

            <Table>
                <thead>
                <tr>
                    <th>№</th>
                    <th>Name</th>
                    <th>Surname</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Reason</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>1</td>
                    <td>12</td>
                    <td>12-12-2024</td>
                    <td>Period</td>

                    <td>12 000</td>
                    <th>O'ylik</th>
                </tr>
                </tbody>
            </Table>

        </>
    )
}


const AccountPayable = ({locations, data}) => {

    const status = [
        {name: "Debtor", status: true},
        {name: "Not in debt", status: false}
    ]

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


    const {request} = useHttp()


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
                    <input className="radio" {...register("debtor", {required: true})} type="radio"
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
        return data.map((item, i) => (
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
                </td>

            </tr>
        ))
    }

    const render = renderData()

    const changePayment = (id, value) => {
        // setActiveChangeModal(false)
        // dispatch(changePaymentType({id: id ,typePayment: value}))
        console.log(id, value)
        console.log(changingData, "changingID")

        request(`${BackUrl}crud_account_payable/${changingData.id}`, "POST", JSON.stringify({payment_type_id: value}), headers())
            .then(res => {
                console.log(res)
                dispatch(changePaymentTypePayable({id: id, payment_type: res.payment_type}))

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


        request(`${BackUrl}delete_account_payable/${changingData.id}`, "POST", JSON.stringify(data), headers())
            .then(res => {
                dispatch(onDeletePayable({id: changingData.id}))
                // dispatch(changePaymentType({id: id, payment_type: res.payment_type}))
                // dispatch(onAddDevidend(res.dividend))
                // setAdd(false)
            })

    }


    const onSubmit = (data) => {


        request(`${BackUrl}add_account_payable`, "POST", JSON.stringify({...data, location_id: loc}), headers())
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
                        <InputForm register={register} title={"Amount sum"} name={"amount_sum"}/>
                        <InputForm register={register} title={"Desc"} name={"desc"}/>
                        <InputForm register={register} title={"Date"} type={"date"} name={"date"}/>
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


export default AccountantBookKeeping;