import React, {useEffect, useState} from 'react';

import cls from "./observedTeacherLessons.module.sass"

import {BackUrl,headers} from "constants/global";
import {useSelector} from "react-redux";
import {useHttp} from "hooks/http.hook";
import {useParams} from "react-router-dom";
import BackButton from "components/platform/platformUI/backButton/backButton";
import Select from "components/platform/platformUI/select";
import Table from "components/platform/platformUI/table";
import Modal from "components/platform/platformUI/modal";


const ObservedTeacherLessons = () => {

    const {groupId} = useParams()


    const [year, setYear] = useState()
    const [years, setYears] = useState([])

    const [month, setMonth] = useState()
    const [months, setMonths] = useState([])


    const [day, setDay] = useState()
    const [days, setDays] = useState([])


    const [active, setActive] = useState(false)


    const [observationsOptions, setObservationOptions] = useState([])
    const [info, setInfo] = useState([])
    const [observer, setObserver] = useState({})
    const [average, setAverage] = useState("")
    const [comment, setComment] = useState("")


    const [] = useState([])

    const {data: groupData} = useSelector(state => state.group)

    const {request} = useHttp()

    console.log(groupData)

    useEffect(() => {
        if (groupId) {
            request(`${BackUrl}teacher/observed_group/${groupId}`, "GET", null, headers())
                .then(res => {

                    if (res.month_list.length === 1) {
                        setMonth(res.month_list[0])
                    } else {
                        setMonth(res.month)
                    }
                    setMonths(res.month_list)

                    if (res.years_list.length === 1) {
                        setYear(res.years_list[0])
                    }
                    setYears(res.years_list)


                    setYear(res.year)

                })
        }
    }, [groupData])


    useEffect(() => {
        if (year && month) {
            request(`${BackUrl}teacher/observed_group/${groupId}/${year}-${month}`, "GET", null, headers())
                .then(res => {
                    setDays(res.days)
                })
        }

    }, [year && month])

    useEffect(() => {


        const data = {
            month,
            day,
            year,
            group_id: groupId
        }


        if (year && month && day && groupId) {
            request(`${BackUrl}teacher/observed_group_info/${groupId}`, "POST", JSON.stringify(data), headers())
                .then(res => {
                    setObservationOptions(res.observation_options)
                    setInfo(res.info)
                    setAverage(res.average)
                    setObserver(res.observer)
                })
        }


    }, [month, year, day, groupData])

    const stringCheck = (name,length = 50) => {
        if (name?.length > length) {
            return (
                <>
                    {name.substring(0,length)}...

                </>
            )
        }
        return name
    }


    const renderInfo = () => {
        return info.map((item, index) => {
            return (
                <tr>
                    <td>{index + 1}</td>
                    <td>{item.title}</td>
                    {
                        Object.values(item.values).map(vl => {
                            if (!vl.value) {
                                return <td></td>
                            }
                            return (
                                <td>
                                    <i className="fas fa-check"></i>
                                </td>
                            )
                        })
                    }
                    <td
                        onClick={() => {
                            setActive(!active)
                            setComment(item.comment)
                        }}
                    >
                        {stringCheck(item.comment)}

                    </td>
                </tr>
            )

        })
    }

    return (
        <div className={cls.observedLessons}>

            <BackButton/>

            <div className={cls.header}>
                <h1>Observed Lessons</h1>
                <div>

                    {
                        years.length > 1 ?
                            <Select
                                value={year}
                                title={"Yil"}
                                options={years}
                                onChangeOption={(e) => {
                                    setYear(e)
                                }}
                            /> : null
                    }
                    {
                        months.length > 1 ?
                            <Select
                                value={month}
                                title={"Oy"}
                                options={months}
                                onChangeOption={(e) => {
                                    setMonth(e)
                                }}
                            /> : null
                    }
                    {
                        days.length > 0 ?
                            <Select
                                value={day}
                                title={"Day"}
                                options={days}
                                onChangeOption={(e) => {
                                    setDay(e)
                                }}
                            /> : null
                    }
                </div>

            </div>

            <p className={cls.title}>Observer: <b>{observer?.name} {observer?.surname}</b></p>
            <p className={cls.title}>Average: <b>{average}</b></p>

            <div className={cls.wrapper}>


                <Table className={cls.table}>
                    <thead>
                    <tr>
                        <th>№</th>
                        <th>Dimensions and Observable Expectations</th>
                        {
                            observationsOptions?.map(item => {
                                return (
                                    <th>{item.name} ({item.value})</th>
                                )
                            })
                        }
                        <th>Descriptive Actions (comments)</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        renderInfo()
                    }


                    </tbody>
                </Table>


                <Modal title={"Comment"} activeModal={active} setActiveModal={setActive}>
                    <p className={cls.comment}>
                        {comment}
                    </p>
                </Modal>
            </div>
        </div>
    );
};

export default ObservedTeacherLessons;