import {memo, useCallback, useEffect, useState} from 'react';
import classNames from "classnames";

import cls from "./select.module.sass";

export const  Select = memo(({
                                 options,
                                 keyValue,
                                 required,
                                 defaultValue,
                                 title,
                                 onChangeOption,
                                 status,
                                 extraClass,
                                 register,
                                 name
                             }) => {

    const [selectOption, setSelectOption] = useState("");
    const [optionsData, setOptionsData] = useState([]);
    const [isChanged, setIsChanged] = useState(false);


    useEffect(() => {
        setOptionsData(options);
    }, [options]);

    useEffect(() => {

        if (defaultValue) {
            if (defaultValue === "clear") {
                setSelectOption("");
            } else {
                setSelectOption(defaultValue);
            }
            setIsChanged(true)
        }
    }, [defaultValue]);

    useEffect(() => {
        if (isChanged) {
            if (!selectOption) return;
            if (onChangeOption) onChangeOption(selectOption);
            setIsChanged(false);
        }
    }, [selectOption, onChangeOption, isChanged]);


    const renderOptionsOfSelect = useCallback(() => {
        return optionsData?.map((item, index) => {
            const value = item[keyValue] || item?.value || item?.id || item?.name || item;
            const key = item?.name || item?.number || item?.days || item?.num || item?.user && `${item?.user?.name} ${item.user?.surname}` || item;

            return (
                <option
                    disabled={item?.disabled}
                    key={index}
                    value={value}
                >
                    {key}
                </option>
            )
        });
    }, [optionsData, keyValue]);


    const renderedOptions = renderOptionsOfSelect();

    return register ? (
        <label className={classNames(cls.label, extraClass)}>
            {
                title ?
                    <div className={cls.info}>
                        <span className={cls.info__inner}>
                            {title}
                        </span>
                    </div>
                    : null
            }
            <select
                disabled={status === "disabled"}
                className={classNames(cls.label__inner, extraClass, {
                    [cls.error]: status === "error"
                })}
                required={required}
                value={selectOption}
                {...register(name, {
                    value: selectOption,
                    defaultValue: selectOption,
                    onChange: onChangeOption ? (e) => {
                        setSelectOption(e.target.value)
                        setIsChanged(true)
                    } : (e) => {
                        setSelectOption(e.target.value)
                    }
                })}
            >
                {title ? <option value={""} disabled>{title}</option> : <option value={""} disabled>Tanlang</option>}
                {renderedOptions}
            </select>
            {status === "error" ? <span className={cls.label__error}>Error</span> : null}
        </label>
    ) : (
        <label className={classNames(cls.label, extraClass)}>
            {
                title ?
                    <div className={cls.info}>
                        <span className={cls.info__inner}>
                            {title}
                        </span>
                    </div>
                    : null
            }
            <select
                disabled={status === "disabled"}
                className={classNames(cls.label__inner, extraClass, {
                    [cls.error]: status === "error"
                })}
                required={required}
                value={selectOption}
                onChange={(e) => {
                    setSelectOption(e.target.value);
                    setIsChanged(true);
                }}
            >
                <option value={""} disabled>Tanlang</option>

                {/*{title ? <option value={""}>{title}</option> : <option value={""} disabled>Tanlang</option>}*/}
                {renderedOptions}
            </select>
            {status === "error" ? <span className={cls.label__error}>Error</span> : null}
        </label>
    )
});
