// eslint-disable-next-line no-unused-vars
import React, {useEffect, useMemo, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
    deleteAccDataItem,
    fetchAccData, fetchAccData2,
    fetchDeletedAccData, onChangeAccountingBtns, onChangeAccountingPage, onChangeFetchedDataType,
} from "slices/accountingSlice";
import {fetchFilters} from "slices/filtersSlice";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";
import {useLocation} from "react-router-dom";
import {getUIPageByPath, setPagePosition} from "slices/uiSlice";
import useFilteredData from "pages/platformContent/platformAccounting/useFilteredData";
import {setMessage} from "slices/messageSlice";
import Button from "components/platform/platformUI/button";
import SampleAccounting from "components/platform/platformSamples/sampleAccaunting/SampleAccounting";
import AccountingTable from "components/platform/platformUI/tables/accountingTable";
import Pagination, {ExtraPagination} from "components/platform/platformUI/pagination";



const StudentsBookPayment = ({locationId, path}) => {

    const {data, fetchAccDataStatus, fetchedDataType, btns , totalCount , location} = useSelector(state => state.accounting)
    const [isChangedData, setIsChangedData] = useState(false)
    const [isDeleted, setIsDeleted] = useState(false)

    const {pathname} = useLocation()


    const oldPage = useSelector((state) => getUIPageByPath(state,pathname))
    const [book_overheads, setBookOverheads] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    let PageSize = useMemo(() => 50, [])

    const dispatch = useDispatch()
    const {request} = useHttp()


    const [filteredDataOverheads,searchedDataOverheads] = useFilteredData(data.data?.book_overheads, currentPage, PageSize)

    const [filteredDataPayments,searchedDataPayments] = useFilteredData(data.data?.book_payments, currentPage, PageSize)

    useEffect(() => {
        if (fetchedDataType !== path || !data.data.length || locationId !== location) {
            const baseData = {
                locationId,
                type: "book_payments"
            };

            if (isDeleted) {
                dispatch(fetchDeletedAccData({data: baseData, PageSize, currentPage}));
            } else {
                dispatch(fetchAccData({data: baseData, PageSize, currentPage}));
                dispatch(fetchAccData2({data: baseData, PageSize, currentPage}));
            }

            dispatch(fetchFilters({
                name: "accounting_payment",
                location: locationId
            }));

            dispatch(onChangeFetchedDataType({type: path}));
        }
    }, [locationId, currentPage, isDeleted]);

    useEffect(() => {
        dispatch(onChangeAccountingPage({value: path}))
    },[])
    useEffect(() => {
        setCurrentPage(1);
        setBookOverheads(1)
    }, [isDeleted, locationId, path ,]);

    useEffect(() => {
        let reqData = {
            locationId,
            type: "book_payments"
        };


        for (let item of btns) {
            if (item.active) {
                reqData[item.name] = item.active;
            }
        }

        setIsDeleted(!!reqData.deleted);


        dispatch(fetchFilters({
            name: "accounting_payment",
            location: locationId
        }));


        if (reqData.deleted) {
            dispatch(fetchDeletedAccData({
                data: reqData,
                isArchive: !!reqData.archive,
                PageSize,
                currentPage
            }));
        } else {
            dispatch(fetchAccData({
                data: reqData,
                isArchive: !!reqData.archive,
                PageSize,
                currentPage
            }));
            dispatch(fetchAccData2({
                data: reqData,
                PageSize,
                book_overheads,
                isArchive: !!reqData.archive,
            }));
        }

        dispatch(onChangeFetchedDataType({ type: path }));

    }, [btns, currentPage, book_overheads, locationId, path]);



    useEffect(() => {
        if (oldPage) {
            setCurrentPage(oldPage)
        }
    },[])


    const activeItems = () => {
        if (isDeleted) {
            return {
                price: true,
                date : true,
            }
        }
        return {
            name: true,
            price: true,
            date : true
        }
    }


    const onDelete = (data) => {
        const {id} = data
        dispatch(deleteAccDataItem({id: id}))
        request(`${BackUrl}account/delete_payment/${id}`, "POST", JSON.stringify(data), headers())
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
        changePaymentTypeData,
        onDelete,
        getArchive
    }


    const onChangedPage = (page) => {
        setCurrentPage(page)
        dispatch(setPagePosition({path:pathname,page: page}))
    }


    let summa = "price"


    let sum1 = filteredDataOverheads?.reduce((a, c) => {
        return a + c[summa]
    }, 0);


    let sum2 = filteredDataPayments?.reduce((a, c) => {
        return a + c[summa]
    }, 0);


    return (
        <>
            <SampleAccounting
                links={links}
            >
                <div style={{display: "flex",justifyContent:"center", gap: "1rem"}}>
                    <div style={{width: "50%"}}>
                        <AccountingTable
                            sum={sum1}
                            // cache={true}
                            typeOfMoney={data.typeOfMoney}
                            fetchUsersStatus={fetchAccDataStatus}
                            funcSlice={funcsSlice}
                            activeRowsInTable={activeItems()}
                            users={filteredDataOverheads}
                        />



                        <ExtraPagination
                            pageSize={PageSize}
                            currentPage={book_overheads}
                            onPageChange={setBookOverheads}
                            totalCount={totalCount?.book_overheads?.total}


                        />
                    </div>
                    <div style={{width: "50%"}}>
                        <AccountingTable
                            sum={sum2}
                            // cache={true}
                            typeOfMoney={data.typeOfMoney}
                            fetchUsersStatus={fetchAccDataStatus}
                            funcSlice={funcsSlice}
                            activeRowsInTable={activeItems()}
                            users={filteredDataPayments}
                        />



                        <ExtraPagination
                            pageSize={PageSize}
                            currentPage={currentPage}
                            onPageChange={setCurrentPage}
                            totalCount={totalCount?.book_payments?.total}


                        />
                    </div>

                </div>




            </SampleAccounting>
        </>
    )
};




export default StudentsBookPayment;