import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {NavLink, useParams} from "react-router-dom";
import AccountingTable from "components/platform/platformUI/tables/accountingTable";
import {useDispatch, useSelector} from "react-redux";


import cls from "./StaffMonth.module.sass"
import Modal from "components/platform/platformUI/modal";
import CheckPassword from "components/platform/platformModals/checkPassword/CheckPassword";
import {useForm} from "react-hook-form";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers, ROLES} from "constants/global";
import {fetchDataToChange} from "slices/dataToChangeSlice";
import {fetchEmployeeSalaryMonth, changePaymentType, fetchDeletedEmployeeSalaryMonth} from "slices/teacherSalarySlice";
import Button from "components/platform/platformUI/button";
import LocationMoneys from "pages/platformContent/platformAccounting/locationMoneys/locationMoneys";
import RequireAuthChildren from "components/requireAuthChildren/requireAuthChildren";
import {useAuth} from "hooks/useAuth";
import Select from "components/platform/platformUI/select";
import Table from "components/platform/platformUI/table";
import {fetchAccountantStaffSalaryMonthInside} from "slices/accountantSlice";
import Confirm from "components/platform/platformModals/confirm/confirm";
import ConfimReason from "components/platform/platformModals/confirmReason/confimReason";

const StaffMonth = () => {

    const {monthId, userId} = useParams()
    const dispatch = useDispatch()

    const {staffSalaryMonth} = useSelector(state => state.accountantSlice)
    const {isCheckedPassword} = useSelector(state => state.me)

    const [activeDelete, setActiveDelete] = useState(false)
    const [activeChangeModal, setActiveChangeModal] = useState(false)
    const [activeChangeModalName, setActiveChangeModalName] = useState("")
    const [activeCheckPassword, setActiveCheckPassword] = useState(false)
    const [changingData, setChangingData] = useState({})
    const [isConfirm, setIsConfirm] = useState(false)



    const {dataToChange} = useSelector(state => state.dataToChange)



    useEffect(() => {
        const data = {
            monthId,
            activeDelete
        }

        dispatch(fetchAccountantStaffSalaryMonthInside(data))

    }, [activeDelete, dispatch, monthId])


    useEffect(() => {
        dispatch(fetchDataToChange())
    }, [])


    const deleteSalary = (data) => {
        const {id} = changingData

        request(`${BackUrl}delete_camp_staff_salary/${id}`, "DELETE", JSON.stringify(data),headers())
            .then(res => {
                if (res.success) {
                    const data = {
                        monthId,
                        activeDelete
                    }
                    dispatch(fetchAccountantStaffSalaryMonthInside(data))
                }
            })
        setActiveDelete(false)
        setActiveChangeModal(false)

    }

    const changePaymentTypeData = (id, value) => {


        request(`${BackUrl}update_camp_staff_salary/${id}/${value}`, "POST", null, headers())
            .then(res => {
                if (res.success) {
                    const data = {
                        monthId,
                        activeDelete
                    }
                    dispatch(fetchAccountantStaffSalaryMonthInside(data))
                }
            })
    }


    useEffect(() => {
        if (isCheckedPassword && activeChangeModalName) {
            setActiveCheckPassword(false)
            setActiveChangeModal(true)
        }
    }, [activeChangeModalName, isCheckedPassword])

    const {request} = useHttp()


    const changeModal = (name) => {
        setActiveChangeModalName(name)
        if (!isCheckedPassword) {
            setActiveCheckPassword(true)
        } else {
            setActiveChangeModal(true)
        }
    }




    return (
        <>
            <div className={cls.locationMonths}>
                <header>
                    <div>
                        <h1>Oy: {staffSalaryMonth?.month}</h1>
                        <h1>Qolgan oylik: {staffSalaryMonth?.residue}</h1>
                        <h1>Olingan oylik: {staffSalaryMonth?.taken_salary}</h1>
                    </div>
                    <div>

                        <div
                            onClick={() => changeModal("payment")}
                            className={cls.payment}
                        >
                            <i className="fas fa-dollar-sign"/>
                        </div>
                    </div>
                </header>
                <div className={cls.subheader}>
                    <Button active={activeDelete} onClickBtn={() => setActiveDelete(!activeDelete)}>
                        O'chirilgan oyliklar
                    </Button>
                </div>
                <main>

                    <Table>
                        <thead>
                        <tr>
                            <th/>
                            <th>Зарплата</th>
                            <th>Причина</th>
                            <th>Tип</th>
                            <th>Дата</th>
                            <th>Удалять</th>
                        </tr>
                        </thead>
                        <tbody>


                            {
                                staffSalaryMonth?.data?.map((item, index) => {
                                    return (
                                        <tr>
                                            <td>{index + 1}</td>
                                            <td>{item.amount_sum}</td>
                                            <td>{item.reason}</td>
                                            <td
                                                onClick={() => {
                                                    if (item.payment_type_name) {
                                                        changeModal("changeTypePayment")
                                                        setChangingData({id: item.id, typePayment: item.payment_type_id})
                                                    }
                                                }}
                                            >
                                                {
                                                    item.payment_type_name ?
                                                        <span
                                                            className={cls.typePayment}
                                                        >
                                                        {item.payment_type_name}
                                                    </span> : null
                                                }
                                            </td>

                                            <td>{item.day}</td>

                                            <td>
                                                {
                                                    !item.status ?
                                                        <span
                                                            onClick={() => {
                                                                changeModal("deletePayment")
                                                                setChangingData({
                                                                    id: item.id,
                                                                    msg: "Oylikni ochirishni hohlaysizmi"
                                                                })
                                                            }}
                                                            key={index}
                                                            className={cls.delete}
                                                        >
                                                        <i className="fas fa-times"/>
                                                    </span> : null
                                                }
                                            </td>
                                        </tr>
                                    )
                                })
                            }



                        </tbody>
                    </Table>

                </main>

                <Modal activeModal={activeCheckPassword} setActiveModal={() => setActiveCheckPassword(false)}>
                    <CheckPassword/>
                </Modal>
                {
                    activeChangeModalName === "payment" && isCheckedPassword ?
                        <Modal activeModal={activeChangeModal} setActiveModal={() => setActiveChangeModal(false)}>
                            <PaymentModal
                                setActiveChangeModal={setActiveChangeModal}
                                userId={userId}
                                salary={staffSalaryMonth.exist_salary}
                                monthId={monthId}
                            />
                        </Modal>
                        : activeChangeModalName === "deletePayment" && isCheckedPassword ?
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
                                            <ConfimReason getConfirm={deleteSalary} reason={true}/>
                                        </Modal> : null
                                }
                            </>
                            : activeChangeModalName === "changeTypePayment" && isCheckedPassword ?
                                <Modal activeModal={activeChangeModal} setActiveModal={() => setActiveChangeModal(false)}>
                                    <div className={cls.changeTypePayment}>
                                        <Select
                                            options={dataToChange.payment_types}
                                            name={""}
                                            title={"Payment turi"}
                                            onChangeOption={changePaymentTypeData}
                                            id={changingData.id}
                                            defaultValue={changingData.typePayment}
                                        />
                                    </div>
                                </Modal> : null
                }

            </div>
        </>

    );
};


const PaymentModal = ({monthId, salary, setActiveChangeModal, userId}) => {

    const {dataToChange} = useSelector(state => state.dataToChange)
    const [day, setDay] = useState(null)
    const [month, setMonth] = useState(null)

    console.log(dataToChange)

    const {
        register,
        formState: {
            errors,
            isValid,
            isDirty
        },
        handleSubmit,
        reset,
    } = useForm({
        mode: "onBlur"
    })


    const {request} = useHttp()
    const dispatch = useDispatch()

    const onSubmit = (data) => {

        const newData = {
            ...data,
            month,
            day
        }


        request(`${BackUrl}/camp_staff_salary/${monthId}`, "POST", JSON.stringify(newData), headers())
            .then(res => {
                if (res.success) {
                    reset()
                    setActiveChangeModal(false)
                    const data = {
                        monthId,
                        activeDelete: false
                    }
                    dispatch(fetchAccountantStaffSalaryMonthInside(data))
                }
            })
    }

    const renderPaymentType = useCallback(() => {
        return dataToChange?.payment_types?.map(item => {
            return (
                <label className="radioLabel" htmlFor="">
                    <input className="radio" {...register("typePayment", {required: true})} type="radio"
                           value={item.id}/>
                    <span>{item.name}</span>
                </label>
            )
        })
    }, [dataToChange, register])


    const renderDate = useCallback(() => {
        return dataToChange?.data_days?.map((item, index) => {
            if (item.value === month) {
                return (
                    <div className={cls.date__item} key={index}>
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
    }, [dataToChange?.data_days, month, day])


    const renderedDays = renderDate()

    const renderedPaymentTypes = renderPaymentType()

    return (
        <div className={cls.paymentModal}>
            <form action="" onSubmit={handleSubmit(onSubmit)}>
                <h1>Oylik</h1>
                <div>
                    {renderedPaymentTypes}
                </div>
                <label htmlFor="reason">
                    <div>
                        <span className="name-field">Sabab</span>
                        <input
                            defaultValue={""}
                            id="reason"
                            className="input-fields"
                            {...register("reason", {
                                required: "Iltimos to'ldiring",
                            })}
                        />
                    </div>
                    {
                        errors?.reason &&
                        <span className="error-field">
                            {errors?.reason?.message}
                        </span>
                    }
                </label>
                <label htmlFor="payment">
                    <div>
                        <span className="name-field">To'lov miqdori</span>
                        <input
                            defaultValue={""}
                            id="payment"
                            type="number"
                            className="input-fields"
                            {...register("payment", {
                                required: "Iltimos to'ldiring",

                                max: {
                                    value: salary,
                                    message: `${salary} dan ko'p pul kiritish mumkin emas`
                                },
                                min: {
                                    value: 0,
                                    message: `0 dan kam pul kiritish mumkin emas`
                                }
                            })}
                        />
                    </div>
                    {
                        errors?.payment &&
                        <span className="error-field">
                            {errors?.payment?.message}
                        </span>
                    }
                </label>

                {
                    dataToChange?.data_days?.length >= 2 ?
                        <Select
                            name={"month"}
                            title={"Oy"}
                            defaultValue={month}
                            onChangeOption={setMonth}
                            options={dataToChange?.data_days}
                        /> :
                        null
                }

                {renderedDays}

                <input disabled={!isDirty || !isValid} className="input-submit" type="submit" value="Tasdiqlash"/>

            </form>
        </div>
    )
}

export default StaffMonth;