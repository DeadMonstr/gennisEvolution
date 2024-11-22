import React, {useCallback, useEffect, useState} from 'react';


import cls from "./AccountantBookKeeping.module.sass"
import Select from "components/platform/platformUI/select";
import {useDispatch, useSelector} from "react-redux";
import {fetchLocations} from "slices/locationsSlice";
import Table from "components/platform/platformUI/table";
import Modal from "components/platform/platformUI/modal";
import Confirm from "components/platform/platformModals/confirm/confirm";
import ConfimReason from "components/platform/platformModals/confirmReason/confimReason";


const optionsPage = [
    "Dividend", "Account payable", "Staff salary"
]


const AccountantBookKeeping = () => {

    const {locations} = useSelector(state => state.locations)


    const [activePage, setActivePage] = useState("Dividend")
    const [loc, setLoc] = useState()


    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchLocations())
    }, [])


    useEffect(() => {
        if (locations.length > 0) {
            setLoc(locations[0].value)
        }
    }, [locations])


    const renderPage = useCallback(() => {

        switch (activePage) {
            case "Dividend":
                return <Dividend/>
            case "Account payable":
                return <AccountPayable/>
            case "Staff salary":
                return <StaffSalary/>
        }


    }, [activePage])


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


const Dividend = ({data}) => {

    const [activeChangeModal, setActiveChangeModal] = useState(false)
    const [activeChangeModalName, setActiveChangeModalName] = useState("")
    const [activeCheckPassword, setActiveCheckPassword] = useState(false)
    const [changingData, setChangingData] = useState({})
    const {isCheckedPassword} = useSelector(state => state.me)
    const [isConfirm, setIsConfirm] = useState(false)


    const changeModal = (name) => {
        setActiveChangeModalName(name)
        if (!isCheckedPassword) {
            setActiveCheckPassword(true)
        } else {
            setActiveChangeModal(true)
        }
    }

    const changePayment = (id, value) => {
        setActiveChangeModal(false)
    }


    const getConfirmDelete = (data) => {
        const newData = {
            id: changingData.id,
            userId: changingData.userId,
            type: changingData.type,
            ...data
        }


        setActiveChangeModal(false)

    }


    return (
        <>
            <Table>
                <thead>
                <tr>
                    <th>№</th>
                    <th>Amount</th>
                    <th>Payment type</th>
                    <th>Date</th>
                    <th>Location</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>1</td>
                    <td>12 000 000</td>
                    <td
                        onClick={() => {
                            // changeModal("changeTypePayment")
                            // setChangingData({
                            //     id: item.id,
                            //     typePayment: item.typePayment,
                            //     userId: item.user_id,
                            // })

                        }}
                    >
                                    <span
                                        className="typePayment"
                                    >
                                        Cash
                                        {/*{item.typePayment}*/}
                                    </span>
                    </td>
                    <td>12-12-2024</td>
                    <th>Xo'jakent</th>
                </tr>
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
                                    // options={options}
                                    name={""}
                                    title={"Payment turi"}
                                    onChangeOption={changePayment}
                                    id={changingData.id}
                                    defaultValue={changingData.typePayment}
                                />
                            </div>
                        </Modal> : null
            }
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
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Account period</th>
                    <th>Salary</th>
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


const AccountPayable = () => {
    return (
        <>
            <Table>
                <thead>
                <tr>
                    <th>Desc</th>
                    <th>Status</th>
                    <th>Account period</th>
                    <th>Salary</th>
                    <th>Reason</th>
                </tr>
                </thead>
                <tbody>
                <tr>
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


export default AccountantBookKeeping;