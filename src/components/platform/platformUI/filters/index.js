import React, {useCallback, useMemo, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";

import Button from "components/platform/platformUI/button";


import "./filters.sass"
import FilterFromTo from "components/platform/platformUI/filters/filterFromTo";
import FilterSelect from "components/platform/platformUI/filters/filterSelect";
import {setActive, setDateFilter} from "slices/filtersSlice";
import {setFilters} from "../../../../slices/currentFilterSlice";
import {useSearchParams} from "react-router-dom";
import Input from "components/platform/platformUI/input";

const Filters = React.memo(({activeOthers,heightOtherFilters,filterRef,filters}) => {

    const clazzOtherFilters = activeOthers ? "otherFilters otherFilters_active" : "otherFilters "

    const style = useMemo(() => ({
        height: heightOtherFilters + "px"
    }),[heightOtherFilters])

    const styleOtherFilters = activeOthers ? style : null


    const renderFilters = useCallback(() => {
        const filtersKeys = Object.keys(filters)

        return filtersKeys?.map((key ,index) => {
            if (filters[key].type === "select") {
                return (
                    <div data-key={index} key={index} className="otherFilters__item">
                        <h2>{filters[key].title}:</h2>
                        <div>
                            <FilterSelect
                                options={filters[key].filtersList}
                                activeFilter={key}
                                name={filters[key].name}
                            />
                        </div>
                    </div>
                )
            }
            else if (filters[key].type === "btn") {
                return (
                    <div data-key={index} key={index} className="otherFilters__item">
                        <h2>{filters[key].title}:</h2>
                        <div>
                            <FilterSubItem
                                activeBtns={filters[key].activeFilters}
                                itemBtns={filters[key].filtersList}
                                activeFilter={key}
                            />
                        </div>
                    </div>
                )
            }
            else if (filters[key].type === "input") {
                return (
                    <div data-key={index} key={index} className="otherFilters__item">
                        <h2>{filters[key].title}:</h2>
                        <div>
                            <FilterFromTo
                                activeFilter={key}
                            />
                        </div>
                    </div>
                )
            }
            else if (filters[key].type === "date") {
                return (
                    <div data-key={index} key={index} className="otherFilters__item">
                        <h2>{filters[key].title}:</h2>
                        <div>
                            <FilterDate
                                activeFilter={key}
                            />
                        </div>
                    </div>
                )
            }



        })
    },[filters])


    const renderedFilters = renderFilters()


    return (
        <div>
            <div
                className={clazzOtherFilters}
                style={styleOtherFilters}
                ref={filterRef}
            >
                {renderedFilters}
            </div>

        </div>
    );
})




const FilterSubItem = React.memo(({funcsSlice,itemBtns,activeFilter,activeBtns}) => {

    const [searchParams, setSearchParams] = useSearchParams();
    const dispatch = useDispatch()

    const {currentFilters} = useSelector(state => state.currentFilterSlice)

    const activeBtn = currentFilters[activeFilter] || null; // redux’dan olamiz

    const onChangeFilter = (subFilter, activeFilter) => {
        let newValue;

        if (activeBtn === subFilter) {
            newValue = null; // qayta bosilsa o‘chadi
        } else {
            newValue = subFilter;
        }

        dispatch(setFilters({ [activeFilter]: newValue }));
        setSearchParams({ ...currentFilters, [activeFilter]: newValue || "" });
    };

    return itemBtns.map( (item,index) => {


        if (Array.isArray(activeBtns)) {
            return (
                <Button
                    key={index}
                    onClickBtn={() => onChangeFilter(item, activeFilter)}
                    active={item === activeBtn} // faqat redux’dagi active ishlaydi
                >
                    {item}
                </Button>


            )
        } else {

            return (
                <Button
                    key={index}
                    onClickBtn={() => onChangeFilter(item,activeFilter)}
                    active={item === activeBtns}
                >
                    {item}
                </Button>

            )
        }

    })
})

const FilterDate = ({ funcsSlice, activeFilter }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { currentFilters } = useSelector(state => state.currentFilterSlice);

    const [from, setFrom] = useState();
    const [to, setTo] = useState();

    const dispatch = useDispatch();

    const onSubmit = (e) => {
        e.preventDefault();
        const fromTo = { from, to };
        const days = { from  , to };

        // Redux filter update
        dispatch(setDateFilter({ activeFilter, fromTo }));
        dispatch(setFilters(days));

        // URL params update
        setSearchParams({ ...currentFilters, ...days });
    };

    return (
        <form className="fromToForm" onSubmit={onSubmit}>
            <div>
                <Input title="От" type={"date"} name="from" onChange={setFrom} />
                <Input title="До" type={"date"}  name="to" onChange={setTo} />
            </div>
            <input className="input-submit" type="submit" />
        </form>
    );
}



export default Filters;
