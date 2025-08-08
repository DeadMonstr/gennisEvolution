import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {
    deleteAccDataItem,
    fetchAccData,
    fetchDeletedAccData,
    onChangeAccountingBtns, onChangeAccountingPage,
    onChangeFetchedDataType
} from "slices/accountingSlice";
import {fetchFilters} from "slices/filtersSlice";
import {BackUrl, headers} from "constants/global";
import {useHttp} from "hooks/http.hook";
import SampleAccounting from "components/platform/platformSamples/sampleAccaunting/SampleAccounting";
import useFilteredData from "pages/platformContent/platformAccounting/useFilteredData";
import AccountingTable from "components/platform/platformUI/tables/accountingTable";
import Pagination, {ExtraPagination} from "components/platform/platformUI/pagination";
import Button from "components/platform/platformUI/button";
import {setMessage} from "slices/messageSlice";
import {getUIPageByPath, setPagePosition} from "slices/uiSlice";


const StudentsPayments = ({locationId, path}) => {

    const {data, fetchAccDataStatus, fetchedDataType, btns, location , totalCount} = useSelector(state => state.accounting)
    const [isChangedData, setIsChangedData] = useState(false)
    const [isDeleted, setIsDeleted] = useState(false)

    const {pathname} = useLocation()


    const oldPage = useSelector((state) => getUIPageByPath(state,pathname))
    const [currentPage, setCurrentPage] = useState(1);
    let PageSize = useMemo(() => 50, [])

    const dispatch = useDispatch()
    const {request} = useHttp()

    const [filteredData,searchedData] = useFilteredData(data.data, currentPage, PageSize)


    useEffect(() => {
        dispatch(onChangeAccountingPage({value: path}))
    },[])



    useEffect(() => {
        if (fetchedDataType !== path || !data.data.length || locationId !== location) {
            const baseData = {
                locationId,
                type: "payments"
            };

            if (isDeleted) {
                dispatch(fetchDeletedAccData({data: baseData, PageSize, currentPage}));
            } else {
                dispatch(fetchAccData({data: baseData, PageSize, currentPage}));
            }

            dispatch(fetchFilters({
                name: "accounting_payment",
                location: locationId
            }));

            dispatch(onChangeFetchedDataType({type: path}));
        }
    }, [locationId, currentPage, isDeleted]);



    useEffect(() => {
        setCurrentPage(1);
    }, [isDeleted, locationId, path ,]);

    useEffect(() => {

        let params = {
            locationId,
            type: "payments"
        };


        for (let item of btns) {
            if (item.active) {
                params[item.name] = item.active;
            }
        }

        setIsDeleted(params.deleted);


        dispatch(fetchFilters({
            name: "accounting_payment",
            location: locationId
        }));


        if (params.deleted) {
            dispatch(fetchDeletedAccData({
                data: params,
                isArchive: !!params.archive,
                PageSize,
                currentPage
            }));
        } else {
            dispatch(fetchAccData({
                data: params,
                isArchive: !!params.archive,
                PageSize,
                currentPage
            }));
        }


        dispatch(onChangeFetchedDataType({ type: path }));

    }, [locationId, currentPage, btns, path]);

    useEffect(() => {
        if (oldPage) {
            setCurrentPage(oldPage)
        }
    },[])


    const activeItems = () => {
        if (isDeleted) {
            return {
                name: true,
                surname: true,
                payment: true,
                datePayment: true,
                date: true,
                typePayment: true,
                reason: true
            }
        }
        return {
            name: true,
            surname: true,
            payment: true,
            datePayment: true,
            delete: true,
            date: true,
            typePayment: true
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


    let summa = "payment"


    let sum = filteredData?.reduce((a, c) => {
        return a + c[summa]
    }, 0);
    console.log(totalCount  , data, "total")

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
                        users={filteredData}
                    />
                </div>


                <ExtraPagination
                    pageSize={PageSize}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                    totalCount={totalCount?.total}
                />
                {/*<Pagination*/}
                {/*    className="pagination-bar"*/}
                {/*    currentPage={currentPage}*/}
                {/*    totalCount={searchedData.length}*/}
                {/*    pageSize={PageSize}*/}
                {/*    onPageChange={page => onChangedPage(page)}*/}
                {/*/>*/}
            </SampleAccounting>
        </>
    )
};

export default StudentsPayments;