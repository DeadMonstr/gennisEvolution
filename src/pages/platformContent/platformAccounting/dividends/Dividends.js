import React, {useCallback, useEffect, useMemo, useState} from "react";
import {
    changePaymentType,
    deleteAccDataItem,
    fetchAccData, fetchDeletedAccData, onAddItem, onChangeAccountingBtns, onChangeAccountingPage,
    onChangeFetchedDataType
} from "../../../../slices/accountingSlice";
import {fetchFilters} from "../../../../slices/filtersSlice";
import {useDispatch, useSelector} from "react-redux";
import {useHttp} from "../../../../hooks/http.hook";
import SampleAccounting from "../../../../components/platform/platformSamples/sampleAccaunting/SampleAccounting";
import AccountingTable from "../../../../components/platform/platformUI/tables/accountingTable";
import Pagination, {ExtraPagination} from "../../../../components/platform/platformUI/pagination";
import {getUIPageByPath, setPagePosition} from "../../../../slices/uiSlice";
import useFilteredData from "../useFilteredData";
import {useLocation} from "react-router-dom";
import Table from "../../../../components/platform/platformUI/table";
import {BackUrl, headers} from "../../../../constants/global";
import {setMessage} from "../../../../slices/messageSlice";
import Button from "../../../../components/platform/platformUI/button";
import CheckPassword from "../../../../components/platform/platformModals/checkPassword/CheckPassword";
import Modal from "../../../../components/platform/platformUI/modal";
import {InputTest} from "../../../../components/platform/platformUI/inputTest/inputTest";
import Select from "../../../../components/platform/platformUI/select";
import Form from "../../../../components/platform/platformUI/form/Form";
import {useForm} from "react-hook-form";
import {fetchDataToChange} from "../../../../slices/dataToChangeSlice";
import {useAuth} from "../../../../hooks/useAuth";
import cls from "pages/platformContent/platformAccountant/bookKeeping/AccountantBookKeeping.module.sass";
const modal = {
    backgroundColor: "white",
    padding: "1rem",
    borderRadius: "5px"
}

const Dividends = ({locationId, path}) => {


    const {data, fetchedDataType, btns, location , totalCount} = useSelector(state => state.accounting)
    const {pathname} = useLocation()
    const oldPage = useSelector((state) => getUIPageByPath(state, pathname))
    const {isCheckedPassword} = useSelector(state => state.me)
    const [activeChangeModal, setActiveChangeModal] = useState(false)
    const [activeChangeModalName, setActiveChangeModalName] = useState("")
    const [activeCheckPassword, setActiveCheckPassword] = useState(false)


    const [currentPage, setCurrentPage] = useState(1);
    let PageSize = useMemo(() => 50, [])
    const dispatch = useDispatch()
    const {request} = useHttp()

    const [filteredData, searchedData] = useFilteredData(data.data, currentPage, PageSize)
    const [isDeleted, setIsDeleted] = useState(false)
    const [isChangedData, setIsChangedData] = useState(false)
    const {activeFilters} = useSelector(state => state.filters)




    useEffect(() => {
        if (fetchedDataType !== path || !data.data.length || locationId !== location) {
            const data = {
                locationId,
                type: "dividends"
            }

            dispatch(fetchAccData({data , currentPage , PageSize}))
            const newData = {
                name: "dividend",
                location: locationId
            }
            dispatch(fetchFilters(newData))
            dispatch(onChangeFetchedDataType({type: path}))
        }
        dispatch(fetchDataToChange(locationId))
    }, [locationId , currentPage])




    useEffect(() => {
        dispatch(onChangeAccountingPage({value: path}))
    }, [])
    useEffect(() => {

        let data = {
            locationId,
            type: "payments"
        }
        for (let item of btns) {
            if (item.active) {
                data = {
                    ...data,
                    [item.name]: item.active
                }
            }
        }
        const newData = {
            name: "capital_tools",
            location: locationId,
            type: data.archive ? "archive" : ""
        }
        dispatch(fetchFilters(newData))
    }, [btns])

    useEffect(() => {
        let data = {
            locationId,
            type: "dividends"
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

        const route = "dividends/"


            dispatch(fetchAccData({
                data: data,
                isArchive: !!data.archive,
                PageSize,
                currentPage,
                activeFilters,
                locationId,
                route,
                deleted: data.deleted
            }));

    }, [btns, isChangedData , currentPage , activeFilters])


    useEffect(() => {
        if (oldPage) {
            setCurrentPage(oldPage)
        }
    },[])

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
    const onChangedPage = (page) => {
        setCurrentPage(page)
        dispatch(setPagePosition({path:pathname,page: page}))
    }




    const setChangedBtns = (id,active) => {
        if (!active) setIsChangedData(true)
        dispatch(onChangeAccountingBtns({id}))
    }


    const changeModal = (name) => {
        setActiveChangeModalName(name)
        if (!isCheckedPassword) {
            setActiveCheckPassword(true)
        } else {
            setActiveChangeModal(true)
        }
    }

    const links = useMemo(() => {

        const newBtns = []


        for (let item of btns) {
            if (item.page && item.page === path ) {
                if (item.name === "investments") {

                    newBtns.push({
                        ...item,
                        elem: Button,
                        props: {
                            name: item.name,
                            active: activeChangeModalName === "investments" && activeChangeModal,
                            onClickBtn: changeModal,
                            children: item.title
                        }
                    })
                }
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

    let summa = "amount"


    let sum = filteredData?.reduce((a, c) => {
        return a + c[summa]
    }, 0);


    useEffect(() => {
        if (isCheckedPassword && activeChangeModalName) {
            setActiveCheckPassword(false)
            setActiveChangeModal(true)
        }
    }, [activeChangeModalName, isCheckedPassword])


    const renderData = () => {
        return filteredData.map((item, i) => (
            <tr>
                <td>{i + 1}</td>
                <td>{item.amount}</td>
                <td>
                    <span
                        className={cls.typePayment}
                    >
                        {/*Cash*/}
                        {item?.payment_type_name}
                    </span>
                </td>
                <td>{item?.date}</td>
                <td>{item?.location}</td>
            </tr>
        ))
    }

    const render = renderData()


    return (
        <>
            <SampleAccounting
                links={links}
            >
                <Table>
                    <thead>
                    <tr>
                        <th>№</th>
                        <th>Amount</th>
                        <th>Payment type</th>
                        <th>Date</th>
                        <th>Location</th>
                    </tr>
                    </thead>
                    <tbody>
                    {render}
                    </tbody>
                </Table>

                <ExtraPagination
                    pageSize={PageSize}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                    totalCount={totalCount?.total}
                />


            </SampleAccounting>
        </>
    );
};


export default Dividends;