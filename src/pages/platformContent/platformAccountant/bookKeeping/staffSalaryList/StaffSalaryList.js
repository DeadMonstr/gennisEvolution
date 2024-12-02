import {useDispatch, useSelector} from "react-redux";
import React, {useState} from "react";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";
import {fetchAccountantBookKeepingStaffSalary} from "slices/accountantSlice";
import Table from "components/platform/platformUI/table";
import cls from "../AccountantBookKeeping.module.sass";
import Modal from "components/platform/platformUI/modal";
import Select from "components/platform/platformUI/select";

const StaffSalary = ({data,isDeleted}) => {

    const {dataToChange} = useSelector(state => state.dataToChange)


    const [activeChangeModal, setActiveChangeModal] = useState(false)
    const [activeChangeModalName, setActiveChangeModalName] = useState("")
    const [activeCheckPassword, setActiveCheckPassword] = useState(false)
    const [changingData, setChangingData] = useState({})

    const {isCheckedPassword} = useSelector(state => state.me)


    const {request} = useHttp()
    const dispatch= useDispatch()


    const changeModal = (name) => {
        setActiveChangeModalName(name)
        if (!isCheckedPassword) {
            setActiveCheckPassword(true)
        } else {
            setActiveChangeModal(true)
        }
    }

    const changePayment = (id, value) => {
        // setActiveChangeModal(false)
        // dispatch(changePaymentType({id: id ,typePayment: value}))

        request(`${BackUrl}update_camp_staff_salary/${id}/${value}`, "POST", null, headers())
            .then(res => {
                console.log(res)
                dispatch(fetchAccountantBookKeepingStaffSalary({isDeleted}))

                // dispatch(onAddDevidend(res.dividend))
                // setAdd(false)
            })

    }

    return (
        <>

            <Table>
                <thead>
                <tr>
                    <th>№</th>
                    <th>Name</th>
                    <th>Surname</th>
                    <th>Amount</th>
                    <th>Paymnet type</th>
                    <th>Date</th>
                    <th>Reason</th>
                </tr>
                </thead>
                <tbody>
                {data.map((item,index) => {
                    return (
                        <tr>
                            <td>{index+1}</td>
                            <td>{item.name}</td>
                            <td>{item.surname}</td>
                            <td>{item.amount_sum}</td>
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
                                        {/*Cash*/}
                                        {item.payment_type_name}
                                    </span>
                            </td>
                            <td>{item.day}</td>
                            <th>{item.reason}</th>
                        </tr>
                    )
                })}

                </tbody>
            </Table>
            {
                activeChangeModalName === "changeTypePayment" && isCheckedPassword ?
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
        </>
    )
}

export default StaffSalary