import Select from "../../../../components/platform/platformUI/select";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {fetchData, fetchYear} from "../../../../slices/otchotSlice";
import {useParams} from "react-router-dom";
import {fetchDataToChange} from "../../../../slices/dataToChangeSlice";
import Button from "../../../../components/platform/platformUI/button";
import cls from "./otchot.module.sass"
import {useHttp} from "../../../../hooks/http.hook";
import Table from "../../../../components/platform/platformUI/table";

const OtchotPage = () => {
    const {year, data} = useSelector(state => state.otchotSlice)


    const {dataToChange} = useSelector(state => state.dataToChange)
    const dispatch = useDispatch()
    const {locationId} = useParams()

    const [years, setYears] = useState(null)
    const [months, setMonth] = useState(null)
    const [activePayment, setActivePayment] = useState(null)

    const {request} = useHttp()
    useEffect(() => {
        dispatch(fetchYear())

        dispatch(fetchDataToChange(locationId))
    }, [])


    useEffect(() => {


        const res = {
            month_id: year.filter(item => item?.value === years)[0]?.months.filter(item => item.month === months)[0]?.id,
            years_id: year.filter(item => item.value === years)[0]?.id,
            payment_type_id: activePayment,
        }

        if (activePayment && months && years) {
            dispatch(fetchData({id: locationId, data: res}))
        }

    }, [activePayment, months, years])

    const renderData = () => {
        return dataToChange?.payment_types?.map(item => (
            <Button active={item.id === activePayment}  onClickBtn={() => setActivePayment(item.id)}>
                {item.name}
            </Button>
        ))
    }
    const style = {
        display: "flex",

    }

    const formatSalary = (salary) => {
        return Number(salary).toLocaleString();
    };

    return (
        <div className={cls.otchot}>
            <div className={cls.otchot__wrapper}>

                <div>
                    <h1>Umumiy : {formatSalary(data.overall)}</h1>
                </div>

                <div>
                    <div style={style}>
                        <Select title={"Yilni tanlang"} options={year} onChangeOption={setYears}/>
                        {years ? <Select
                            title={"Oyni tanlang"}
                            options={year.filter(item => item?.value === years)[0]?.months.map(itemMonth => itemMonth.month)}
                            onChangeOption={setMonth}
                        /> : null}
                    </div>
                    <div style={style}>
                        {renderData()}
                    </div>
                </div>
            </div>

            <div className={cls.table}>
                <div>
                    <RenderLeft formatSalary={formatSalary} data={data}/>

                    <h1>Umumiy summa : {formatSalary(data.left_total)}</h1>
                </div>

                <div>
                    <RenderRight data={data} formatSalary={formatSalary}/>
                    <h1>Umumiy summa : {formatSalary(data.right_total)}</h1>
                </div>
            </div>
        </div>
    );
};


const RenderLeft = ({data , formatSalary}) => {


    const renderData = () => {
        return data?.left?.map((item, i) => (
            <tr>
                <td>{i + 1}</td>
                <td>{item?.type_name ? item.type_name : item.desc}</td>
                <td>{formatSalary(item?.amount ? item.amount : item.amount_sum)}</td>
                <td>{item?.date ? item.date : item.day}</td>
            </tr>
        ))
    }

    return (

        <Table className={cls.tableExtra}>
            <thead>
            <tr>
                <th>No</th>
                <th>Nomi</th>
                <th>To'lov summasi</th>
                <th>Sanasi</th>

            </tr>
            </thead>
            <tbody>
            {renderData()}
            </tbody>
        </Table>

    )
}


const RenderRight = ({data , formatSalary}) => {


    const renderData = () => {
        return data?.right?.map((item, i) => (
            <tr>
                <td>{i + 1}</td>
                <td>{item?.type_name ? item.type_name : item.reason}</td>
                <td>{formatSalary(item?.amount ? item.amount : item.amount_sum)}</td>
                <td>{item?.date ? item.date : item.day}</td>
            </tr>
        ))
    }

    return (

        <Table className={cls.tableExtra}>
            <thead>
            <tr>
                <th>No</th>
                <th>Nomi</th>
                <th>To'lov summasi</th>
                <th>Sanasi</th>
            </tr>
            </thead>
            <tbody>
            {renderData()}
            </tbody>

        </Table>

    )
}


export default OtchotPage