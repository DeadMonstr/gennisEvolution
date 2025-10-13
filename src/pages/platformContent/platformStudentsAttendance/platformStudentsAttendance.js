import React, {Fragment, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";

import Select from 'components/platform/platformUI/select';
import Table from 'components/platform/platformUI/table';
import Input from 'components/platform/platformUI/input';
import { fetchGroupsAttendance } from 'slices/groupsAttendanceSlice';

import cls from "./platformStudentsAttendance.module.sass";

export const PlatformStudentsAttendance = () => {

    const dispatch = useDispatch()

    const {attendance, attendanceCount, loading} = useSelector(state => state.groupsAttendanceSlice)
    // const attendanceDates = useSelector(getAttendanceAll)
    const {location} = useSelector(state => state.me)
    const [selectedDate, setSelectedDate] = useState(null)

    // const onSelectYear = (year) => {
    //     setSelectedYear(+year);

    //     const yearData = attendanceDates?.filter(item => item.year === +year)[0];
    //     if (yearData) {
    //         const months = yearData?.months?.map(m => m.month);
    //         setAttendanceMonth(months);

    //         const lastMonthObj = yearData?.months[yearData?.months?.length - 1];
    //         setSelectedMonth(lastMonthObj?.month);

    //         setAttendanceDays(lastMonthObj?.days);
    //         setSelectedDay(lastMonthObj?.days[lastMonthObj?.days?.length - 1]);
    //     }
    // };

    // const onSelectMonth = (month) => {
    //     setSelectedMonth(month);

    //     const yearData = attendanceDates.filter(item => item.year === selectedYear)[0];
    //     if (yearData) {
    //         const monthData = yearData?.months?.filter(m => m.month === +month)[0];
    //         if (monthData) {
    //             setAttendanceDays(monthData?.days);

    //             setSelectedDay(monthData?.days[monthData?.days?.length - 1]);
    //         }
    //     }
    // };


    // useEffect(() => {
    //     if (attendanceDates && attendanceDates.length) {
    //         const lastYear = attendanceDates[attendanceDates?.length - 1]?.year
    //         const yearMonths = attendanceDates.filter(item => item.year === lastYear)[0]?.months
    //         const lastMonth = yearMonths[yearMonths?.length - 1]
    //         setAttendanceYears(attendanceDates?.map(item => item?.year))
    //         setAttendanceMonth(yearMonths?.map(item => item?.month))
    //         setSelectedYear(lastYear)
    //         setSelectedMonth(lastMonth?.month)
    //         setAttendanceDays(lastMonth?.days)
    //         setSelectedDay(lastMonth?.days[lastMonth?.days?.length - 1])
    //     }
    // }, [attendanceDates])

    useEffect(() => {
        // dispatch(getSchoolAttendanceAll())
    }, [])

    useEffect(() => {
        if (selectedDate && location) {
            const [year, month, day] = selectedDate.split("-");
            dispatch(fetchGroupsAttendance({
                location,
                day,
                month,
                year
            }))
        }
    }, [selectedDate, location])

    const render = () => {
        return attendance?.map((item, i) => (
            <>
                <div className={cls.header}>
                    <h2 className={cls.header__title}>{item?.group_name}</h2>
                    <div className={cls.header__numbers}>
                        <h2 className={cls.subTitle} style={{color: "#22C55E"}}>Kelganlar: {item?.summary?.present}</h2>
                        <h2 className={cls.subTitle}
                            style={{color: "#F43F5E"}}>Kelmaganlar: {item?.summary?.absent}</h2>
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
                                                <i className="fas fa-check" style={{color: "#22C55E"}}/>
                                            ) : (
                                                <i className="fas fa-times" style={{color: "#F43F5E"}}/>
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

    return (
        <div className={cls.studentAttendance}>
            <div className={cls.studentAttendance__header}>
                <div className={cls.info}>
                    {/* <h1>Davomat</h1> */}
                    <div className={cls.subTitles}>
                        <h2 className={cls.subTitle}
                            style={{color: "#22C55E"}}>Kelganlar: {attendanceCount?.present}</h2>
                        <h2 className={cls.subTitle}
                            style={{color: "#F43F5E"}}>Kelmaganlar: {attendanceCount?.absent}</h2>
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
                    <Input type={"date"} onChange={setSelectedDate}/>
                </div>
            </div>
            <div className={cls.studentAttendance__container}>
                <Table>
                    <thead style={{top: 0, position: "initial"}}>
                    <tr>
                        <th>No</th>
                        <th>Ism Familiya</th>
                        <th>Davomat</th>
                        <th>Sababi</th>
                    </tr>
                    </thead>
                    {render()}
                </Table>
            </div>
        </div>
    );
};

