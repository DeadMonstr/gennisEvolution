import {useDispatch, useSelector} from "react-redux";
import {
    newAccountingSelectOption,
    newAccountingSelectOptionName, newAccountingSelectOptionValue
} from "../model/accountingSelector";
import Select from "components/platform/platformUI/select";
import {onChangeAccountingPage} from "../model/accountingSlice";
import React, {useCallback} from "react";
import cls from "./accountingHeader.module.sass"
import PlatformSearch from "components/platform/platformUI/search";

export const AccountingHeader = ({search , setSearch}) => {

    const selectOption = useSelector(newAccountingSelectOption)
    const selectOptionName = useSelector(newAccountingSelectOptionName)
    const selectOptionValue = useSelector(newAccountingSelectOptionValue)

    const dispatch = useDispatch()
    const onChangePage = useCallback((e) => {
        dispatch(onChangeAccountingPage(e));
    }, [dispatch]);

    return (
        <div className={cls.header}>

            <PlatformSearch setSearch={setSearch} search={search}/>
            {/*<h1>{selectOptionName}</h1>*/}
            <Select defaultValue={selectOptionValue} options={selectOption} onChangeOption={onChangePage}/>

        </div>
    );
};

