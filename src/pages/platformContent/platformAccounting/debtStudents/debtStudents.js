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
import {useLocation, useNavigate} from "react-router-dom";
import {getUIPageByPath, setPagePosition} from "slices/uiSlice";
import useFilteredData from "pages/platformContent/platformAccounting/useFilteredData";
import Button from "components/platform/platformUI/button";
import AccountingTable from "components/platform/platformUI/tables/accountingTable";
import Pagination, {ExtraPagination} from "components/platform/platformUI/pagination";
import Modal from "components/platform/platformUI/modal";
import CheckPassword from "components/platform/platformModals/checkPassword/CheckPassword";
import Confirm from "components/platform/platformModals/confirm/confirm";
import ConfimReason from "components/platform/platformModals/confirmReason/confimReason";
import Select from "components/platform/platformUI/select";
import DefaultLoader from "components/loader/defaultLoader/DefaultLoader";


const DebtStudents = ({locationId, path}) => {

    const {
        data,
        fetchAccDataStatus,
        fetchedDataType,
        btns,
        location,
        totalCount
    } = useSelector(state => state.accounting)
    const [isChangedData, setIsChangedData] = useState(false)
    const [isDeleted, setIsDeleted] = useState(false)

    const {pathname} = useLocation()
    const {search} = useSelector(state => state.accounting)


    const oldPage = useSelector((state) => getUIPageByPath(state, pathname))
    const [currentPage, setCurrentPage] = useState(1);
    let PageSize = useMemo(() => 50, [])

    // const [selected, setSelected] = useState([]);

    const dispatch = useDispatch()
    const {request} = useHttp()
    const navigate = useNavigate()
    const {activeFilters} = useSelector(state => state.filters)
    // console.log(selected)
    // useEffect(() => {
    //
    //
    //     Object.keys(filters).forEach(key => {
    //         const f = filters[key];
    //         let value;
    //
    //         if (Array.isArray(f.activeFilters)) {
    //             value = [...f.activeFilters];
    //         }
    //         else {
    //             value = f.activeFilters ?? null;
    //         }
    //
    //         setSelected(selected => ({...selected, [key]: value}));
    //     });
    //
    //
    // }, [filters])

    useEffect(() => {
        const newData = {
            name: "debt_students",
            location: locationId,
            type: ""
        }
        dispatch(fetchFilters(newData))
    }, [btns])

    useEffect(() => {
        if (fetchedDataType !== path || !data.data.length || locationId !== location) {
            const data = {
                locationId,
                type: "debts"
            }

            // if (isDeleted) {
            //     dispatch(fetchDeletedAccData({data: data, PageSize, currentPage, activeFilters, locationId}));
            // } else {
            //     dispatch(fetchAccData({data: data, PageSize, currentPage, activeFilters, locationId}));
            // }


            dispatch(onChangeFetchedDataType({type: path}))
        }
    }, [locationId, currentPage, activeFilters])


    useEffect(() => {
        setCurrentPage(1);
    }, [isDeleted,]);


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

        const route = "debts/"

        if (data.deleted) {
            dispatch(fetchDeletedAccData({
                data: data,
                isArchive: !!data.archive,
                PageSize,
                currentPage,
                activeFilters,
                locationId,
                route
            }));
        } else {
            dispatch(fetchAccData({
                data: data,
                isArchive: !!data.archive,
                PageSize,
                currentPage,
                activeFilters,
                locationId,
                route
            }));
        }
    }, [btns, isChangedData, currentPage, activeFilters])

    useEffect(() => {
        if (oldPage) {
            setCurrentPage(oldPage)
        }
    }, [])
    const activeItems = () => {
        return {
            name: true,
            surname: true,
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
        getArchive
    }
    useEffect(() => {
        dispatch(onChangeAccountingPage({value: path}))
    }, [])

    const onChangedPage = (page) => {
        setCurrentPage(page)
        dispatch(setPagePosition({path: pathname, page: page}))
    }

    let summa = "balance"


    let sum = data.data?.reduce((a, c) => {
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
    }, [data.data, search])
    if (fetchAccDataStatus === "loading") {
        return <DefaultLoader/>
    } else if (fetchAccDataStatus === "error") {
        console.log('error')
    }

    console.log(data.data)

    const LinkToUser = (e, id) => {
        navigate(`../../profile/${id}`)
        // if (true) {
        //     if (
        //         e.target.type !== "checkbox" &&
        //         !e.target.classList.contains("delete") &&
        //         !e.target.classList.contains("fa-times") &&
        //         !e.target.classList.contains("typePayment")
        //     ) {
        //         navigate(`../profile/${id}`)
        //     }
        // } else {
        //     if (
        //         e.target.type !== "checkbox" &&
        //         !e.target.classList.contains("delete") &&
        //         !e.target.classList.contains("fa-times") &&
        //         !e.target.classList.contains("typePayment")
        //     ) {
        //         navigate(`../../profile/${id}`)
        //     }
        // }
    }
    return (
        <>
            <SampleAccounting
                links={links}
            >
                <div style={{height: "43vh", overflow: "auto"}}>
                    {/*<AccountingTable*/}
                    {/*    // sum={sum}*/}
                    {/*    // cache={true}*/}
                    {/*    // typeOfMoney={data.typeOfMoney}*/}
                    {/*    // fetchUsersStatus={fetchAccDataStatus}*/}
                    {/*    // funcSlice={funcsSlice}*/}
                    {/*    // activeRowsInTable={activeItems()}*/}
                    {/*    // users={data?.data}*/}
                    {/*/>*/}

                    <div className="tableBox">
                        <table>
                            <caption>
                                {sum?.toLocaleString()}
                            </caption>
                            <thead>

                            <tr>
                                <th/>
                                <th>Ism</th>
                                <th>Familiya</th>
                                <th>Sabab</th>
                                <th>Tel</th>
                                <th>Qarz</th>
                            </tr>
                            </thead>
                            <tbody>
                            {data.data.map((item , i ) => (
                                <tr key={i} onClick={e => LinkToUser(e,  item.id)}>
                                    <td>{i + 1}</td>
                                    <td>{item.name}</td>
                                    <td>{item.surname}</td>
                                    <td>{item.reason}</td>
                                    <td>{item.phone}</td>
                                    <td>
                                   <span
                                       className={`money ${item.moneyType}`}
                                   >
                                        {item.balance}
                                    </span>

                                    </td>
                                </tr>
                            ))}

                            </tbody>
                        </table>


                        {/*<Modal activeModal={activeCheckPassword} setActiveModal={() => setActiveCheckPassword(false)}>*/}
                        {/*    <CheckPassword/>*/}
                        {/*</Modal>*/}
                        {/*{*/}
                        {/*    activeChangeModalName === "deletePayment" && isCheckedPassword ?*/}
                        {/*        <>*/}
                        {/*            <Modal activeModal={activeChangeModal} setActiveModal={() => setActiveChangeModal(false)}>*/}
                        {/*                <Confirm setActive={setActiveChangeModal} text={changingData.msg}*/}
                        {/*                         getConfirm={setIsConfirm}/>*/}
                        {/*            </Modal>*/}
                        {/*            {*/}
                        {/*                isConfirm === "yes" ?*/}
                        {/*                    <Modal*/}
                        {/*                        activeModal={activeChangeModal}*/}
                        {/*                        setActiveModal={() => {*/}
                        {/*                            setActiveChangeModal(false)*/}
                        {/*                            setIsConfirm("")*/}
                        {/*                        }}*/}
                        {/*                    >*/}
                        {/*                        <ConfimReason getConfirm={getConfirmDelete} reason={true}/>*/}
                        {/*                    </Modal> : null*/}
                        {/*            }*/}
                        {/*        </>*/}
                        {/*        : activeChangeModalName === "changeTypePayment" && isCheckedPassword ?*/}
                        {/*            <Modal activeModal={activeChangeModal} setActiveModal={() => setActiveChangeModal(false)}>*/}
                        {/*                <div className="changeTypePayment">*/}
                        {/*                    <Select*/}
                        {/*                        options={options}*/}
                        {/*                        name={""}*/}
                        {/*                        title={"Payment turi"}*/}
                        {/*                        onChangeOption={changePayment}*/}
                        {/*                        id={changingData.id}*/}
                        {/*                        defaultValue={changingData.typePayment}*/}
                        {/*                    />*/}
                        {/*                </div>*/}
                        {/*            </Modal> : null*/}
                        {/*}*/}
                    </div>


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