import {useDispatch, useSelector} from "react-redux";
import {useEffect, useMemo, useState} from "react";
import {
    fetchBlockTests,
    fetchBlockTestsSchool, fetchDefenations,
} from "../../../slices/blockTestSlice";
import cls from "./blockTest.module.sass"
import PlatformSearch from "../../../components/platform/platformUI/search";
import Select from "../../../components/platform/platformUI/select";

import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "../../../constants/global";
import {fetchFilters} from "../../../slices/filtersSlice";
import {useParams} from "react-router-dom";
import Button from "components/platform/platformUI/button";
import Modal from "components/platform/platformUI/modal";
import Input from "../../../components/platform/platformUI/input";
import {InputTest} from "components/platform/platformUI/inputTest/inputTest";
import {useForm} from "react-hook-form";
import Form from "components/platform/platformUI/form/Form";


const lan= [
    {name: "UZ"},
    {name: "RU"},
]
const PlatformBlockTest = () => {
    const dispatch = useDispatch()
    const [search, setMainSearch] = useState("");
    const [selectedSchool, setSelectedSchool] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [activeModal, setActive] = useState(false)
    const [activeFilter, setActiveFilter] = useState(false)
    const [defenation, setDefenation] = useState(false)
    const [lang, setLang] = useState(false)

    const {data, school, defenations} = useSelector(state => state.blockTestSlice)
    const {request} = useHttp()
    const {locationId} = useParams()
    useEffect(() => {
        // dispatch(fetchBlockTests())
        dispatch(fetchBlockTestsSchool())
        dispatch(fetchDefenations())
    }, [dispatch])



    const fetchFilteredData = () => {
        const queryParams = {
            ...(selectedSchool && {school_id: selectedSchool}),
            ...(defenation && {defenation_id: defenation}),
            ...(lang && {languages_id: lang}),
        };

        const query = new URLSearchParams(queryParams).toString();

        request(`${BackUrl}students_test?${query}&location_id=${locationId}`, "GET", null, headers())
            .then(res => {
                setFilteredData(res)
                console.log(res)
            })
            .catch(err => console.error("Error fetching data:", err));
    };

    useEffect(() => {
        fetchFilteredData();
    }, [search, selectedSchool , defenation , lang]);

    const searchedFilteredUsers = useMemo(() => {
        const dataMain = filteredData ? filteredData : data

        return dataMain.filter(item => {
            const matchesSearch = (
                item.name?.toLowerCase().includes(search.toLowerCase()) ||
                item.surname?.toLowerCase().includes(search.toLowerCase()) ||
                item.school_name?.toLowerCase().includes(search.toLowerCase()) ||
                item.faculty_name?.toLowerCase().includes(search.toLowerCase()) ||
                item.university_name?.toLowerCase().includes(search.toLowerCase()) ||
                item.unique_id.toLowerCase().includes(search.toLowerCase())
            );

            return matchesSearch
        });
    }, [data, search, filteredData]);


    return (
        <div className={cls.blockTest}>
            <header>
                {
                    activeFilter ? <div className={cls.select}>


                            <Select
                                onChangeOption={setSelectedSchool}
                                title={"Maktab"}
                                options={school}
                            />
                            <Select
                                onChangeOption={setDefenation}
                                title={"Yo'nalish bo'yicha"}
                                options={defenations}
                            />
                            <Select
                                onChangeOption={setLang}
                                title={"Yo'nalish bo'yicha"}
                                options={lan}
                            />
                            <Button onClickBtn={() => setActiveFilter(false)}>
                                Filter
                            </Button>
                        </div> :


                        <>
                            <PlatformSearch search={search} setSearch={setMainSearch}/>
                            <Button onClickBtn={() => setActive(true)}>
                                Yo'nalish qo'shish
                            </Button>
                            <Button onClickBtn={() => setActiveFilter(true)}>
                                Filter
                            </Button>
                        </>
                }

            </header>
            <div className={cls.table}>
                <table>
                    <thead>
                    <tr>
                        <th>№</th>
                        <th>Ism</th>
                        <th>Familiya</th>
                        <th>Unique ID</th>
                        <th>Ota-ona FIO</th>
                        <th>Telefon raqami</th>
                        <th>Maktabi</th>
                        <th>Yo'nalishi</th>
                        <th>Tilli</th>
                        {/*<th>Universitet nomi</th>*/}
                        {/*<th>Fakultet nomi</th>*/}
                    </tr>
                    </thead>
                    <tbody>
                    {searchedFilteredUsers.map((item, i) => (
                        <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{item.name}</td>
                            <td>{item.surname}</td>
                            <td>{item.unique_id}</td>
                            <td>{item.father_name}</td>
                            <td>{item.phone}</td>
                            <td>{item.school_name}</td>
                            <td>{item.defenation_name}</td>
                            <td>{item.language}</td>
                            {/*<td>{item.university_name}</td>*/}
                            {/*<td>{item.faculty_name}</td>*/}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <AddDefination setActive={setActive} activeModal={activeModal}/>
        </div>
    );
};


export const AddDefination = ({setActive, activeModal}) => {
    const {register, setValue, handleSubmit} = useForm()

    const {request} = useHttp()

    const onClick = (data) => {
        request(`${BackUrl}defenations`, "POST", JSON.stringify(data), headers())
            .then(res => {
                setActive(false)
                setValue("name", "")
            })
    }
    return (
        <Modal setActiveModal={setActive} activeModal={activeModal}>
            <div className={cls.modal}>
                <Form onSubmit={handleSubmit(onClick)}>
                    <InputTest required={true} title={"Yo'nalish nomi"} register={register} name={'name'}/>

                </Form>
            </div>
        </Modal>
    )
}

export default PlatformBlockTest