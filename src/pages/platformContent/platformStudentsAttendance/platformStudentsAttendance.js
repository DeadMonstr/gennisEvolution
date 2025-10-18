import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";

import Select from 'components/platform/platformUI/select';
import Table from 'components/platform/platformUI/table';
import Input from 'components/platform/platformUI/input';
import { fetchGroupsAttendance } from 'slices/groupsAttendanceSlice';

import cls from "./platformStudentsAttendance.module.sass";
import DefaultLoader from 'components/loader/defaultLoader/DefaultLoader';

export const PlatformStudentsAttendance = () => {

    const dispatch = useDispatch()

    const { attendance, attendanceCount, loading } = useSelector(state => state.groupsAttendanceSlice)
    const { location } = useSelector(state => state.me)
    const [selectedDate, setSelectedDate] = useState(null)

    useEffect(() => {
        const today = new Date().toISOString().split("T")[0]
        setSelectedDate(today)
    }, [])

    useEffect(() => {
        // if (!selectedDate) {
        // const savedDate = localStorage.getItem("selectedDate")
        // if (savedDate) {
        // setSelectedDate(savedDate)
        // } else {
        // const today = new Date().toISOString().split("T")[0]
        // setSelectedDate(today)
        // localStorage.setItem("selectedDate", today)
        // }
        // }

        if (selectedDate && location) {
            const [year, month, day] = selectedDate.split("-")
            dispatch(fetchGroupsAttendance({
                location,
                day,
                month,
                year
            }))
            localStorage.setItem("selectedDate", selectedDate)
        }
    }, [selectedDate, location])

    const render = () => {
        return attendance?.map((item, i) => (
            <>
                <div className={cls.header}>
                    <h2 className={cls.header__title}>{item?.group_name}</h2>
                    <div className={cls.header__numbers}>
                        <h2 className={cls.subTitle} style={{ color: "#22C55E" }}>Kelganlar: {item?.summary?.present}</h2>
                        <h2 className={cls.subTitle}
                            style={{ color: "#F43F5E" }}>Kelmaganlar: {item?.summary?.absent}</h2>
                        <h2 className={cls.subTitle}>Umumiy: {item?.summary?.total}</h2>
                    </div>
                </div>

                {
                    item?.students?.length
                        ? item?.students.map((itemIn, i) => (

                            <tbody>
                                <tr>
                                    <td>{i + 1}</td>
                                    <td>{itemIn?.name} {itemIn?.surname}</td>
                                    <td>
                                        {
                                            itemIn?.status === null
                                                ? "qilinmagan"
                                                : itemIn?.status ? (
                                                    <i className="fas fa-check" style={{ color: "#22C55E" }} />
                                                ) : (
                                                    <i className="fas fa-times" style={{ color: "#F43F5E" }} />
                                                )
                                        }
                                    </td>
                                    <td>{!itemIn?.status ? itemIn?.reason : "—"}</td>
                                </tr>
                            </tbody>

                        ))
                        : "student yo"
                }

            </>
        ))
    }

    console.log(loading);

    // if (!!loading) {
    //     return <DefaultLoader />
    // }

    return (
        <div className={cls.studentAttendance}>
            <div className={cls.studentAttendance__header}>
                <div className={cls.info}>
                    {/* <h1>Davomat</h1> */}
                    <div className={cls.subTitles}>
                        <h2 className={cls.subTitle}
                            style={{ color: "#22C55E" }}>Kelganlar: {attendanceCount?.present}</h2>
                        <h2 className={cls.subTitle}
                            style={{ color: "#F43F5E" }}>Kelmaganlar: {attendanceCount?.absent}</h2>
                        <h2 className={cls.subTitle}>Umumiy: {attendanceCount?.total}</h2>
                    </div>
                </div>
                <div className={cls.selects}>
                    {/* <Select
                        titleOption={"Kun"}
                        options={attendanceDays}
                        onChangeOption={setSelectedDay}
                        defaultValue={selectedDay}
                    />
                    <Select
                        titleOption={"Oy"}
                        onChangeOption={onSelectMonth}
                        options={attendanceMonth}
                        defaultValue={selectedMonth}
                    />
                    <Select
                        titleOption={"Yil"}
                        onChangeOption={onSelectYear}
                        options={attendanceYears}
                        defaultValue={selectedYear}
                    /> */}
                    <Input defaultValue={selectedDate} type={"date"} onChange={setSelectedDate} />
                </div>
            </div>
            <div className={cls.studentAttendance__container}>
                {
                    loading
                        ? <DefaultLoader />
                        : <Table>
                            <thead style={{ top: 0, position: "initial" }}>
                                <tr>
                                    <th>No</th>
                                    <th>Ism Familiya</th>
                                    <th>Davomat</th>
                                    <th>Sababi</th>
                                </tr>
                            </thead>
                            {render()}
                        </Table>
                }
            </div>
        </div>
    );
};

