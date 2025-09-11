import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useSearchParams} from "react-router-dom";
import {setFromToFilter} from "slices/filtersSlice";
import Input from "components/platform/platformUI/input";


import "styles/components/_form.sass"
import "./filterFromTo.sass"
import {setFilters} from "../../../../../slices/currentFilterSlice";


const FilterFromTo = ({funcsSlice, activeFilter}) => {

    const [searchParams, setSearchParams] = useSearchParams();

    const {currentFilters} = useSelector(state => state.currentFilterSlice)

    const [from, setFrom] = useState()
    const [to, setTo] = useState()


    const dispatch = useDispatch()


    const onSubmit = (e) => {
        e.preventDefault()

        console.log(true)

        const fromTo = {
            from, to
        }
        const age = {age: `${from}-${to}`}

        dispatch(setFromToFilter({activeFilter: activeFilter, fromTo: fromTo}))
        dispatch(setFilters(age))
        setSearchParams({...currentFilters, ...age})
    }

    return (
        <form className="fromToForm" onSubmit={onSubmit}>
            <div>
                <Input title={"От"} name={"from"} onChange={setFrom}/>
                <Input title={"До"} name={"to"} onChange={setTo}/>
            </div>
            <input className="input-submit" type="submit"/>
        </form>
    );
};

export default FilterFromTo;