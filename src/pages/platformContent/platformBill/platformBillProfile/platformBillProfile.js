import {Link, useNavigate, useParams} from "react-router-dom";
import React, {useCallback, useEffect, useState} from "react";

import cls from "../platformBill.module.sass"
import Button from "../../../../components/platform/platformUI/button";
import {useDispatch, useSelector} from "react-redux";
import {
    fetchBill,
    fetchBillProfile,
    fetchDataPayable,
    fetchDataPayables,
    onDeleteBill,
    onEditBill,
    fetchAccountantPayableHistory,
    onAddPayableHistory,
    onDeletePayableHistory,
    onChangePayablePayment,
    onChangeHistoryPayment,
    onAddLeft,
    onAddRight,
    fetchAccountDatas, onDeleteTableData
} from "slices/billSlice";
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
    const {register, handleSubmit, reset, setValue} = useForm()

    const {dataPayable, typeProfile,} = useSelector(state => state.billSlice)
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
        dispatch(fetchAccountDatas(id))
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
                <h2>Nomi : {profile?.name} </h2>

                <div style={{display: "flex", gap: "2rem"}}>
                    <Button
                        type={"submit"}
                        onClickBtn={() => {
                            setActiveModalEdit(true)
                            setValue("name", profile?.name)
                        }}
                    >
                        Edit
                    </Button>
                    <Button type={"danger"} onClickBtn={() => setActiveModal(true)}>Delete</Button>


                </div>


            </div>


            <AccountPayableBill years={dataPayable} locations={locations}/>


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

export const AccountPayableBill = ({years, locations}) => {


    const {id} = useParams()


    const {total_sum,typeProfile} = useSelector(state => state.billSlice)

    const {dataToChange,} = useSelector(state => state.dataToChange)
    const {selectedLocation} = useAuth()
    const dispatch = useDispatch()


    const [deleted, setDeleted] = useState(false)

    const [activeDeleteModal, setActiveDeleteModal] = useState(false)
    const [activeChangeModal, setActiveChangeModal] = useState(false)

    const [changingData, setChangingData] = useState({})

    const [isConfirm, setIsConfirm] = useState(false)
    const [activeBill, setActiveBill] = useState(false)


    useEffect(() => {
        dispatch(fetchBillProfile({id, deleted}))
    },[deleted,id])



    const {request} = useHttp()


    // useEffect(() => {
    //     if (activeBillData) {
    //         dispatch(fetchAccountantPayableHistory({id: activeBillData?.id}))
    //     }
    // }, [activeBillData])

    //
    // useEffect(() => {
    //     if (month && year) {
    //         const monthId = years?.years?.filter(item => item?.value === year)[0]?.months.filter(item => item.month === month)[0]?.id
    //         dispatch(fetchDataPayables({id, monthId, archive, deleted}))
    //
    //     }
    // }, [month, year, deleted, archive])

    useEffect(() => {
        dispatch(fetchDataToChange(selectedLocation))
    }, [])




    const onDeletePayableData = (data) => {





        if (changingData.side === "left") {
            request(`${BackUrl}${typeProfile === "receivable" ? "delete_account_payable" : "delete_history"}/${changingData.item.id}/`, "DELETE", JSON.stringify(data), headers())
                .then(res => {
                    dispatch(onDeleteTableData({id: changingData.item.id,side: "left"}))
                    dispatch(fetchAccountDatas(id))


                    setActiveDeleteModal(false)
                })
                .catch(err => {
                    console.log(err)
                })
        } else {
            request(`${BackUrl}${typeProfile === "receivable" ? "delete_history" : "delete_account_payable"}/${changingData.item.id}/`, "DELETE", JSON.stringify(data), headers())
                .then(res => {
                    dispatch(onDeleteTableData(({id: changingData.item.id, side: "right"})))
                    dispatch(fetchAccountDatas(id))

                    setActiveDeleteModal(false)

                })
                .catch(err => {
                    console.log(err)
                })
        }





    }

    const ChangePayment = (id) => {

        if (changingData.side === "left") {
            request(`${BackUrl}${typeProfile === "receivable" ? "crud_account_payable" : "crud_history"}/${changingData.item.id}/`, "POST", JSON.stringify({payment_type_id: Number(id)}), headers())
                .then(res => {
                    setActiveChangeModal(false)
                    dispatch(onChangePayablePayment({id: changingData.item.id, data: res.payment_type, side: "left"}))
                })
                .catch(err => {
                    console.log(err)
                })
        } else {
            request(`${BackUrl}${typeProfile === "receivable" ? "crud_history" : "crud_account_payable"}/${changingData.item.id}/`, "POST", JSON.stringify({payment_type_id: Number(id)}), headers())
                .then(res => {
                    setActiveChangeModal(false)
                    dispatch(onChangePayablePayment({id: changingData.item.id, data: res.history, side: "right"}))
                })
                .catch(err => {
                    console.log(err)
                })
        }





    }

    return (
        <div className={cls.bill}>


            <div className={cls.billFilter}>
                <h1>{total_sum}</h1>
                <Button
                    active={deleted}
                    onClickBtn={() => setDeleted(!deleted)}
                    type={"danger"}
                >
                    Deleted
                </Button>


                {/*<Select value={year} options={years?.years} onChangeOption={setYear}/>*/}
                {/*<Select*/}
                {/*    value={month}*/}
                {/*    options={years?.years?.filter(item => item?.value === year)[0]?.months.map(itemMonth => itemMonth.month)}*/}
                {/*    onChangeOption={setMonth}*/}
                {/*/>*/}
                {/*<div className={cls.plus} onClick={() => setAdd(true)}>*/}
                {/*    <i className="fas fa-plus"></i>*/}
                {/*</div>*/}
            </div>


            <div className={cls.tables}>


                <Left
                    setActiveChangeModal={setActiveChangeModal}
                    setActiveDeleteModal={setActiveDeleteModal}
                    setChangingData={setChangingData}
                />
                <Right
                    setActiveChangeModal={setActiveChangeModal}
                    setActiveDeleteModal={setActiveDeleteModal}
                    setChangingData={setChangingData}
                />


            </div>


            <Modal activeModal={activeDeleteModal} setActiveModal={() => setActiveChangeModal(!setActiveDeleteModal)}>
                <Confirm
                    setActive={activeDeleteModal}
                    text={"O'chirishni xohlaysizmi ?"}
                    getConfirm={setIsConfirm}
                />
            </Modal>
            {
                isConfirm === "yes" ?
                    <Modal
                        activeModal={activeDeleteModal}
                        setActiveModal={() => {
                            setActiveDeleteModal(false)
                            setIsConfirm(false)
                        }}
                    >
                        <ConfimReason getConfirm={onDeletePayableData} reason={true}/>
                    </Modal> : null
            }


            <Modal activeModal={activeChangeModal} setActiveModal={setActiveChangeModal}>

                <div className={cls.change}>
                    <Select value={changingData?.item?.payment_type?.id} options={dataToChange?.payment_types} onChangeOption={ChangePayment}/>
                </div>


            </Modal>


        </div>
    )
}

const Left = ({setChangingData,setActiveDeleteModal,setActiveChangeModal}) => {


    const {id} = useParams()

    const {typeProfile, total_left, dataAccount} = useSelector(state => state.billSlice)


    const [addDb, setAddDb] = useState(false)
    const {register, handleSubmit, setValue, reset} = useForm()
    const {dataToChange} = useSelector(state => state.dataToChange)


    const {request} = useHttp()
    const dispatch = useDispatch()

    const onSubmitDb = (data) => {

        request(`${BackUrl}${typeProfile === "receivable" ? "add_account_payable" : "create_payable_history"}`, "POST", JSON.stringify({
            ...data,
            account_id: id,
            status: data.status === "true"
        }), headers())
            .then(res => {
                setAddDb(false)
                reset()
                dispatch(fetchAccountDatas(id))
                dispatch(onAddLeft(res.data))
            })
    }

    const renderPayableData = () => {
        return dataAccount?.left?.map((item, i) => (
            <>
                <tr>
                    <td>{i + 1}</td>
                    <td>{item.amount}</td>
                    <td>{item.desc}</td>
                    <td>{item.date}</td>
                    <td
                        onClick={() => {
                            setChangingData({item, side:"left"})
                            setActiveChangeModal(true)
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
                            !item.deleted &&
                            <span
                                onClick={() => {
                                    setActiveDeleteModal(true)

                                    setChangingData({item, side: "left"})
                                }}
                                className={cls.delete}
                            >
                                <i className="fas fa-times"/>
                            </span>
                        }
                    </td>


                </tr>

            </>

        ))
    }


    const renderPayable = renderPayableData()

    const renderPaymentType = useCallback((register) => {
        return dataToChange?.payment_types?.map((item, i) => {
            return (
                <label key={i} className="radioLabel" htmlFor="">
                    <input required className="radio" {...register("type_payment", {required: true})} type="radio"
                           value={item.id}/>
                    <span>{item.name}</span>
                </label>
            )
        })
    }, [dataToChange?.payment_types])


    return (
        <>
            <div className={cls.item}>
                <div className={cls.item_header}>
                    <h1>{typeProfile === "payable" ? "Db" : "Kr"}</h1>
                    <h2>{total_left}</h2>
                    <div className={cls.plus} onClick={() => setAddDb(true)}>
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
                        <th></th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {renderPayable}
                    </tbody>
                </Table>

            </div>

            <Modal activeModal={addDb} setActiveModal={() => setAddDb(false)}>
                <div className={cls.add}>
                    <Form typeSubmit={"hand"} onSubmit={handleSubmit(onSubmitDb)}>
                        <InputForm required register={register} type={"number"} title={"Amount sum"}
                                   name={"amount_sum"}/>
                        <InputForm required register={register} title={"Desc"} name={"desc"}/>
                        <InputForm required register={register} title={"Date"} type={"date"} name={"date"}/>
                        {/*<div className={cls.debtor_type}>*/}
                        {/*    {renderDebtType()}*/}
                        {/*</div>*/}

                        <div className={cls.payment_type}>
                            {renderPaymentType(register)}
                        </div>

                        <Button type={"submit"}>Submit</Button>
                    </Form>
                </div>
            </Modal>
        </>


    )
}

const Right = ({setChangingData,setActiveDeleteModal,setActiveChangeModal}) => {

    const {id} = useParams()
    const {typeProfile, total_right, dataAccount} = useSelector(state => state.billSlice)


    const [addKr, setAddKr] = useState(false)
    const {register, handleSubmit, setValue, reset} = useForm()
    const {dataToChange} = useSelector(state => state.dataToChange)


    const {request} = useHttp()
    const dispatch = useDispatch()


    const onSubmitKr = (data) => {
        request(`${BackUrl}${typeProfile === "receivable" ? "create_payable_history" : "add_account_payable"}`, "POST", JSON.stringify({
            ...data,
            account_id: id,
            status: data.status === "true"
        }), headers())
            .then(res => {
                setAddKr(false)
                reset()
                dispatch(fetchAccountDatas(id))
                dispatch(onAddRight(res.data))
            })
    }

    const renderReceivableData = () => {
        return dataAccount?.right?.map((item, i) => (
            <>
                <tr>
                    <td>{i + 1}</td>
                    <td>{item.amount}</td>
                    <td>{item.desc}</td>
                    <td>{item.date}</td>
                    <td
                        onClick={ () => {
                            setChangingData({item, side:"right"})
                            setActiveChangeModal(true)
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
                            !item.deleted &&
                            <span
                                onClick={() => {
                                    setActiveDeleteModal(true)
                                    setChangingData({item,side:"right"})
                                }}
                                className={cls.delete}
                            >
                                <i className="fas fa-times"/>
                            </span>
                        }
                    </td>


                </tr>

            </>

        ))
    }


    const renderReceivable = renderReceivableData()


    const renderPaymentType = useCallback((register) => {
        return dataToChange?.payment_types?.map((item, i) => {
            return (
                <label key={i} className="radioLabel" htmlFor="">
                    <input required className="radio" {...register("type_payment", {required: true})} type="radio"
                           value={item.id}/>
                    <span>{item.name}</span>
                </label>
            )
        })
    }, [dataToChange?.payment_types])


    return (
        <>

            <div className={cls.item}>
                <div className={cls.item_header}>
                    <h1>{typeProfile === "receivable" ? "Db" : "Kr"}</h1>
                    <h2>{total_right}</h2>
                    <div className={cls.plus} onClick={() => setAddKr(true)}>
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
                        <th></th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {renderReceivable}
                    </tbody>
                </Table>

            </div>


            <Modal activeModal={addKr} setActiveModal={() => setAddKr(false)}>
                <div className={cls.add}>
                    <Form typeSubmit={"hand"} onSubmit={handleSubmit(onSubmitKr)}>
                        <InputForm required register={register} type={"number"} title={"Amount sum"}
                                   name={"amount_sum"}/>
                        <InputForm required register={register} title={"Desc"} name={"desc"}/>
                        <InputForm required register={register} title={"Date"} type={"date"} name={"date"}/>


                        <div className={cls.payment_type}>
                            {renderPaymentType(register)}
                        </div>

                        <Button type={"submit"}>Submit</Button>
                    </Form>
                </div>
            </Modal>
        </>

    )
}


export default PlatformBillProfile;