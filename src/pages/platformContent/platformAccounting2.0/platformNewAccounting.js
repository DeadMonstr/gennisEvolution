import {AccountingHeader} from "./accountingHeader/accountingHeader";
import {AccountingFilter} from "./accountingFilter/accountingFilter";
import {AccountingTable} from "./accountingTable/accountingTable";
import cls from "./platfromNewAccounting.module.sass"
import Pagination, {ExtraPagination} from "components/platform/platformUI/pagination";
import React, {useState} from "react";

const PlatformNewAccounting = () => {
    const [currentPage, setCurrentPage] = React.useState(1);
    const [search , setSearch] = useState("")
    const pageSize = 50

    return (
        <div className={cls.accounting}>
            <AccountingHeader setSearch={setSearch} search={search}/>
            <AccountingFilter search={search} setCurrentPage={setCurrentPage} pageSize={pageSize} currentPage={currentPage}/>
            <AccountingTable setCurrentPage={setCurrentPage} pageSize={pageSize} currentPage={currentPage}/>
        </div>
    );
};

export default PlatformNewAccounting;