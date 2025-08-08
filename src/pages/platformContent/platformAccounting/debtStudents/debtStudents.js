
import React, {useEffect, useMemo, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
    changePaymentType,
    fetchAccData,
    fetchDeletedAccData,
    onChangeAccountingBtns, onChangeAccountingPage, onChangeFetchedDataType,
} from "slices/accountingSlice";
import {fetchFilters} from "slices/filtersSlice";

import {useHttp} from "hooks/http.hook";
import SampleAccounting from "components/platform/platformSamples/sampleAccaunting/SampleAccounting";
import {useLocation} from "react-router-dom";
import {getUIPageByPath, setPagePosition} from "slices/uiSlice";
import useFilteredData from "pages/platformContent/platformAccounting/useFilteredData";
import Button from "components/platform/platformUI/button";
import AccountingTable from "components/platform/platformUI/tables/accountingTable";
import Pagination, {ExtraPagination} from "components/platform/platformUI/pagination";




const DebtStudents = ({locationId, path}) => {

    const {data, fetchAccDataStatus, fetchedDataType, btns,location , totalCount} = useSelector(state => state.accounting)
    const [isChangedData, setIsChangedData] = useState(false)
    const [isDeleted, setIsDeleted] = useState(false)

    const {pathname} = useLocation()
    const {search} = useSelector(state => state.accounting)


    const oldPage = useSelector((state) => getUIPageByPath(state,pathname))
    const [currentPage, setCurrentPage] = useState(1);
    let PageSize = useMemo(() => 50, [])


    const dispatch = useDispatch()
    const {request} = useHttp()

    const [filteredData,searchedData] = useFilteredData(data.data, currentPage, PageSize)

    useEffect(() => {
        if (fetchedDataType !== path || !data.data.length || locationId !== location) {
            const data = {
                locationId,
                type: "debts"
            }
            console.log("fetched",data)
            if (isDeleted) {
                dispatch(fetchDeletedAccData({data: data, PageSize, currentPage}));
            } else {
                dispatch(fetchAccData({data: data, PageSize, currentPage}));
            }
            const newData = {
                name: "debt_students",
                location: locationId
            }
            dispatch(fetchFilters(newData))
            dispatch(onChangeFetchedDataType({type: path}))
        }
    }, [locationId , currentPage])


    useEffect(() => {
        setCurrentPage(1);
    }, [isDeleted, locationId, path ,]);


    useEffect(() => {
        let data = {
            locationId,
            type: "debts"
        }
        for (let item of btns) {
            if (item.active) {
                data = {
                    ...data,
                    [item.name]: item.active
                }
            }
        }
        setIsDeleted(data.deleted)

        if (data.deleted) {
            dispatch(fetchDeletedAccData({
                data: data,
                isArchive: !!data.archive,
                PageSize,
                currentPage
            }));
        } else {
            dispatch(fetchAccData({
                data: data,
                isArchive: !!data.archive,
                PageSize,
                currentPage
            }));
        }
    }, [btns, isChangedData , currentPage])

    useEffect(() => {
        if (oldPage) {
            setCurrentPage(oldPage)
        }
    },[])
    const activeItems = () => {
        return {
            name: true,
            surname : true,
            phone: true,
            debts: true,
            reason: true
            // deleteDebt: true
        }
    }




    const getArchive = (isActive) => {
        const newData = {
            name: "debt_students",
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

    const setChangedBtns = (id,active) => {
        if (!active) setIsChangedData(true)
        dispatch(onChangeAccountingBtns({id}))
    }



    const links = useMemo(() => {

        const newBtns = []


        for (let item of btns) {
            if (item.page && item.page === path ) {
                newBtns.push({
                    ...item,
                    elem: Button,
                    props: {
                        active: item.active,
                        onClickBtn: () => setChangedBtns(item.id,item.active),
                        children: item.title
                    }
                })
            }
            else if (!item.page) {
                newBtns.push({
                    ...item,
                    elem: Button,
                    props: {
                        active: item.active,
                        onClickBtn: () => setChangedBtns(item.id,item.active),
                        children: item.title
                    }
                })
            }
        }


        return newBtns

    }, [btns])

    const funcsSlice = {
        getArchive
    }
    useEffect(() => {
        dispatch(onChangeAccountingPage({value: path}))
    },[])

    const onChangedPage = (page) => {
        setCurrentPage(page)
        dispatch(setPagePosition({path:pathname,page: page}))
    }

    let summa = "balance"


    let sum = filteredData?.reduce((a, c) => {
        return a + c[summa]
    }, 0);



    const searchedUsers = useMemo(() => {
        const filteredHeroes = data?.data?.slice()
        return filteredHeroes?.filter(item => {
            if (item?.name || item.surname || item.username) {
                return item?.name?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    item?.surname?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    item?.username?.toLowerCase()?.includes(search?.toLowerCase())
            } else return true
        })
    }, [data.data , search])

    return (
        <>
            <SampleAccounting
                links={links}
            >
                <div style={{height: "43vh" , overflow: "auto"}}>
                <AccountingTable
                    sum={sum}
                    // cache={true}
                    typeOfMoney={data.typeOfMoney}
                    fetchUsersStatus={fetchAccDataStatus}
                    funcSlice={funcsSlice}
                    activeRowsInTable={activeItems()}
                    users={searchedUsers}
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


export default DebtStudents;