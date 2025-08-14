import React, {useCallback, useEffect, useMemo} from 'react';
import {useDispatch} from "react-redux";

import Button from "components/platform/platformUI/button";
import "./filter.sass";
import FilterFromTo from "components/platform/platformUI/filters/filterFromTo";
import FilterSelect from "components/platform/platformUI/filters/filterSelect";
import {setActive, setActiveFilter} from "slices/filtersSlice";

const AccountFilters = React.memo(({activeOthers, heightOtherFilters, filterRef, filters}) => {
    const dispatch = useDispatch();

    const clazzOtherFilters = activeOthers ? "otherFilters otherFilters_active" : "otherFilters ";

    const style = useMemo(() => ({
        height: heightOtherFilters + "px"
    }), [heightOtherFilters]);

    const styleOtherFilters = activeOthers ? style : null;



    const onChangeActiveFilter = useCallback((key,value) => {
        dispatch(setActiveFilter({key,value}))
    },[])


    const renderFilters = useCallback(() => {
        const filtersKeys = Object.keys(filters);

        return filtersKeys?.map((key, index) => {
            if (filters[key].type === "select") {
                return (
                    <div data-key={index} key={index} className="otherFilters__item">
                        <h2>{filters[key].title}:</h2>
                        <div>
                            <FilterSelect
                                onChangeActiveFilter={onChangeActiveFilter}
                                options={filters[key].filtersList}
                                activeFilter={key}
                                name={filters[key].name}
                            />
                        </div>
                    </div>
                )
            } else if (filters[key].type === "btn") {
                return (
                    <div data-key={index} key={index} className="otherFilters__item">
                        <h2>{filters[key].title}:</h2>
                        <div>
                            <FilterSubItem
                                onChangeActiveFilter={onChangeActiveFilter}
                                activeBtns={filters[key].activeFilters}
                                itemBtns={filters[key].filtersList}
                                activeFilter={key}
                            />
                        </div>
                    </div>
                )
            } else if (filters[key].type === "input") {
                return (
                    <div data-key={index} key={index} className="otherFilters__item">
                        <h2>{filters[key].title}:</h2>
                        <div>
                            <FilterFromTo
                                onChangeActiveFilter={onChangeActiveFilter}
                                activeFilter={key}
                            />
                        </div>
                    </div>
                )
            }
        })
    }, [filters]);

    const renderedFilters = renderFilters();

    return (
        <div>
            <div
                className={clazzOtherFilters}
                style={styleOtherFilters}
                ref={filterRef}
            >
                {renderedFilters}
            </div>

            {/*/!* Test uchun log chiqarish tugmasi *!/*/}
            {/*<Button onClickBtn={logSelectedFilters}>*/}
            {/*    Tanlanganlarni Ko‘rish*/}
            {/*</Button>*/}
        </div>
    );
});

const FilterSubItem = React.memo(({itemBtns, activeFilter, activeBtns,onChangeActiveFilter}) => {
    const dispatch = useDispatch();

    const onChangeFilter = (subFilter, activeFilter) => {
        dispatch(setActive({activeFilter: activeFilter, subFilter: subFilter}));
        if (onChangeActiveFilter) {
            onChangeActiveFilter(activeFilter, subFilter);
        }
    };

    return itemBtns.map((item, index) => {
        if (Array.isArray(activeBtns)) {
            return (
                <Button
                    key={index}
                    onClickBtn={() => onChangeFilter(item, activeFilter)}
                    active={activeBtns.includes(item)}
                >
                    {item}
                </Button>
            )
        } else {
            return (
                <Button
                    key={index}
                    onClickBtn={() => onChangeFilter(item, activeFilter)}
                    active={item === activeBtns}
                >
                    {item}
                </Button>
            )
        }
    });
});

export default AccountFilters;
