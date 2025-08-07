import React, {useEffect, useMemo, useState} from 'react';

import cls from "./platformFilteredTestedGroups.module.sass"
import {useDispatch, useSelector} from "react-redux";
import Select from "components/platform/platformUI/select";
import {fetchDataToChange} from "slices/dataToChangeSlice";
import GroupsTable from "components/platform/platformUI/tables/groupsTable";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";
import {useParams} from "react-router-dom";
import Table from "components/platform/platformUI/table";
import classNames from "classnames";
import Pagination from "components/platform/platformUI/pagination";
import {Back} from "gsap/gsap-core";
import BackButton from "components/platform/platformUI/backButton/backButton";


const PlatformFilteredTestedGroups = () => {


    const {locationId} = useParams()


    const {dataToChange} = useSelector(state => state.dataToChange)
    const [year, setYear] = useState(null)
    const [month, setMonth] = useState(null)
    const [groups, setGroups] = useState([])

    let PageSize = useMemo(() => 50, [])
    const [currentPage, setCurrentPage] = useState(1);


    const {request} = useHttp()


    useEffect(() => {
        if (year && month) {
            request(`${BackUrl}group_test/groups_by_test/${locationId}`, "POST", JSON.stringify({year, month}), headers())
                .then(res => {
                    if (res && res.groups) {
                        setGroups(res.groups || [])
                    }
                })
        }

    }, [year, month])


    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchDataToChange())

    }, [])


    const activeItems = useMemo(() => {
        return {
            name: true,
            teacherName: true,
            teacherSurname: true,
            typeOfCourse: true,
            subject: true,
            teacherID: false,
            studentsLength: true,
            // subjects : true,
            // payment : true,
            status: true
        }
    }, [])


    const searchedGroups = useMemo(() => {
        const filteredGroups = groups.slice()
        setCurrentPage(1)
        return filteredGroups
    }, [groups])


    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return searchedGroups.slice(firstPageIndex, lastPageIndex);
    }, [PageSize, currentPage, searchedGroups]);



    return (
        <div className={cls.groups}>
            <BackButton/>
            <div className={cls.header}>

                <Select keyValue={"id"} options={dataToChange.years} value={year} onChangeOption={setYear}/>
                {year && <Select
                    keyName={"month"}
                    onChangeOption={setMonth}
                    value={month}
                    options={dataToChange.years.filter(item => item.id === +year)[0].months}
                />}
            </div>

            <div className={cls.container}>
                <Table>

                    <thead>
                        <tr>
                            <th>№</th>
                            <th>Gruppa nomi</th>
                            <th>O'qituvchi Ismi</th>
                            <th>O'qituvchi Familyasi</th>
                            <th>Fan</th>
                            <th>Test olingan</th>
                        </tr>

                    </thead>
                    <tbody>

                    {
                        currentTableData.map((item,index) => {
                            return (
                                <tr>
                                    <td>{index+1}</td>
                                    <td>{item.name}</td>
                                    <td>{item.teacher_name}</td>
                                    <td>{item.teacher_surname}</td>
                                    <td>{item.subject}</td>
                                    <td>
                                        {
                                            item.group_test === true ?
                                                <i  className={classNames("fas fa-check", cls.true)} />
                                                :
                                                <i className={classNames("fas fa-times", cls.false)} />
                                        }

                                    </td>
                                </tr>
                            )
                        })
                    }

                    </tbody>

                </Table>

                <Pagination
                    className="pagination-bar"
                    currentPage={currentPage}
                    totalCount={searchedGroups.length}
                    pageSize={PageSize}
                    onPageChange={page => {
                        setCurrentPage(page)
                        // dispatch(funcsSlice?.setPage({page}))
                    }}
                />


                {/*<GroupsTable*/}
                {/*    activeRowsInTable={activeItems}*/}
                {/*    groups={groups}*/}
                {/*/>*/}
            </div>

        </div>
    );
};

export default PlatformFilteredTestedGroups;