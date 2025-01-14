import React, {useCallback, useEffect, useState} from 'react';


import cls from "./AccountantBookKeeping.module.sass"
import Select from "components/platform/platformUI/select";
import {useDispatch, useSelector} from "react-redux";
import {fetchLocations} from "slices/locationsSlice";

import Button from "components/platform/platformUI/button";

import {
    fetchAccountantBookKeepingAccountPayable,
    fetchAccountantBookKeepingDividend, fetchAccountantBookKeepingOverhead,
    fetchAccountantBookKeepingStaffSalary, fetchAccountantBookKeepingTypesMoney, fetchAccountantInvestment,
} from "slices/accountantSlice";


import StaffSalary from "./staffSalaryList/StaffSalaryList";
import AccountPayable from "./accountPayable/AccountPayable";
import Dividend from "./dividend/Dividend";
import OverheadAccount from "./overhead/OverheadAccount";
import {Link, useNavigate} from "react-router-dom";
import InvesmentAccount from "pages/platformContent/platformAccountant/bookKeeping/invesmentAccount/invesmentAccount";


const optionsPage = [
    "Dividend",
    "Staff salary",
    "Overhead",
    "Investments"
]


const AccountantBookKeeping = () => {

    const {locations} = useSelector(state => state.locations)


    const [activePage, setActivePage] = useState("Dividend")
    const [isDeleted, setIsDeleted] = useState(false)
    const [isArchive, setIsArchive] = useState(false)

    useEffect(() => {
        const active = localStorage.getItem("activePageType")
        setActivePage(active)
    },[])


    const dispatch = useDispatch()


    const {
        dividends,
        accountPayable,
        staffSalary,
        overhead,
        typesMoney,

    } = useSelector(state => state.accountantSlice)

    useEffect(() => {
        dispatch(fetchLocations())
        dispatch(fetchAccountantBookKeepingTypesMoney())
    }, [])
    
    const onChangePage = (activePage) => {

        localStorage.setItem("activePageType", activePage)
        setActivePage(activePage)
    }




    useEffect(() => {
        if (activePage === "Dividend") {
            dispatch(fetchAccountantBookKeepingDividend({isDeleted, isArchive}));
        } else if (activePage === "Staff salary") {
            dispatch(fetchAccountantBookKeepingStaffSalary({isDeleted, isArchive}))
        } else if (activePage === "Overhead") {
            dispatch(fetchAccountantBookKeepingOverhead({isDeleted, isArchive}))
        } else if (activePage === "Investments") {
            dispatch(fetchAccountantInvestment({isDeleted, isArchive}))
        }
    }, [activePage, isDeleted, isArchive])


    const renderPage = useCallback(() => {

        switch (activePage) {
            case "Dividend":
                return <Dividend data={dividends} locations={locations}/>
            case "Staff salary":
                return <StaffSalary data={staffSalary} isDeleted={isDeleted}/>
            case "Overhead":
                return <OverheadAccount data={overhead}/>
            case "Investments":
                return <InvesmentAccount locations={locations}/>
        }
    }, [activePage, dividends, accountPayable, locations, staffSalary, overhead])


    const renderTypesMoney = () => {
        return (
            <Link to={'../typesMoney'}>
                <div className={cls.typesMoney}>
                    {typesMoney.map(item => {
                        return (
                            <div className={cls.typesMoney__item}>
                                <span>{item.payment_type_name}</span>
                                <span> {item.balance.toLocaleString()}</span>

                            </div>
                        )
                    })}
                </div>
            </Link>

        )
    }


    return (
        <div className={cls.bookKeeping}>
            <div className={cls.header}>
                <div>
                    {renderTypesMoney()}
                </div>
                <div>
                    <Select title={"Page"} value={activePage} options={optionsPage} onChangeOption={onChangePage}/>
                    {/*{*/}
                    {/*    (activePage === "Dividend" || activePage === "Account payable") &&*/}
                    {/*    <Select value={loc} onChangeOption={setLoc} options={locations}/>*/}
                    {/*}*/}
                    <Button type={"danger"} active={isDeleted}
                            onClickBtn={() => setIsDeleted(!isDeleted)}>Deleted</Button>
                    <Button type={"warning"} active={isArchive}
                            onClickBtn={() => setIsArchive(!isArchive)}>Archive</Button>
                    <Link to={"../collectionAccount"}>
                        <Button type={"submit"}>
                            Inkasatsiya
                        </Button>
                    </Link>
                    <Link to={"../otchotAccount"}>
                        <Button type={"submit"}>
                            Otchot
                        </Button>
                    </Link>
                </div>

            </div>
            <div className={cls.wrapper}>
                {renderPage()}
            </div>
        </div>
    );
};


export default AccountantBookKeeping;