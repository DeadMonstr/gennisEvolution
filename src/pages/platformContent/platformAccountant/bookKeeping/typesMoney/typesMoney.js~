import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {fetchAccountantDate} from "slices/accountantSlice";

import cls from "./typesMoney.module.sass"
import Select from "components/platform/platformUI/select";
import {fetchDataToChange} from "slices/dataToChangeSlice";
import Button from "components/platform/platformUI/button";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";
import Table from "components/platform/platformUI/table";


const TypesMoney = () => {


    const {date} = useSelector(state => state.accountantSlice)
    const {locations} = useSelector(state => state.locations)
    const {dataToChange} = useSelector(state => state.dataToChange)


    const [activeFilter,setActiveFilter] = useState("")
    const [year,setYear] = useState("")
    const [data,setData] = useState()



    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchAccountantDate())
        dispatch(fetchDataToChange())
    },[])


    useEffect(() => {
        if (date.length)
        setYear(date[0].value)
    },[date])



    const renderTypes = useCallback(() => {
        if (dataToChange) {
            return dataToChange?.payment_types?.map(item => {
                return (
                    <Button
                        name={item.id}
                        onClickBtn={setActiveFilter}
                        active={item.id === activeFilter}
                    >
                        {item.name}
                    </Button>
                )
            })
        }
    }, [activeFilter, dataToChange])


    const {request} = useHttp()



    useEffect(() => {

        if (year && activeFilter) {
            const data = {
                year_id: year,
                payment_type_id: activeFilter
            }

            request(`${BackUrl}account_report_filter/`, "POST", JSON.stringify(data), headers())
                .then(res => {
                    setData(res.account_reports)
                })
        }

    },[activeFilter,year])

    return (
        <div className={cls.types} >

            <div className={cls.header}>
                <div>
                    {renderTypes()}
                </div>
                <div>
                    <Select value={year} onChangeOption={setYear} options={date}/>
                </div>
            </div>
            <div className={cls.wrapper}>

                <Table>
                    <thead>
                        <tr>
                            <th>№</th>
                            <th>Balance</th>
                            <th>All dividend</th>
                            <th>All Overheads</th>
                            <th>All salaries</th>
                            <th>Date</th>
                            <th>Payment type</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        data?.map((item,index) => {
                            return (
                                <tr>
                                    <td>{index + 1}</td>
                                    <td>{item.balance}</td>
                                    <td>{item.all_dividend}</td>
                                    <td>{item.all_overheads}</td>
                                    <td>{item.all_salaries}</td>
                                    <td>{item.date}</td>
                                    <td>{item.payment_type_name}</td>
                                </tr>
                            )
                        })
                    }

                    </tbody>


                </Table>
            </div>




        </div>
    );
};

export default TypesMoney;