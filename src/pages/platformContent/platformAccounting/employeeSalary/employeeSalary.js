import SampleAccounting from "components/platform/platformSamples/sampleAccaunting/SampleAccounting";
import React, {useEffect, useMemo, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {
    changePaymentType,
    deleteAccDataItem,
    fetchAccData,
     onChangeAccountingBtns, onChangeAccountingPage, onChangeFetchedDataType,

} from "slices/accountingSlice";
import {fetchFilters} from "slices/filtersSlice";
import PlatformMessage from "components/platform/platformMessage";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";
import useFilteredData from "pages/platformContent/platformAccounting/useFilteredData";
import {setMessage} from "slices/messageSlice";
import Button from "components/platform/platformUI/button";
import AccountingTable from "components/platform/platformUI/tables/accountingTable";
import Pagination, {ExtraPagination} from "components/platform/platformUI/pagination";


const EmployeeSalary = ({locationId, path}) => {

    const {
        data,
        fetchAccDataStatus,
        fetchedDataType,
        btns,
        oldPage,
        location,
        totalCount
    } = useSelector(state => state.accounting)
    const [isChangedData, setIsChangedData] = useState(false)
    const [isDeleted, setIsDeleted] = useState(false)

    const [currentPage, setCurrentPage] = useState(1);
    let PageSize = useMemo(() => 50, [])

    const dispatch = useDispatch()
    const {request} = useHttp()

    // const [filteredData,searchedData] = useFilteredData(data.data, currentPage, PageSize)
    const {activeFilters} = useSelector(state => state.filters)

    useEffect(() => {
        let params = {
            locationId,
            type: "staff_salary"
        }
        for (let item of btns) {
            if (item.active) {
                params = {
                    ...params,
                    [item.name]: item.active
                }
            }
        }
        const newData = {
            name: "capital_tools",
            location: locationId,
            type: params.archive ? "archive" : ""
        }
        dispatch(fetchFilters(newData))
    }, [btns])
    useEffect(() => {
        if (fetchedDataType !== path || !data.data.length || locationId !== location) {
            // const data = {
            //     locationId,
            //     type: "staff_salary"
            // }
            // if (isDeleted) {
            //     dispatch(fetchDeletedAccData({data: data, PageSize, currentPage}));
            // } else {
            //     dispatch(fetchAccData({data: data, PageSize, currentPage}));
            // }

            dispatch(onChangeFetchedDataType({type: path}))
        }
    }, [locationId, currentPage])

    useEffect(() => {
        dispatch(onChangeAccountingPage({value: path}))
    }, [])
    useEffect(() => {
        setCurrentPage(1);
    }, [isDeleted, locationId, path,]);


    useEffect(() => {
        let params = {
            locationId,
            type: "staff_salary"
        }
        for (let item of btns) {
            if (item.active) {
                params = {
                    ...params,
                    [item.name]: item.active
                }
            }
        }

        const route = "staff_salary/"


        setIsDeleted(data.deleted)


            dispatch(fetchAccData({
                data: params,
                isArchive: !!params.archive,
                PageSize,
                currentPage,
                activeFilters,
                locationId,
                route,
                deleted: params.deleted
            }));


    }, [btns, isChangedData, currentPage, activeFilters])


    const activeItems = () => {
        if (isDeleted) {
            return {
                name: true,
                surname: true,
                salary: true,
                date: true,
                job: true,
                typePayment: true,
                reason: true
            }
        }
        return {
            name: true,
            surname: true,
            salary: true,
            delete: true,
            date: true,
            job: true,
            typePayment: true
        }
    }


    const onDelete = (data) => {
        const {id} = data
        console.log(data)
        dispatch(deleteAccDataItem({id: id}))
        request(`${BackUrl}account/delete_salary_teacher/${id}/${data.userId}`, "POST", JSON.stringify(data), headers())
            .then(res => {
                if (res.success) {
                    dispatch(setMessage({
                        msg: res.msg,
                        type: "success",
                        active: true
                    }))
                } else {
                    dispatch(setMessage({
                        msg: "Serverda hatolik",
                        type: "error",
                        active: true
                    }))
                }
            })
    }


    const changePaymentTypeData = (id, value, userId) => {
        request(`${BackUrl}account/change_teacher_salary/${id}/${value}/${userId}`, "GET", null, headers())
            .then(res => {
                if (res.success) {
                    dispatch(setMessage({
                        msg: res.msg,
                        type: "success",
                        active: true
                    }))
                } else {
                    dispatch(setMessage({
                        msg: "Serverda hatolik",
                        type: "error",
                        active: true
                    }))
                }
            })
    }
    useEffect(() => {
        if (oldPage) {
            setCurrentPage(oldPage)
        }
    }, [])

    const getArchive = (isActive) => {
        const newData = {
            name: "accounting_payment",
            location: locationId,
            type: isActive ? "archive" : ""
        }
        if (isActive) {
            dispatch(fetchFilters(newData))
        } else {
            setIsChangedData(true)
            dispatch(fetchFilters(newData))
        }

    }

    const setChangedBtns = (id, active) => {
        if (!active) setIsChangedData(true)
        dispatch(onChangeAccountingBtns({id}))
    }


    const links = useMemo(() => {

        const newBtns = []


        for (let item of btns) {
            if (item.page && item.page === path) {
                newBtns.push({
                    ...item,
                    elem: Button,
                    props: {
                        active: item.active,
                        onClickBtn: () => setChangedBtns(item.id, item.active),
                        children: item.title
                    }
                })
            } else if (!item.page) {
                newBtns.push({
                    ...item,
                    elem: Button,
                    props: {
                        active: item.active,
                        onClickBtn: () => setChangedBtns(item.id, item.active),
                        children: item.title
                    }
                })
            }
        }


        return newBtns


    }, [btns])

    const funcsSlice = {
        changePaymentTypeData,
        onDelete,
        getArchive
    }


    let summa = "salary"


    let sum = data.data?.reduce((a, c) => {
        return a + c[summa]
    }, 0);


    return (
        <>
            <SampleAccounting
                links={links}
            >
                <div style={{height: "43vh", overflow: "auto"}}>
                    <AccountingTable
                        sum={sum}
                        // cache={true}
                        typeOfMoney={data.typeOfMoney}
                        fetchUsersStatus={fetchAccDataStatus}
                        funcSlice={funcsSlice}
                        activeRowsInTable={activeItems()}
                        users={data.data}
                    />
                </div>

                <ExtraPagination
                    pageSize={PageSize}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                    totalCount={totalCount?.total}
                />

            </SampleAccounting>
        </>
    )
};

export default EmployeeSalary;