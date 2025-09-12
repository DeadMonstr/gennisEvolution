import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import classNames from "classnames";

import Table from "components/platform/platformUI/table";
import Input from "components/platform/platformUI/input";
import DefaultLoader from "components/loader/defaultLoader/DefaultLoader";
import {BackUrl} from "constants/global";
import {useHttp} from "hooks/http.hook";

import cls from "./style.module.sass";

const PlatformOneDay = () => {

    const lastDate = localStorage.getItem("from_toData")
    const {request} = useHttp()
    const {locationId} = useParams()

    const [fromDate, setFromDate] = useState(null)
    const [toDate, setToDate] = useState(null)
    const [date, setDate] = useState({})
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (lastDate) {
            const last = JSON.parse(lastDate)
            setFromDate(last.fromDate)
            setToDate(last.toDate)
        }
    }, [lastDate])

    useEffect(() => {
        if (locationId && fromDate && toDate) {
            setLoading(true)
            request(`${BackUrl}account/statistics?location_id=${locationId}&from_date=${fromDate}&to_date=${toDate}`)
                .then(res => {
                    setDate(res)
                    setLoading(false)
                })
            localStorage.setItem("from_toData", JSON.stringify({fromDate, toDate}))
        }
    }, [locationId, fromDate, toDate])

    const render = () => {
        const sectionTitles = {
            joined_students: "Qo‘shilgan o‘quvchilar",
            new_groups: "Yangi guruhlar",
            new_students: "Yangi o‘quvchilar",
            new_leads: "Yangi leadlar",
            teacher_salaries: "O‘qituvchilar maoshi",
            staff_salaries: "Xodimlar maoshi",
            payments: "To‘lovlar",
            overheads: "Xarajatlar",
            expenses: "Umumiy xarajatlar",
            overall: "Umumiy balans"
        };

        return Object.entries(date).map(([key, value]) => {
            if (typeof value === "number") return null

            if (typeof value === "object" && value.items) {
                let columns = [];
                let headers = {};

                if (key.includes("students")) {
                    columns = ["name", "surname", "phone", "reg_date", "comment"];
                    headers = {
                        name: "Ism",
                        surname: "Familiya",
                        phone: "Telefon",
                        reg_date: "Ro‘yxatga olingan sana",
                        comment: "Izoh"
                    };
                } else if (key.includes("salaries")) {
                    columns = ["name", "surname", "amount", "date", "reason"];
                    headers = {
                        name: "Ism",
                        surname: "Familiya",
                        amount: "Miqdori",
                        date: "Sana",
                        reason: "Sabab"
                    };
                } else if (key.includes("payments")) {
                    columns = ["name", "surname", "amount", "date", "type_name"];
                    headers = {
                        name: "Ism",
                        surname: "Familiya",
                        amount: "Miqdori",
                        date: "Sana",
                        type_name: "Turi"
                    };
                } else if (key.includes("leads")) {
                    columns = ["name", "phone", "day", "status"];
                    headers = {
                        name: "Ism",
                        phone: "Telefon",
                        day: "Kun",
                        status: "Holati"
                    };
                } else if (key.includes("overheads")) {
                    columns = ["item_name", "amount", "date"];
                    headers = {
                        item_name: "Nomi",
                        amount: "Miqdori",
                        date: "Sana"
                    };
                } else if (key.includes("group")) {
                    columns = ["name", "students", "teacher_name", "teacher_surname"];
                    headers = {
                        name: "Nomi",
                        students: "O'quvchilar",
                        teacher_name: "O'qituvchi Ismi",
                        teacher_surname: "O'qituvchi Familiyasi",
                    };
                } else {
                    columns = Object.keys(value.items[0] || {}).filter(
                        (f) => f !== "id" && f !== "type_name" && !f.includes("id")
                    );
                    headers = Object.fromEntries(columns.map((c) => [c, c]));
                }

                return (
                    <div key={key} className={cls.item}>
                        <h2>
                            {sectionTitles[key] || key.replaceAll("_", " ")}{" "}
                            <span>
                                (count: {value.count || value.items.length}
                                {value.sum ? `, sum: ${value.sum}` : ""})
                            </span>
                        </h2>
                        <Table className={cls.item__table}>
                            <table>
                                <thead>
                                <tr>
                                    <th>№</th>
                                    {
                                        columns.map((field) => (
                                            <th key={field}>{headers[field] || field}</th>
                                        ))
                                    }
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    value.items.map((item, idx) => (
                                        <tr key={idx}>
                                            <td>{idx + 1}</td>
                                            {
                                                columns.map((field) => (
                                                    <td key={field}>
                                                        {
                                                            item[field] !== null && item[field] !== undefined
                                                                ? field === "status"
                                                                    ?
                                                                    <div className={cls.status}>
                                                                <span
                                                                    className={classNames(cls.span, {
                                                                        [cls.red]: item[field] === "red"
                                                                    })}
                                                                />
                                                                    </div>
                                                                    : String(item[field])
                                                                : "—"
                                                        }
                                                    </td>
                                                ))
                                            }
                                        </tr>
                                    ))
                                }
                                </tbody>
                            </table>
                        </Table>
                    </div>
                );
            }
            return null;
        });
    };


    return (
        <div className={cls.oneDay}>
            <div className={cls.oneDay__header}>
                <h1>Hisob</h1>
                <div className={cls.date}>
                    <Input
                        title={"From"}
                        type={"date"}
                        onChange={setFromDate}
                        defaultValue={fromDate}
                    />
                    <Input
                        title={"To"}
                        type={"date"}
                        onChange={setToDate}
                        defaultValue={toDate}
                    />
                </div>
            </div>
            <div
                className={classNames(cls.oneDay__container, {
                    [cls.notActive]: !fromDate || !toDate
                })}
            >
                {
                    loading
                        ? <DefaultLoader/>
                        :
                        !fromDate || !toDate
                            ? <h2 className={cls.notActive}>Sana tanlanmagan</h2>
                            : <div className={cls.items}>
                                <div className={classNames(cls.items__header, cls.item)}>
                                    <h2>
                                        <span>Umumiy balans: </span>
                                        {date.overall}
                                    </h2>
                                    <h2>
                                        <span>Umumiy xarajatlar: </span>
                                        {date.expenses}
                                    </h2>
                                </div>
                                {render()}
                            </div>
                }
            </div>
        </div>
    );
};

export default PlatformOneDay;