import React, {useEffect, useMemo, useState} from 'react';
import {Link, NavLink, Outlet, Route, Routes, useNavigate, useParams} from "react-router-dom";

import cls from "./staffSalary.module.sass"

import {useDispatch, useSelector} from "react-redux";
import {fetchLocations} from "slices/locationsSlice";
import {BackUrl, headers} from "constants/global";
import {useHttp} from "hooks/http.hook";

import AccountingTable from "components/platform/platformUI/tables/accountingTable";
import {fetchAccountantStaffSalaryMonths} from "slices/accountantSlice";
import Table from "components/platform/platformUI/table";





const StaffSalary = () => {

    const {userId} = useParams()



    const {staffSalaryMonths} = useSelector(state => state.accountantSlice)


    const dispatch = useDispatch()


    useEffect(() => {
        const data = {
            userId,
        }
        dispatch(fetchAccountantStaffSalaryMonths(data))
    },[ userId])



    const extraInfo = {
        userId
    }


    const navigate = useNavigate()
    const LinkToMonthStaff = (id) => {
        navigate(`../../staffSalaryMonth/${id}`)
    }



    return (
        <section className={cls.teacherLocations}>
            <main>
                <div className={cls.locationSalary}>

                    <Table>
                        <thead>
                        <tr>
                            <th/>
                            <th>Sana</th>
                            <th>Oylik</th>
                            <th>Qolgan</th>
                            <th>Olingan oylik</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            staffSalaryMonths.map((item,index) => {
                                return (
                                    <tr onClick={() => LinkToMonthStaff(item.id)}>
                                        <td>{index+1}</td>
                                        <td>{item.date}</td>
                                        <td>{item.salary}</td>
                                        <td>{item.residue}</td>
                                        <td>{item.taken_salary}</td>
                                    </tr>
                                )
                            })
                        }
                        </tbody>


                    </Table>


                </div>

            </main>
        </section>
    );
};

export default StaffSalary;