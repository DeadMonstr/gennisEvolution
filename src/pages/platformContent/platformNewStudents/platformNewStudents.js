import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';

import {Navigate, Route, Routes, useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {
    deleteStudent,
    fetchNewStudents,
    fetchNewStudentsDeleted,
    setPage,
    fetchNewFilteredStudents, fetchNewDeletedStudents, deleteNewStudentSlice
} from "slices/newStudentsSlice";

import {setChecke} from "slices/newStudentsSlice";
import {BackUrl, headers, ROLES} from "constants/global";
import Confirm from "components/platform/platformModals/confirm/confirm";
import Modal from "components/platform/platformUI/modal";
import {useHttp} from "hooks/http.hook";
import CheckPassword from "components/platform/platformModals/checkPassword/CheckPassword";
import {setSelectedLocation} from "slices/meSlice";
import {setMessage} from "slices/messageSlice";
import PlatformSearch from "components/platform/platformUI/search";
import FuncBtns from "components/platform/platformUI/funcBtns";
import Button from "components/platform/platformUI/button";
import UsersTable from "components/platform/platformUI/tables/usersTable";
import Pagination from "components/platform/platformUI/pagination";
import Modals from "components/platform/platformModals";
import {motion} from "framer-motion";


import PlatformUserProfile from "pages/platformContent/platformUser/platformUserProfile/platformUserProfile";


import cls from "./platformNewStudents.module.sass"
import Input from "components/platform/platformUI/input";
import Search from "components/platform/platformUI/search";
import classNames from "classnames";
import {fetchFilters} from "../../../slices/filtersSlice";

const SampleUsers = React.lazy(() => import("components/platform/platformSamples/sampleUsers/SampleUsers"))


const PlatformNewStudents = () => {

    let {locationId} = useParams()

    const {
        filteredNewStudents,
        btns,
        fetchNewStudentsStatus,
        newStudents,
        totalCount
    } = useSelector(state => state.newStudents)

    const {filters, activeFilters} = useSelector(state => state.filters)
    const {currentFilters} = useSelector(state => state.currentFilterSlice)
    const {location, role} = useSelector(state => state.me)
    const {isCheckedPassword} = useSelector(state => state.me)

    const [activeCheckPassword, setActiveCheckPassword] = useState(false)
    const [activeModal, setActiveModal] = useState(false)
    const [activeModalName, setActiveModalName] = useState(false)
    const [deleteStId, setDeleteStId] = useState()
    const [currentScroll, setCurrentScroll] = useState()

    console.log(currentFilters, "currentFilters")

    const [isDeleteData, setIsDeleteData] = useState(false)
    const [isFilterData, setIsFilterData] = useState(false)
    const dispatch = useDispatch()

    const [activeSubject, setActiveSubject] = useState(false);
    const [activeSubjectData, setActiveSubjectData] = useState(null);

    const [width, setWidth] = useState(0)
    const wrapper = useRef()

    const [mainSearch, setMainSearch] = useState("")
    const [search, setSearch] = useState("")


    const [msg, setMsg] = useState("")
    const [typeMsg, setTypeMsg] = useState("")
    const [activeMessage, setActiveMessage] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = useMemo(() => 50, [])



    useEffect(() => {
        const newData = {
            name: "newStudents",
            location: locationId
        }
        dispatch(fetchFilters(newData))
    }, [locationId])

    useEffect(() => {
        setCurrentPage(1);
    }, [isDeleteData, isFilterData])

    useEffect(() => {
        if (filteredNewStudents?.length !== 0) {
            setWidth((wrapper.current?.scrollWidth - wrapper.current?.offsetWidth) + 60)
        }
    }, [filteredNewStudents?.length,])

    useEffect(() => {
        if (isDeleteData) {
            if (isFilterData) {
                dispatch(fetchNewStudentsDeleted(locationId))
            } else {
                dispatch(fetchNewDeletedStudents({locationId, currentPage, pageSize, search  ,currentFilters}))
            }
        } else {
            if (isFilterData) {
                dispatch(fetchNewFilteredStudents(locationId))
            } else {
                dispatch(fetchNewStudents({locationId, currentPage, pageSize, search , currentFilters}))
            }
        }
        dispatch(setSelectedLocation({id: locationId}))
    }, [locationId, isDeleteData, isFilterData, currentPage, search , currentFilters])


    const navigate = useNavigate()

    useEffect(() => {
        if (location !== +locationId && role !== ROLES["Director"]) {
            navigate(-1)
        }
    }, [location, locationId, navigate, role])


    useEffect(() => {
        if (isCheckedPassword && activeModalName) {
            setActiveCheckPassword(false)
            setActiveModal(true)
        }
    }, [activeModalName, isCheckedPassword])


    const activeItems = useMemo((id) => {
        if (isDeleteData) {
            return {
                name: true,
                surname: true,
                age: true,
                reg_date: true,
                checked: false,
                comment: false,
                subjects: false,
                returnDeleted: true,
                delete: false,
                deletedDate: true,
                reason: false
            }
        }

        return {
            name: true,
            surname: true,
            age: true,
            reg_date: true,
            checked: false,
            comment: true,
            subjects: false,
            returnDeleted: false,
            delete: true,
            deletedDate: false,
            reason: false
        }


    }, [isDeleteData,])

    const noActiveItems = useMemo(() => {
        return {
            name: true,
            surname: true,
            age: true,
            reg_date: false,
            checked: false,
            comment: false,
            subjects: false,
            returnDeleted: false,
            delete: false,
            deletedDate: false,
            reason: false
        }
    }, [])


    // eslint-disable-next-line react-hooks/exhaustive-deps
    const onDelete = (id, type) => {
        setDeleteStId(id)
        setActiveModalName(type)

        if (!isCheckedPassword) {
            setActiveCheckPassword(true)
        } else {
            setActiveModal(true)
        }
    }

    const {request} = useHttp()

    const deleteNewStudent = useCallback((data) => {
        if (data !== "no") {
            const newData = {
                ...data,
                typeLocation: "registerStudents",
                student_id: deleteStId
            }
            request(`${BackUrl}create_group/delete_student`, "POST", JSON.stringify(newData), headers())
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
            dispatch(deleteStudent({id: deleteStId, idSubject: activeSubjectData?.id}))
            setActiveSubjectData(state => ({
                ...state,
                students: state?.students.filter(item => item.id !== deleteStId)
            }))
        }

        setActiveModal(false)
    }, [deleteStId, activeSubjectData?.id])

    const returnDeletedStudent = useCallback((data) => {
        if (data === "yes") {
            request(`${BackUrl}student/get_back_student/${deleteStId}`, "GET", null, headers())
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
            activeSubjectData ?
                dispatch(deleteStudent({id: deleteStId, idSubject: activeSubjectData?.id})) :
                dispatch(deleteNewStudentSlice({id: deleteStId}))
            setActiveModal(false)
        } else {
            setActiveModal(false)
        }
    }, [deleteStId, activeSubjectData?.id])


    const funcsSlice = useMemo(() => {
        return {
            onDelete,
            isFilter: true,
            setIsFilterData,
            isFilterData,
            setIsDeleteData,
            isDeleteData
        }
    }, [onDelete])


    const scrollEvent = (e) => {
        setCurrentScroll(e.target.scrollTop)
    }


    const sectionRef = useRef({
        scrollTop: 0
    })
    const [currentLocation, setCurrentLocation] = useState(false)


    useEffect(() => {
        if (location) {
            setCurrentLocation(location)
        }
    }, [location])

    useEffect(() => {
        if (location !== currentLocation) {
            setTimeout(() => {
                if (sectionRef.current?.scrollTop) {
                    sectionRef.current.scrollTop = currentScroll
                }
            }, 500)
        }
    }, [location])


    const handleItemClick = (index) => {

        console.log(filteredNewStudents.filter((item, i) => i === index)[0], "handleItemClick")
        setActiveSubject(prev => !prev)
        setActiveSubjectData(filteredNewStudents.filter((item, i) => i === index)[0])

    };


    const searchedFilteredUsers = useMemo(() => {
        const filteredStudents = filteredNewStudents.slice()


        return filteredStudents.map(item => {
            const students = item.students.filter(item =>
                item.name.toLowerCase().includes(mainSearch.toLowerCase()) ||
                item.surname.toLowerCase().includes(mainSearch.toLowerCase()) ||
                item.username.toLowerCase().includes(mainSearch.toLowerCase())
            )
            return {
                ...item,
                students: students
            }
        })


        // setCurrentPage(1)
        // return filteredHeroes.filter(item =>
        //     item.name.toLowerCase().includes(search.toLowerCase()) ||
        //     item.surname.toLowerCase().includes(search.toLowerCase()) ||
        //     item.username.toLowerCase().includes(search.toLowerCase())
        // )

    }, [filteredNewStudents, mainSearch])



    return (
        <>
            {
                isFilterData ? <>
                        <>
                            <Routes>
                                <Route path="list" element={
                                    <section style={{paddingTop: 0}} className={cls.section} onScroll={scrollEvent} ref={sectionRef}>
                                        <header className={cls.section__header}>
                                            <div key={1}>
                                                <PlatformSearch search={mainSearch} setSearch={setMainSearch}/>
                                                <FuncBtns
                                                    locationId={locationId}
                                                    funcsSlice={funcsSlice}
                                                    dataBtns={btns}
                                                />
                                            </div>
                                        </header>

                                        <div className={cls.links}>

                                            <Button active={isDeleteData} onClickBtn={() => setIsDeleteData(!isDeleteData)}>
                                                O'chirilgan
                                            </Button>

                                            <Button active={isFilterData} onClickBtn={() => setIsFilterData(!isFilterData)}>
                                                Filterlangan
                                            </Button>

                                        </div>
                                        <main className={classNames(cls.section__main, cls.filtered)}>
                                            <motion.div
                                                className={cls.scroll}
                                                id="scroll"
                                                ref={wrapper}
                                            >
                                                <motion.div
                                                    className={cls.scroll__inner}
                                                    id="scroll__inner"
                                                    drag={"x"}
                                                    dragConstraints={{left: -width, right: 0}}
                                                >
                                                    {
                                                        searchedFilteredUsers?.map((item, i) => {
                                                            if (!item.students.length) return null

                                                            return <FilteredBox
                                                                activeItems={activeItems}
                                                                index={i}
                                                                item={item}
                                                                noActiveItems={noActiveItems}
                                                                funscSlice={funcsSlice}
                                                                handleItemClick={handleItemClick}
                                                            />
                                                        })
                                                    }
                                                </motion.div>
                                            </motion.div>
                                        </main>

                                        <footer className={cls.section__footer}>

                                            <Modals
                                                locationId={locationId}
                                                btns={btns}
                                                setMsg={setMsg}
                                                setTypeMsg={setTypeMsg}
                                                setActiveMessage={setActiveMessage}
                                            />
                                        </footer>
                                    </section>


                                }/>

                                <Route path="profile/:userId/*" element={<PlatformUserProfile/>}/>

                                <Route path="/" element={
                                    <Navigate to="list"/>
                                }
                                />
                            </Routes>

                        </>


                        <Modal zIndex={1000} activeModal={activeCheckPassword}
                               setActiveModal={() => setActiveCheckPassword(false)}>
                            <CheckPassword/>
                        </Modal>
                        {/*{*/}
                        {/*    activeModalName === "delete" && isCheckedPassword ?*/}
                        {/*        <>*/}
                        {/*            <Modal id={"confirm"} zIndex={1001} activeModal={activeModal}*/}
                        {/*                   setActiveModal={() => setActiveModal(false)}>*/}
                        {/*                <Confirm setActive={setActiveModal} text={"Oq'uvchini uchirishni hohlaysizmi?"}*/}
                        {/*                         getConfirm={deleteNewStudent} reason={true}/>*/}
                        {/*            </Modal>*/}
                        {/*        </>*/}
                        {/*        : activeModalName === "returnDeleted" && isCheckedPassword ?*/}
                        {/*            <Modal id={"confirm"} zIndex={1001} activeModal={activeModal}*/}
                        {/*                   setActiveModal={() => setActiveModal(false)}>*/}
                        {/*                <Confirm setActive={setActiveModal}*/}
                        {/*                         text={"Uchirilgan o'quvchini qaytarishni hohlaysizmi"}*/}
                        {/*                         getConfirm={returnDeletedStudent}/>*/}
                        {/*            </Modal>*/}
                        {/*            : null*/}
                        {/*}*/}


                        <Modal id={"subjectData"} zIndex={1000} activeModal={activeSubject}
                               setActiveModal={setActiveSubject}>
                            {activeSubjectData && <SubjectData
                                funcsSlice={funcsSlice}
                                item={activeSubjectData}
                                activeItems={activeItems}
                                mainSearch={mainSearch}
                            />}


                        </Modal>
                    </> :


                    <div style={{display: "flex", flexDirection: "column"}}>

                        <SampleUsers
                            locationId={locationId}
                            fetchUsersStatus={fetchNewStudentsStatus}
                            funcsSlice={funcsSlice}
                            activeRowsInTable={activeItems}
                            users={newStudents}
                            filters={filters}
                            btns={btns}
                            pageSize={pageSize}
                            totalCount={totalCount}
                            setCurrentPage={setCurrentPage}
                            onPageChange={setCurrentPage}
                            currentPage2={currentPage}
                            status={false}
                            seach={search}
                            setSearch={setSearch}


                        />
                        {/*<div style={{paddingLeft: "3rem"}}>*/}
                        {/*    <ExtraPagination*/}
                        {/*        totalCount={totalCount?.total}*/}
                        {/*        onPageChange={setCurrentPage}*/}
                        {/*        currentPage={currentPage}*/}
                        {/*        pageSize={pageSize}*/}
                        {/*    />*/}
                        {/*</div>*/}
                    </div>


            }
            {
                activeModalName === "delete" && isCheckedPassword ?
                    <>
                        <Modal id={"confirm"} zIndex={1001} activeModal={activeModal}
                               setActiveModal={() => setActiveModal(false)}>
                            <Confirm setActive={setActiveModal} text={"Oq'uvchini uchirishni hohlaysizmi?"}
                                     getConfirm={deleteNewStudent} reason={true}/>
                        </Modal>
                    </>
                    : activeModalName === "returnDeleted" && isCheckedPassword ?
                        <Modal id={"confirm"} zIndex={1001} activeModal={activeModal}
                               setActiveModal={() => setActiveModal(false)}>
                            <Confirm setActive={setActiveModal}
                                     text={"Uchirilgan o'quvchini qaytarishni hohlaysizmi"}
                                     getConfirm={returnDeletedStudent}/>
                        </Modal>
                        : null
            }
        </>
    )
}


const FilteredBox = React.memo(({
                                    item,
                                    activeItems,
                                    index,
                                    noActiveItems,
                                    funcsSlice,
                                    activeIndex,
                                    handleItemClick
                                }) => {
        const {
            fetchNewStudentsStatus,
        } = useSelector(state => state.newStudents)


        //
        // const activeClass = activeIndex === index ? "activeColum" : ""
        // const scrollActive = item.students.length > 7 ? "activeScroll" : ""


        return (
            <motion.div
                className={cls.items}
            >
                <div className={cls.items__main}>
                    <h1
                        className={cls.items__title}
                        onClick={() => handleItemClick(index)}
                    >
                        {item.name} / {item.students.length}
                    </h1>
                </div>
                <div className={cls.items__wrapper}>

                    <UsersTable
                        fetchUsersStatus={fetchNewStudentsStatus}
                        activeRowsInTable={noActiveItems}
                        users={item.students}
                        pageName={"newStudents"}
                        cache={true}
                    />
                </div>
            </motion.div>
        )
    }
)

const SubjectData = ({item, activeItems, funcsSlice, mainSearch}) => {


    const {
        fetchNewStudentsStatus,
    } = useSelector(state => state.newStudents)

    const [search, setSearch] = useState("")
    const [otInp, setOtInp] = useState(null)
    const [doInp, setDoInp] = useState(null)
    const [currentPage, setCurrentPage] = useState(1);
    let PageSize = useMemo(() => 50, [])


    useEffect(() => {
        setSearch(mainSearch)
    }, [mainSearch])

    const multiPropsFilter = useMemo(() => {

        return item.students.filter(user => {
            if (!doInp || !otInp || +doInp === 0) return user

            return user.age >= +otInp && user.age <= +doInp
        });
    }, [item.students, doInp, otInp]);

    const searchedUsers = useMemo(() => {

        const filteredHeroes = multiPropsFilter.slice()
        setCurrentPage(1)

        return filteredHeroes.filter(item =>
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.surname.toLowerCase().includes(search.toLowerCase()) ||
            item.username.toLowerCase().includes(search.toLowerCase())
        )
    }, [multiPropsFilter, search])

    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return searchedUsers.slice(firstPageIndex, lastPageIndex);
    }, [PageSize, currentPage, searchedUsers]);


    return (
        <div className={cls.subjectStudents}>

            <div className={cls.subjectStudents__header}>
                <h1>{item.name}</h1>

                <Search search={search} setSearch={setSearch}/>
            </div>

            <div className={cls.subjectStudents__subheader}>

                <div>
                    <Input others={{min: 0}} type={"number"} value={otInp} onChange={setOtInp} title={"Ot"}/>
                    <Input others={{min: 0}} type={"number"} value={doInp} onChange={setDoInp} title={"Do"}/>
                </div>
            </div>
            <div className={cls.subjectStudents__wrapper}>
                <UsersTable
                    fetchUsersStatus={fetchNewStudentsStatus}
                    funcsSlice={funcsSlice}
                    activeRowsInTable={activeItems}
                    users={currentTableData}
                    pageName={"newStudents"}
                    cache={true}
                />


            </div>

            <Pagination
                className="pagination-bar"
                currentPage={currentPage}
                totalCount={searchedUsers.length}
                pageSize={PageSize}
                onPageChange={page => {
                    setCurrentPage(page)
                }}
            />


        </div>
    )
}

export default PlatformNewStudents;