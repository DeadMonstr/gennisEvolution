import React, {useEffect, useState} from 'react';
import Select from "components/platform/platformUI/select";
import {useDispatch} from "react-redux";
import {setSelectOption} from "slices/filtersSlice";

const FilterSelect = React.memo(({options,activeFilter,name,onChangeActiveFilter}) => {
    const [option,setOption] = useState(null)


    const dispatch = useDispatch()
    useEffect(() => {
        if (option) {
            dispatch(setSelectOption({activeFilter : activeFilter, selectedOption: option}))
        }
    },[option, activeFilter, dispatch])


    const onChangeOption = (e) => {
        setOption(e)
        if (onChangeActiveFilter) {
            onChangeActiveFilter(activeFilter,e)
        }
    }


    return (
        <div>
            <Select all={true} onChangeOption={onChangeOption} options={options} name={"select-filter"} title={name}/>
        </div>
    );
}) ;

export default FilterSelect;