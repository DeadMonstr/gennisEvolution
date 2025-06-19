import React from 'react';

import cls from "./table.module.sass"

const Table = ({children,className}) => {
    return (
        <div className={`${cls.tableBox} ${className}`}>
            <table>
                {children}
            </table>
        </div>
    );
};

export default Table;