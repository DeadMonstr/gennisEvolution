import React, {useEffect, useState} from 'react';


import cls from "./platformAdminRating.module.sass"
import Select from "components/platform/platformUI/select";
import Input from "components/platform/platformUI/input";
import Table from "components/platform/platformUI/table";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";
import {useParams} from "react-router-dom";
import * as PropTypes from "prop-types";

import CanvasJSReact from '@canvasjs/react-stockcharts';
import {useDispatch, useSelector} from "react-redux";
import dataToChange, {fetchDataToChange} from "slices/dataToChangeSlice";

let CanvasJSChart = CanvasJSReact.CanvasJSChart;
let CanvasJSStockChart = CanvasJSReact.CanvasJSStockChart;


const PlatformAdminRating = () => {



    const [year,setYear] = useState("")
    const [month,setMonth] = useState("all")


    const [data,setData] = useState([])
    const {dataToChange} = useSelector(state => state.dataToChange)
    

    const {request} = useHttp()
    const dispatch = useDispatch()


    useEffect(() => {
        dispatch(fetchDataToChange())
    },[])




    useEffect(() => {
        request(`${BackUrl}`, "GET")
    },[])


    const onChangeYear = (e) => {
        setMonth("all")
        setYear(e)
    }




    return (
        <div className={cls.adminRating}>

            <div className={cls.header}>


                <div className={cls.item}>
                    <Select options={dataToChange.years} title={"Yil"} onChangeOption={onChangeYear}/>
                    <Select

                        all={true}
                        keyName={"month"}
                        options={dataToChange?.years?.filter(item => item.value === year)[0]?.months}
                        title={"Oy"}
                        onChangeOption={setMonth}
                    />

                </div>
            </div>



            <div className={cls.conatiner}>
                <RatingTable   />
            </div>
        </div>
    );
};


const RatingTable = ({items}) => {


    const renderItems = () => {

    }


    return (
        <Table>
            <tr>
                <th>№</th>
                <th>Admin</th>
                <th>Filiallar</th>
                <th>Qarzdorlar</th>
                <th>Yangi o'quvchilar</th>
                <th>Lead</th>
            </tr>
        </Table>
    )
}



const RenderChart = ({newData}) => {

    const [data, setData] = useState([])

    const {request} = useHttp()


    useEffect(() => {
        if (newData.length) {
            setData(newData)
        }
    },[newData])



    const options = {
        animationEnabled: true,
        exportEnabled: true,
        theme: "light1", //"light1", "dark1", "dark2"


        rangeSelector: {
            enabled: false
        },

        dataPointMaxWidth: 50,
        charts: [{
            data: [{
                dataPoints: data
            }]
        }],
        navigator: {
            slider: {
                minimum: 0
            }
        }
    }

    // console.log(options.data[0].dataPoints.length)


    return (
        <div className={cls.rating}>
            <h1>Observation Statistics</h1>

            <div className={cls.wrapper}>
                <CanvasJSStockChart containerProps={{width: '100%', height: '300px'}} options={options}/>
            </div>
        </div>
    )
}

export default PlatformAdminRating;