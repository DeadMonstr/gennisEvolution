import React, {useEffect, useMemo, useState} from 'react';


import {useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {fetchFilters} from "slices/filtersSlice";
import {fetchStudyingStudents, setActiveBtn} from "slices/studyingStudentsSlice";
import {ROLES} from "constants/global";
import {setSelectedLocation} from "slices/meSlice";

const SampleUsers = React.lazy(() => import("components/platform/platformSamples/sampleUsers/SampleUsers") )





const PlatformStudyingStudents = () => {

    let {locationId} = useParams()

    const {studyingStudents,btns,fetchStudyingStudentsStatus , totalCount} = useSelector(state => state.studyingStudents)
    const {filters } = useSelector(state => state.filters)
    const {location,role} = useSelector(state => state.me)
    const {currentFilters} = useSelector(state => state.currentFilterSlice)
    const dispatch = useDispatch()
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = useMemo(() => 50, [])

    const [search , setSearch] = useState("")
    useEffect(()=> {

        dispatch(fetchStudyingStudents({locationId , pageSize , currentPage , search , currentFilters}))
        const newData = {
            name: "newStudents",
            location: locationId
        }
        dispatch(fetchFilters(newData))
        dispatch(setSelectedLocation({id:locationId}))

    },[dispatch, locationId , currentPage , search , currentFilters])

    const activeItems = useMemo(()=> {
        return {
            name: true,
            surname : true,
            username: true,
            age: true,
            phone : false,
            reg_date: false,
            checked: false,
            comment :false,
            subjects : false,
            money : true
        }
    },[])

    const funcsSlice = {
        setActiveBtn,
    }

    const navigate = useNavigate()

    useEffect(()=>{
        if (location !== +locationId && role !== ROLES["Director"]) {
            navigate(-1)
        }
    },[location, locationId, navigate, role])

    return (
       <>

           <SampleUsers
               fetchUsersStatus={fetchStudyingStudentsStatus}
               funcsSlice={funcsSlice}
               activeRowsInTable={activeItems}
               users={studyingStudents}
               filters={filters}
               btns={btns}
               totalCount={totalCount}
               pageSize={pageSize}
               status={false}
               onPageChange={setCurrentPage}
               currentPage2={currentPage}
               search={search}
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
       </>

    );
};

export default PlatformStudyingStudents;