import React, {useEffect, useState} from 'react';
import cls from 'pages/platformContent/platformParentSection/platformParentSection.module.sass'
import img from "assets/user-interface/user_image.png";
import {useForm} from "react-hook-form";
import {BackUrl, BackUrlForDoc, headers} from "../../../constants/global";
import Input from "../../../components/platform/platformUI/input";
import Button from "../../../components/platform/platformUI/button";
import cardBg from "assets/background-img/TaskCardBack3.png"
import userImg from "assets/user-interface/user_image.png"
import Modal from "../../../components/platform/platformUI/modal";
import Table from "../../../components/platform/platformUI/table";
import {
    fetchParentData,
    onAddChildrenToParent,
    onChangeParentSource,
    onRemoveChildrenFromParent
} from "../../../slices/parentSectionSlice";
import {useDispatch, useSelector} from "react-redux";
import InputForm from "../../../components/platform/platformUI/inputForm";
import WebButton from "../../../components/webSite/webSiteUI/webButton/webButton";
import {fetchNewFilteredStudents} from "../../../slices/newStudentsSlice";
import {useParams} from "react-router-dom";
import {fetchStudyingStudents} from "../../../slices/studyingStudentsSlice";
import {useHttp} from "../../../hooks/http.hook";
import {setMessage} from "../../../slices/messageSlice";
import Confirm from "../../../components/platform/platformModals/confirm/confirm";
import ConfimReason from "../../../components/platform/platformModals/confirmReason/confimReason";
import PlatformSearch from "../../../components/platform/platformUI/search";


const datas = [
    {
        id: 1,
        name: "Shaha",
        surname: "Unarov",
        subject: "Ingliz",
        balanse: 400000,
        time: "12:00-14:00",
        url: userImg
    },
]

const PlatformParentSection = () => {

    const locationId = localStorage.getItem("location_id")
    const [childModal, setChildModal] = useState(false)
    const [editable, setEditable] = useState(false)
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [deletePortal, setDeletePortal] = useState(false);
    const [isConfirm, setIsConfirm] = useState(false)
    const [studentId, setStudentId] = useState([]);
    const [filteredStudyingStudents, setFilteredStudyingStudents] = useState([])
    const [search, setSearch] = useState("")
    const {studyingStudents} = useSelector(state => state.studyingStudents)
    const {register, handleSubmit, setValue} = useForm()
    const dispatch = useDispatch();
    const {data} = useSelector(state => state.parentSlice)
    const children = data.children
    const {request} = useHttp()
    const {id} = useParams()
    useEffect(() => {
        dispatch(fetchParentData(id))
        dispatch(fetchStudyingStudents(locationId))
    }, []);

    useEffect(() => {
        if (studyingStudents)
            setFilteredStudyingStudents(studyingStudents)
    }, [studyingStudents])

    console.log(data, "da")

    useEffect(() => {
        setFilteredStudyingStudents(
            studyingStudents.filter(item =>
                    item.name.toLowerCase().includes(search.toLowerCase()) ||
                    item.surname.toLowerCase().includes(search.toLowerCase()) ||
                    item.username.toLowerCase().includes(search.toLowerCase())
                )
        )
    }, [search])

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedItems([]);
        } else {
            setSelectedItems(filteredStudyingStudents.map(item => item.student_id));
        }
        setSelectAll(!selectAll);
    };
    console.log(children)

    const handleSelectItem = (id) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(item => item !== id));
            setSelectAll(false);
        } else {
            const newSelected = [...selectedItems, id];
            setSelectedItems(newSelected);
            if (newSelected.length === filteredStudyingStudents.length) {
                setSelectAll(true);
            }
        }
    };


    const onHanle = () => {
        setChildModal(!childModal)
    }
    const onHandleClick = () => {
        setEditable(!editable)

    }
    const formatToInputDate = (str) => {
        const [day, month, year] = str.split('.');
        return `${year}-${month}-${day}`; // yyyy-mm-dd
    };

    const onSubmit = (data) => {
        return request(`${BackUrl}parent/crud/${id}`, "PUT", JSON.stringify(data), headers())
            .then(res => {
                dispatch(onChangeParentSource(res))
                dispatch(setMessage({
                    msg: "Ma'lumot o'zgartirildi",
                    type: "success",
                    active: true
                }))
                setChildModal(false);
                setEditable(false);
            })
    }

    const getConfirm = async () => {

        const body = {
            student_id: studentId
        }

        return await request(`${BackUrl}parent/remove_students/${id}`, "POST", JSON.stringify(body), headers())
            .then(res => {
                console.log(res, 're')
                dispatch(onRemoveChildrenFromParent(res))
                setIsConfirm(false)
                setDeletePortal(false)
                dispatch(setMessage({
                    msg: "Farzand o'chirildi",
                    type: "success",
                    active: true
                }));

            })
    }

    const onHandleSubmit = async () => {
        console.log("dasd")
        const body = {
            student_ids: selectedItems
        };

        return await request(`${BackUrl}parent/add_students/${id}`, "POST", JSON.stringify(body), headers())
            .then(res => {
                dispatch(onAddChildrenToParent(res))
                setChildModal(false);
                setSelectedItems([]);
                setSelectAll(false);

                dispatch(setMessage({
                    msg: "Farzand qo'shildi",
                    type: "success",
                    active: true
                }));

            })


    };


    const renderCards = () => {
        return children?.map(item => (
            <div className={cls.card}>
                <div className={cls.card__info}>
                    <div className={cls.card__info__header}>
                        <span>Fan: {item.subject}</span>
                    </div>
                    <div className={cls.card__info__user}>
                        <div className={cls.card__info__user__detail}>
                            <h2 className={cls.card__info__user__detail__key}>Ism:</h2>
                            <h2 className={cls.card__info__user__detail__content}>
                                {item.name}
                            </h2>
                        </div>
                        <div className={cls.card__info__user__detail}>
                            <h2 className={cls.card__info__user__detail__key}>Familiya:</h2>
                            <h2 className={cls.card__info__user__detail__content}>
                                {item.surname}
                            </h2>
                        </div>
                        <div className={cls.card__info__user__detail}>
                            <h2 className={cls.card__info__user__detail__key}>Balans:</h2>
                            <h2 className={cls.card__info__user__detail__content}>
                                {item.balance}
                            </h2>
                        </div>
                        <div className={cls.card__info__user__detail}>
                            <h2 className={cls.card__info__user__detail__key}>Dars vaqti:</h2>
                            <h2 className={cls.card__info__user__detail__content}>
                                {item.lesson_times?.map(item => item.time)}
                            </h2>
                        </div>
                    </div>
                </div>
                <div style={{background: `url(${cardBg})`}} className={cls.card__userImgBox}>
                    <div className={cls.card__userImgBox__img}>
                        <img className={cls.card__userImgBox__img__photo} src={userImg} alt=""/>
                    </div>
                </div>
                {
                    editable ? <button onClick={() => {
                        setDeletePortal(true)
                        setStudentId(item.id)
                    }}
                                       className={cls.card__closeBtn}>X</button> : null
                }

            </div>
        ))
    }
    const renderTable = () => {
        return filteredStudyingStudents.map((item, index) => (
            <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.name} {item.surname}</td>
                <td>{item.age}</td>
                <td>{item.number}</td>
                <td>
                    <input type="checkbox"
                           checked={selectedItems.includes(item.student_id)}
                           onChange={() => handleSelectItem(item.student_id)}/>
                </td>
            </tr>
        ))
    }
    const portal = () => {
        return (
            <Modal activeModal={childModal} setActiveModal={setChildModal}>
                <div className={cls.modal}>
                    <div className={cls.modal__header}>
                        <h1>Qo'shish</h1>
                        <PlatformSearch
                            search={search}
                            setSearch={setSearch}
                        />
                    </div>
                    <Table className={cls.modal__table}>
                        <thead>
                        <th>№</th>
                        <th>Ism Familiya</th>
                        <th>Yosh</th>
                        <th>Telefon raqam</th>
                        <th>
                            <input className={cls.checkbox} type="checkbox"
                                   checked={selectAll}
                                   onChange={handleSelectAll}/>
                        </th>
                        </thead>
                        <tbody>
                        {renderTable()}
                        </tbody>
                    </Table>
                    <Button extraClass={cls.modal__btn} onClickBtn={onHandleSubmit}>Qo'shmoq</Button>
                </div>
            </Modal>
        )
    }


    return (
        <div className={cls.main}>
            <div className={cls.main__leftBar}>
                <div className={cls.main__leftBar__profileBox}>
                    <div className={cls.main__leftBar__profileBox__bio}>
                        <img rel="preload" className={cls.main__leftBar__profileBox__bio__img} crossOrigin="Anonymous"
                             src={img} alt=""/>
                        <h2>{data.name} {data.surname}</h2>
                        <span>
                            {data.sex === "Erkak" ? "Ota" : "Ona"}
                        </span>
                        {
                            editable ? (
                                    <form onSubmit={handleSubmit(onSubmit)}
                                          className={cls.main__leftBar__profileBox__bio__sources}>
                                        <InputForm clazz={cls.main__leftBar__profileBox__bio__sources__ints}
                                                   title={'Ism'}
                                                   register={register}
                                                   name={"name"}
                                                   defaultValue={data.name}/>
                                        <InputForm clazz={cls.main__leftBar__profileBox__bio__sources__ints}
                                                   title={'Familya'}
                                                   name={"surname"}
                                                   register={register}
                                                   defaultValue={data.surname}/>
                                        <InputForm clazz={cls.main__leftBar__profileBox__bio__sources__ints}
                                                   title={'Tel raqam'}
                                                   name={"phone"}
                                                   register={register}
                                                   defaultValue={data.phone}/>
                                        <InputForm clazz={cls.main__leftBar__profileBox__bio__sources__ints}
                                                   title={'Address'}
                                                   register={register}
                                                   name={'address'}
                                                   defaultValue={data.address}/>
                                        <InputForm clazz={cls.main__leftBar__profileBox__bio__sources__ints}
                                                   title={'Birthday'}
                                                   name={'birthday'}
                                                   register={register}
                                                   type={'date'}
                                                   defaultValue={data.birth_day}
                                        />
                                        <button className={cls.main__leftBar__profileBox__bio__sources__int}
                                                children={"Tahrirlash"}></button>
                                    </form>
                                ) :
                                (
                                    <div className={cls.main__leftBar__profileBox__bio__source}>
                                        <Input clazz={cls.main__leftBar__profileBox__bio__int}
                                               title={'Ism'}
                                               onChange={() => "sas"}
                                               readOnly={true}
                                               value={data.name}/>
                                        <Input clazz={cls.main__leftBar__profileBox__bio__int}
                                               title={'Familiya'}
                                               onChange={() => "sas"}
                                               readOnly={true}
                                               value={data.surname}/>
                                        <Input clazz={cls.main__leftBar__profileBox__bio__int}
                                               title={'Tel raqam'}
                                               onChange={() => "sas"}
                                               readOnly={true}
                                               value={data.phone}/>
                                        <Input clazz={cls.main__leftBar__profileBox__bio__int}
                                               title={'Address'}
                                               onChange={() => "sas"}
                                               readOnly={true}
                                               value={data.address}/>
                                        <Input clazz={cls.main__leftBar__profileBox__bio__int}
                                               title={'Birthday'}
                                               onChange={() => "sas"}
                                               readOnly={true}
                                               value={data.birth_day}/>
                                    </div>
                                )
                        }

                    </div>
                </div>
            </div>
            <div className={cls.main__rightBar}>
                <div className={cls.main__rightBar__header}>
                    <h1>Farzandim</h1>
                    <Button onClickBtn={onHandleClick} extraClass={cls.main__rightBar__header__editBtn}
                            children={<i className={"fas fa-pen"}/>}/>
                </div>
                <Button onClickBtn={onHanle} extraClass={cls.main__rightBar__itemsBox__btn}
                        children={<i className="fas fa-plus"/>}/>
                <div className={cls.main__rightBar__itemsBox}>
                    {renderCards()}

                </div>
            </div>
            <div>
                <Modal activeModal={deletePortal} setActiveModal={() => setDeletePortal(!deletePortal)}>
                    <Confirm
                        setActive={setDeletePortal}
                        text={"Bu farzandni o'chirmoqchimisz ?"}
                        getConfirm={setIsConfirm}
                    />
                </Modal>
                {
                    isConfirm === "yes" ?
                        <Modal
                            activeModal={deletePortal}
                            setActiveModal={() => {
                                setDeletePortal(false)
                                setIsConfirm(false)
                            }}
                        >
                            <ConfimReason getConfirm={getConfirm} reason={true}/>
                        </Modal> : null
                }
            </div>
            {portal()}

        </div>
    );
};
export default PlatformParentSection
