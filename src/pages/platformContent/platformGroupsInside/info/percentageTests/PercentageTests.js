import React from 'react';
import classNames from "classnames";
import cls from "./percentageTests.module.sass";


const PercentageTests = ({data}) => {

    return (
        <div className={classNames(cls.item, cls.information)}>
            <div className={cls.information__header}>
                <h1>Test Foizi</h1>
            </div>
            <div className={cls.information__container}>
                {
                    data.map(item => {
                        return (
                            <div className={cls.information__item}>
                                <span>{item.level}: </span>
                                <span>{item.percentage}</span>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
};

export default PercentageTests;