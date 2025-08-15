import React, {useCallback, useEffect, useMemo, useState} from "react";
import {
    changePaymentType,
    deleteAccDataItem,
    fetchAccData, onAddItem, onChangeAccountingBtns, onChangeAccountingPage,
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
const modal = {
    backgroundColor: "white",
    padding: "1rem",
    borderRadius: "5px"
}

const Invistitsiya = ({locationId, path}) => {
    const {data, fetchAccDataStatus, fetchedDataType, btns, location ,totalCount} = useSelector(state => state.accounting)
    const {pathname} = useLocation()
    const oldPage = useSelector((state) => getUIPageByPath(state, pathname))
    const {isCheckedPassword} = useSelector(state => state.me)
    const [activeChangeModal, setActiveChangeModal] = useState(false)
    const [activeChangeModalName, setActiveChangeModalName] = useState("")
    const [activeCheckPassword, setActiveCheckPassword] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    let PageSize = useMemo(() => 30, [])
    const dispatch = useDispatch()
    const {request} = useHttp()
    const [filteredData, searchedData] = useFilteredData(data.data, currentPage, PageSize)
    const [isDeleted, setIsDeleted] = useState(false)
    const [isChangedData, setIsChangedData] = useState(false)
    const [radioSelect, setRadioSelect] = useState(null)
    const {dataToChange} = useSelector(state => state.dataToChange)

    const {activeFilters} = useSelector(state => state.filters)

    const {register , handleSubmit , setValue } = useForm()


    useEffect(() => {
        if (fetchedDataType !== path || !data.data.length || locationId !== location) {
            // dispatch(fetchAccData(data))
            dispatch(onChangeFetchedDataType({type: path}))
        }
        dispatch(fetchDataToChange(locationId))
    }, [locationId])


    useEffect(() => {
        let data = {
            locationId,
            type: "investments"
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
        dispatch(onChangeAccountingPage({value: path}))
    }, [])
    useEffect(() => {
        let data = {
            locationId,
            type: "investments"
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

        const route = "investments/"


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
    }, [btns, isChangedData , activeFilters , currentPage])


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

    const activeItems = () => {
        if (isDeleted) {
            return {
                name: true,
                price: true,
                date: true,
                typePayment: true,
                delete: false,
                reason: true
            }
        }
        return {
            name: true,
            amount: true,
            date: true,
            typePayment: true,
            year: true,
            delete: true,
            payment: true
        }
    }
    const setChangedBtns = (id,active) => {
        if (!active) setIsChangedData(true)
        dispatch(onChangeAccountingBtns({id}))
    }


    const onClick = (data) => {
        const res = {
            ...data,
            payment_type_id: Number(radioSelect),
            // location_id: locationId
        }
        request(`${BackUrl}account/investment/${locationId}` , "POST" , JSON.stringify(res) , headers())
            .then(res => {
                console.log(res)
                dispatch(setMessage({
                    msg: res.message,
                    type: "success",
                    active: true
                }))

                const data = {
                    locationId,
                    type: "investments"
                }
                dispatch(fetchAccData(data))

                // dispatch(onAddItem(res))

                setActiveChangeModal(false)
                setValue("name" , "")
                setValue("amount" , "")
                setValue("calendar_month" , "")
            })

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
                console.log(item.page , "nmame")
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
    const onDelete = (data) => {

        const {id} = data


        request(`${BackUrl}account/delete_investment/${id}`, "DELETE", JSON.stringify(data), headers())
            .then(res => {
                dispatch(deleteAccDataItem({id: id}))
                    dispatch(setMessage({
                        msg: res.message,
                        type: "success",
                        active: true
                    }))
                    const data = {
                        locationId,
                        type: "investments"
                    }
                    // dispatch(fetchAccData(data))

            })
            .catch(err => {
                dispatch(setMessage({
                    msg: "Serverda hatolik",
                    type: "error",
                    active: true
                }))
            })

    }


    const changePaymentTypeData = (id, value, userId) => {


        request(`${BackUrl}update_payment_type/${id}/${value}`, "GET", null, headers())
            .then(res => {

                dispatch(setMessage({
                    msg: res.message,
                    type: "success",
                    active: true
                }))
                dispatch(changePaymentType({id: id, typePayment: value}))

            })
            .catch(err => {
                dispatch(setMessage({
                    msg: "Serverda hatolik",
                    type: "error",
                    active: true
                }))
            })
    }
    let summa = "amount"


    let sum = filteredData?.reduce((a, c) => {
        return a + c[summa]
    }, 0);

    const funcsSlice = {
        changePaymentTypeData,
        onDelete,
        getArchive
    }
    useEffect(() => {
        if (isCheckedPassword && activeChangeModalName) {
            setActiveCheckPassword(false)
            setActiveChangeModal(true)
        }
    }, [activeChangeModalName, isCheckedPassword])
    return (
        <>
            <SampleAccounting
                links={links}

            >
                {/*<Table>*/}
                {/*    <thead>*/}
                {/*    <tr>*/}
                {/*        <th>No</th>*/}
                {/*        <th>Name</th>*/}
                {/*        <th>Amount</th>*/}
                {/*        <th>Day - Month</th>*/}
                {/*        <th>Payment type</th>*/}
                {/*        <th>Year</th>*/}
                {/*    </tr>*/}
                {/*    </thead>*/}
                {/*    <tbody>*/}
                {/*    {renderTable()}*/}
                {/*    </tbody>*/}
                {/*</Table>*/}

                <AccountingTable
                    sum={sum}
                    // cache={true}
                    typeOfMoney={data?.typeOfMoney}
                    fetchUsersStatus={fetchAccDataStatus}
                    funcSlice={funcsSlice}
                    activeRowsInTable={activeItems()}
                    users={filteredData}
                />

                {/*<Pagination*/}
                {/*    className="pagination-bar"*/}
                {/*    currentPage={currentPage}*/}
                {/*    totalCount={searchedData.length}*/}
                {/*    pageSize={PageSize}*/}
                {/*    onPageChange={page => onChangedPage(page)}*/}
                {/*/>*/}

                <ExtraPagination
                    pageSize={PageSize}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                    totalCount={totalCount?.total}
                />
                <Modal activeModal={activeCheckPassword} setActiveModal={() => setActiveCheckPassword(false)}>
                    <CheckPassword/>
                </Modal>

                {
                    activeChangeModalName === "investments" && isCheckedPassword ?
                        <Modal extraClass={modal} activeModal={activeChangeModal} setActiveModal={() => setActiveChangeModal(false)}>
                            {/*<Form onSubmit={handleSubmit(onClick)}>*/}
                            {/*    <InputTest name={"name"} register={register}/>*/}
                            {/*    <InputTest type={"number"} name={"amount"} register={register}/>*/}
                            {/*    <InputTest type={"date"} name={"calendar_month"} register={register}/>*/}
                            {/*    <Select onChangeOption={setRadioSelect} options={dataToChange?.payment_types}/>*/}
                            {/*</Form>*/}
                            <CreatCapital  setActiveChangeModal={setActiveChangeModal}
                                           locationId={locationId}/>
                        </Modal> : null

                }
            </SampleAccounting>
        </>
    );
};


const CreatCapital = ({locationId, setMsg, setTypeMsg, setActiveMessage, setActiveChangeModal}) => {

    const {
        register,
        formState: {errors},
        handleSubmit,
        reset
    } = useForm({
        mode: "onBlur"
    })


    const {dataToChange} = useSelector(state => state.dataToChange)
    const {data} = useSelector(state => state.accounting)
    const [day, setDay] = useState(null)
    const [month, setMonth] = useState(null)
    const dispatch = useDispatch()

    const {selectedLocation} = useAuth()

    useEffect(() => {
        dispatch(fetchDataToChange(selectedLocation))
    }, [selectedLocation])

    const renderPaymentType = useCallback(() => {
        return dataToChange?.payment_types?.map((item, i) => {
            return (
                <label key={i} className="radioLabel" htmlFor="">
                    <input className="radio" {...register("payment_type_id", {required: true})} type="radio"
                           value={item.id}/>
                    <span>{item.name}</span>
                </label>
            )
        })
    }, [dataToChange?.payment_types])


    const renderDate = useCallback(() => {
        return data?.capital_tools?.map((item, index) => {
            if (item.value === month) {
                return (
                    <div key={index} className="date__item">
                        <Select
                            number={true}
                            name={"day"}
                            title={"Kun"}
                            defaultValue={day}
                            onChangeOption={setDay}
                            options={item?.days}
                        />
                    </div>
                )
            }
        })
    }, [data.capital_tools, month, day])


    const renderedDays = renderDate()
    const renderedPaymentType = renderPaymentType()

    const {request} = useHttp()

    const onSubmit = (data, e) => {
        e.preventDefault()
        const newData = {
            ...data,
        }


        request(`${BackUrl}account/investment/${locationId}`, "POST", JSON.stringify(newData), headers())
            .then(res => {
                    reset()
                    dispatch(setMessage({
                        msg: res.message,
                        type: "success",
                        active: true
                    }))
                    setActiveChangeModal(false)
                    const data = {
                        locationId,
                        type: "investments"
                    }
                    dispatch(fetchAccData(data))
            })
            .catch(err => {
                dispatch(setMessage({
                    msg: "Serverda hatolik",
                    type: "error",
                    active: true
                }))
                setActiveChangeModal(false)
            })
    }


    useEffect(() => {
        if (data?.capital_tools?.length < 2) {
            setMonth(data.capital_tools[0]?.value)
        }
    }, [data?.capital_tools])

    return (
        <div className="overhead">
            <form action="" onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="name">
                    <div>
                        <span className="name-field">Nomi</span>
                        <input
                            defaultValue={""}
                            id="typeItem"
                            className="input-fields"
                            {...register("name", {
                                required: "Iltimos to'ldiring",
                            })}
                        />
                    </div>
                    {
                        errors?.typeItem &&
                        <span className="error-field">
                            {errors?.typeItem?.message}
                        </span>
                    }
                </label>
                <label htmlFor="number">
                    <div>
                        <span className="name-field">Narxi</span>
                        <input
                            defaultValue={""}
                            id="price"
                            className="input-fields"
                            type={"number"}
                            {...register("amount", {
                                required: "Iltimos to'ldiring",
                            })}
                        />
                    </div>
                    {
                        errors?.price &&
                        <span className="error-field">
                            {errors?.price?.message}
                        </span>
                    }
                </label>
                <label htmlFor="date">
                    <div>

                        <input
                            defaultValue={""}
                            id="price"
                            className="input-fields"
                            type={"date"}
                            {...register("date", {
                                required: "Iltimos to'ldiring",
                            })}
                        />
                    </div>
                    {
                        errors?.price &&
                        <span className="error-field">
                            {errors?.price?.message}
                        </span>
                    }
                </label>
                <div>
                    {renderedPaymentType}
                </div>
                <input className="input-submit" type="submit" value="Tasdiqlash"/>

            </form>
        </div>
    )
}



export default Invistitsiya;