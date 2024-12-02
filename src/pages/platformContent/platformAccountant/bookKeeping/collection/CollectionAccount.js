import React, {useCallback, useEffect, useState} from 'react';
import {Link, useParams} from "react-router-dom";
import classNames from "classnames";
import AccountingTable from "components/platform/platformUI/tables/accountingTable";


import "./collection.sass"
import Button from "components/platform/platformUI/button";
import {useDispatch, useSelector} from "react-redux";
import {useHttp} from "hooks/http.hook";
import {fetchCollection} from "slices/accountingSlice";
import {fetchDataToChange} from "slices/dataToChangeSlice";
import {useAuth} from "hooks/useAuth";
import {fetchLocations} from "slices/locationsSlice";
import Select from "components/platform/platformUI/select";
import Table from "components/platform/platformUI/table";
import cls from "pages/platformContent/platformAccountant/bookKeeping/AccountantBookKeeping.module.sass";
import {fetchAccountantBookKeepingCollection} from "slices/accountantSlice";

const Collection = () => {

    const [activeRoute, setActiveRoute] = useState("dividend")
    const [activeFilter, setActiveFilter] = useState("cash")
    const [location, setLocation] = useState(null)
    const [date, setDate] = useState({
        ot: "",
        do: ""
    })


    const {collection} = useSelector(state => state.accountantSlice)
    const {dataToChange} = useSelector(state => state.dataToChange)
    const {locations} = useSelector(state => state.locations)


    useEffect(() => {
        dispatch(fetchDataToChange())
        dispatch(fetchLocations())
    }, [])


    useEffect(() => {
        if (locations.length) {
            setLocation(locations[0].value)
        }
    }, [locations])


    // useEffect(() => {
    //     const keys = Object.keys(collection?.data)
    //     // eslint-disable-next-line array-callback-return
    //     keys?.map(item => {
    //         if (item === activeRoute) {
    //             setAccountingData(collection.data[item].list)
    //             setDataResult(collection.data[item].value)
    //         }
    //     })
    // },[activeRoute, collection?.data])


    const changeDate = (e) => {
        setDate({
            ...date,
            [e.target.name]: e.target.value
        })
    }

    const renderTables = useCallback(() => {
        console.log(collection,activeRoute)

        if (activeRoute === "dividend") {
            return (
                <>
                    <h1>{collection.all_dividend}</h1>

                    <DividendTable data={collection.dividends}/>

                </>
            )
        }
        // if (activeRoute === "accountPayable") {
        //     return (
        //         <>
        //             <h1>{collection.all_dividend}</h1>
        //             <AccountingTable
        //                 typeOfMoney={"user"}
        //                 studentAtt={true}
        //                 activeRowsInTable={activeRowsInTableEmployeeSalary}
        //                 users={accountingData}
        //             />
        //         </>
        //
        //     )
        // }
        if (activeRoute === "staffSalary") {
            return (
                <>
                    <h1>{collection.all_salary}</h1>

                    <StaffSalaryTable data={collection.salaries}/>

                </>
            )
        }


        if (activeRoute === "overheads") {
            return (
                <>
                    <h1>{collection.all_overheads}</h1>
                    <OverheadTable data={collection.overheads}/>
                </>
            )
        }
    }, [activeRoute, collection])


    const {request} = useHttp()

    useEffect(() => {
        if (location &&( date.ot && date.do) && activeFilter) {
            const newData = {
                location,
                date,
                activeFilter
            }
            dispatch(fetchAccountantBookKeepingCollection(newData))
        }

    }, [activeFilter, date, location])


    const renderTypes = useCallback(() => {
        if (dataToChange) {
            return dataToChange?.payment_types?.map(item => {
                return (
                    <Button
                        name={item.name}
                        onClickBtn={setActiveFilter}
                        active={item.name === activeFilter}
                    >
                        {item.name}
                    </Button>
                )
            })
        }
    }, [activeFilter, dataToChange])


    const dispatch = useDispatch()


    return (
        <div className="collection">
            <header>
                <div>
                    <Link to={-1} className="backBtn">
                        <i className="fas fa-arrow-left"/>
                        Ortga
                    </Link>
                </div>
                <div>
                    <Select options={locations} value={location} onChangeOption={setLocation}/>
                    <form className="changeDate">
                        <input
                            name="ot"
                            type="date"
                            className="input-fields"
                            onChange={changeDate}
                            value={date?.ot}
                        />

                        <input
                            name="do"
                            type="date"
                            className="input-fields"
                            onChange={changeDate}
                            value={date?.do}
                        />
                    </form>
                </div>
            </header>
            <div className="subheader">
                {renderTypes()}
            </div>
            <div className="subheader">
                <h1>{collection?.result}</h1>
            </div>
            <main>
                {/*<h1 className="studentAtt__title">{data.name} attendance Hamma bali: {data.totalBall}</h1>*/}
                <div className="collection__btns">
                    <div
                        onClick={() => setActiveRoute("dividend")}
                        className={classNames("collection__btns-item", {
                            active: activeRoute === "dividend"
                        })}
                    >
                        Dividend
                    </div>

                    {/*<div*/}
                    {/*    onClick={() => setActiveRoute("accountPayable")}*/}
                    {/*    className={classNames("collection__btns-item", {*/}
                    {/*        active: activeRoute === "accountPayable"*/}
                    {/*    })}*/}
                    {/*>*/}
                    {/*    Account Payable*/}
                    {/*</div>*/}

                    <div
                        onClick={() => setActiveRoute("staffSalary")}
                        className={classNames("collection__btns-item", {
                            active: activeRoute === "staffSalary"
                        })}
                    >
                        Ishchilar oyliklari
                    </div>
                    <div
                        onClick={() => setActiveRoute("overheads")}
                        className={classNames("collection__btns-item", {
                            active: activeRoute === "overheads"
                        })}
                    >
                        Qo'shimcha xarajatlar
                    </div>

                </div>

                <div className="collection__container">
                    {renderTables()}
                </div>
            </main>
        </div>
    );
};


const DividendTable = ({data}) => {
    return (
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
            {data?.map((item, index) => {
                return (
                    <tr>
                        <td>{index + 1}</td>
                        <td>{item.amount}</td>
                        <td>
                            <span
                                className={cls.typePayment}
                            >
                                {item.payment_type_name}
                            </span>
                        </td>
                        <td>{item.date}</td>
                        <td>{item.location}</td>
                    </tr>
                )
            })}
            </tbody>


        </Table>
    )
}


const AccountPayableTable = ({data}) => {
    return (
        <Table>
            <thead>
            <tr>
                <th>№</th>
                <th>Amount</th>
                <th>Desc</th>
                <th>Date</th>
                <th>Payment type</th>
            </tr>
            </thead>
            <tbody>
            {
                data?.map((item, index) => {
                    return (
                        <tr>
                            <td>{index + 1}</td>
                            <td>{item.amount}</td>
                            <td>{item.desc}</td>
                            <td>{item.date}</td>
                            <td>
                                <span
                                    className={cls.typePayment}
                                >
                                    {item.payment_type.name}
                                </span>
                            </td>
                            <td>
                                {
                                    item.debtor === true ?
                                        <i className={`fa fa-check ${cls.item_check}`}/> :
                                        <i className={`fa fa-times ${cls.item_false}`}/>
                                }
                            </td>
                        </tr>
                    )
                })
            }
            </tbody>


        </Table>
    )
}


const StaffSalaryTable = ({data}) => {
    return (
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
                {data?.map((item,index) => {
                    return (
                        <tr>
                            <td>{index+1}</td>
                            <td>{item.name}</td>
                            <td>{item.surname}</td>
                            <td>{item.amount_sum}</td>
                            <td>
                                <span
                                    className={cls.typePayment}
                                >

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
    )
}

const OverheadTable = ({data}) => {
    return (
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
                {data?.map((item,index) => {
                    return (
                        <tr>
                            <td>{index + 1}</td>
                            <td>{item.amount_sum}</td>
                            <td>
                                <span
                                    className={cls.typePayment}
                                >
                                    {item.payment_type_name}
                                </span>
                            </td>
                            <td>{item.day}</td>
                            <td>{item.reason}</td>
                        </tr>
                    )
                })}
            </tbody>


        </Table>
    )
}
export default Collection;