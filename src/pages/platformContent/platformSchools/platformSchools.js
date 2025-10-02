import React, {useEffect, useMemo, useState} from 'react';


import cls from "./platformSchools.module.sass"
import Table from "components/platform/platformUI/table";
import Pagination from "components/platform/platformUI/pagination";
import Modal from "components/platform/platformUI/modal";
import Select from "components/platform/platformUI/select";
import Input from "components/platform/platformUI/input";
import Button from "components/platform/platformUI/button";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";
import Search from "components/platform/platformUI/search";
import {useDispatch, useSelector} from "react-redux";
import {fetchSchools} from "slices/schoolsSlice";
import {useNavigate, useParams} from "react-router-dom";
import {setMessage} from "slices/messageSlice";


const PlatformSchools = () => {

    const {id} = useParams()

    const {data} = useSelector(state => state.schools)


    const [search, setSearch] = useState("")
    const [active, setActive] = useState(false)

    let PageSize = useMemo(() => 50, [])
    const [currentPage, setCurrentPage] = useState(1);


    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return data.slice(firstPageIndex, lastPageIndex);
    }, [PageSize, currentPage, data]);

    const onOpenModal = () => {
        setActive(true)
    }


    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchSchools(id))
    },[id])


    const navigate = useNavigate()

    const onLink = (id) => {
        navigate(`../school/${id}`)
    }



    return (
        <div className={cls.schools}>
            <h1>Maktablar</h1>
            <div className={cls.header}>
                <Search search={search} setSearch={setSearch}/>

                <div className={cls.add} onClick={onOpenModal}>
                    <i className="fas fa-plus"></i>
                </div>
            </div>

            <Table>
                <thead>
                <tr>
                    <th>№</th>
                    <th>Maktab</th>
                    <th>Telefon</th>
                    <th>Tuman</th>
                    <th>Viloyat</th>
                </tr>
                </thead>
                <tbody>
                {
                    currentTableData.map((item,index) => {
                        return (
                            <tr onClick={() => onLink(item?.id)}>
                                <td>{index+1}</td>
                                <td>{item?.number}</td>
                                <td>{item?.phone_number}</td>
                                <td>{item?.district.name}</td>
                                <td>{item?.region.name}</td>
                            </tr>
                        )
                    })
                }
                </tbody>


            </Table>

            <Pagination
                className="pagination-bar"
                currentPage={currentPage}
                totalCount={data.length}
                pageSize={PageSize}
                onPageChange={page => {
                    setCurrentPage(page)
                }}
            />


            <Modal activeModal={active} setActiveModal={setActive}>
                <RegisterSchool setActive={setActive}/>
            </Modal>


        </div>
    );
};


const RegisterSchool = ({setActive}) => {

    const {id} = useParams()


    const [schools, setSchools] = React.useState([])
    const [regions, setRegions] = React.useState([])
    const [districts, setDistricts] = React.useState([])


    const [school, setSchool] = React.useState("")
    const [region, setRegion] = React.useState("")
    const [district, setDistrict] = React.useState("")
    const [phone, setPhone] = React.useState("")



    const {request} = useHttp()



    useEffect(() => {
        request(`${BackUrl}school/school_details`,"GET",null,headers())
            .then(res => {
                setSchools(res.school_numbers)
                setRegions(res.regions)
            })
    },[])


    useEffect(() => {
        if (region) {
            request(`${BackUrl}school/school_details/${region}`,"GET",null,headers())
                .then(res => {
                    setDistricts(res.districts)
                })
        }
    },[region])


    const onChangeRegion = (e) => {
        setRegion(e)
    }

    const onChangeDistrict = (e) => {
        setDistrict(e)
    }

    const onChangeSchool = (e) => {
        setSchool(e)
    }


    const dispatch = useDispatch()


    const onSubmit = () => {

        const data = {
            region,
            district,
            number: school,
            phone
        }



        request(`${BackUrl}school/crud_school`,"POST",JSON.stringify(data),headers())
            .then(res => {
                dispatch(setMessage({
                    msg: "Maktab muvaffaqiyatli qo'shildi",
                    type: "success",
                    active: true
                }))
                dispatch(fetchSchools(id))
                setActive(false)


            })
    }



    return (
        <div className={cls.register}>
            <h1>Register School</h1>
            <div className={cls.wrapper}>
                <Select
                    onChangeOption={onChangeRegion}
                    options={regions}
                    title={"Viloyat"}
                />
                {region &&  <Select
                    onChangeOption={onChangeDistrict}
                    options={districts}
                    title={"Tuman"}
                />}

                <Select
                    onChangeOption={onChangeSchool}
                    options={schools}
                    title={"Maktab"}
                    keyValue={"number"}
                />
                <Input
                    title={"Maktab tel raqami"}
                    name={"number"}
                    type={"text"}
                    onChange={setPhone}
                />

            </div>
            <Button onClickBtn={onSubmit} type={"submit"}>Register</Button>
        </div>
    )
}

export default PlatformSchools;