import cls from "../platformTaskManager.module.sass";
import Table from "../../../../components/platform/platformUI/table";
import React from "react";

export const TableData = ({arr}) => {

    const stringCheck = (name, length = 10) => {
        if (name?.length > length) {
            return (
                <>
                    {name.substring(0, length)}...
                    <div className={cls.popup}>
                        {name}
                    </div>
                </>
            )
        }
        return name
    }
    const renderData = () => {
        return arr?.map((item, i) => (
            <tr>
                <td>{i + 1}</td>
                <td>{stringCheck(item.name)}</td>
                <td>{stringCheck(item.surname)}</td>
                <td>{item?.phone}</td>
                <td>{stringCheck(item?.reason, 20)}</td>
            </tr>
        ))
    }
    const render = renderData()


    return (
        <Table className={cls.table_results}>
            <thead>
            <tr>
                <th>No</th>
                <th>Ism</th>
                <th>Familiya</th>
                <th>Telefon raqami</th>
                <th>Sababi</th>
            </tr>
            </thead>
            <tbody>
            {render}
            </tbody>
        </Table>
    )
}