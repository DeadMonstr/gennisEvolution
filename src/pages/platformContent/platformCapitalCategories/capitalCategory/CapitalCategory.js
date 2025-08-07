import React, {useCallback, useEffect, useState} from 'react';

import cls from "pages/platformContent/platformCapitalCategories/capitalCategory/capitalCategory.module.sass"
import {Link, Navigate, NavLink, Route, Routes, useLocation, useNavigate, useParams} from "react-router-dom";
import {BackUrl, BackUrlForDoc, headers, headersImg, ROLES} from "constants/global";

import img from "assets/book.png"
import Button from "components/platform/platformUI/button";
import BackButton from "components/platform/platformUI/backButton/backButton";
import Modal from "components/platform/platformUI/modal";
import Confirm from "components/platform/platformModals/confirm/confirm";
import {useHttp} from "hooks/http.hook";
import {setMessage} from "slices/messageSlice";
import {useDispatch, useSelector} from "react-redux";
import {useForm} from "react-hook-form";
import ImgInput from "components/platform/platformUI/imgInput";
import InputForm from "components/platform/platformUI/inputForm";
import DefaultLoaderSmall from "components/loader/defaultLoader/defaultLoaderSmall";
import {
    fetchCategory, fetchCategoryDeletedCapitals,
    onAddCapitalReducer, onAddSubCategory,
    onChangeCapitalReducer, onChangeCategory,
    onDeleteCapitalReducer
} from "slices/capitalCategorySlice";
import Select from "components/platform/platformUI/select";
import {fetchDataToChange} from "slices/dataToChangeSlice";
import DefaultLoader from "components/loader/defaultLoader/DefaultLoader";
import Table from "components/platform/platformUI/table";
import RequireAuthChildren from "components/requireAuthChildren/requireAuthChildren";


const CapitalCategory = () => {
    const {category, tools, deletedCapitals, fetchCategoryStatus} = useSelector(state => state.capitalCategory)

    const {id, locationId} = useParams()

    const [subCategories, setSubCategories] = useState([])
    const [capitals, setCapitals] = useState([])

    const [activePage, setActivePage] = useState("category")
    const [canDelete, setCanDelete] = useState(false)
    const [canDeleteCapital, setCanDeleteCapital] = useState(false)
    const [activeModal, setActiveModal] = useState(false)
    const [activeAddCapital, setActiveAddCapital] = useState(false)
    const [typeModal, setTypeModal] = useState("add")
    const [day, setDay] = useState(null)
    const [month, setMonth] = useState(null)
    const [isChangedCapital, setIsChangedCapital] = useState({})

    const [loading, setLoading] = useState(false)

    const {register, handleSubmit, setValue, reset} = useForm()
    const {
        register: register2,
        handleSubmit: handleSubmit2,
        setValue: setValue2,
        reset: reset2
    } = useForm();


    const [img, setImg] = useState()
    const [imgCapital, setImgCapital] = useState()
    const {dataToChange} = useSelector(state => state.dataToChange)

    const location = useLocation();

    useEffect(() => {
        setActivePage("category")
    }, [location]);


    useEffect(() => {
        dispatch(fetchCategory({id, locationId}))
        dispatch(fetchDataToChange())
    }, [id])


    useEffect(() => {
        if (Object.keys(category).length) {
            localStorage.setItem("category", category.id)
            setCapitals(category.capitals)
            setSubCategories(category.addition_categories)
        }
    }, [category])

    useEffect(() => {
        if (tools.length && tools?.length < 2) {
            setMonth(tools[0].value)
        }
    }, [tools])

    const {request} = useHttp()
    const dispatch = useDispatch()

    const navigate = useNavigate()
    const onDelete = (data) => {
        if (data === "yes") {
            request(`${BackUrl}account/add_capital_category`, "DELETE", JSON.stringify({category_id: category.id}), headers())
                .then(res => {
                    dispatch(setMessage({
                        msg: res.msg,
                        type: "success",
                        active: true
                    }))
                    setCanDelete(false)
                    navigate(-1)
                })
        }
    }

    const onDeleteCapital = (data) => {
        if (data === "yes") {
            request(`${BackUrl}account/add_capital`, "DELETE", JSON.stringify({capital_id: isChangedCapital.id}), headers())
                .then(res => {
                    setActiveAddCapital(false)
                    setCanDeleteCapital(false)
                    setIsChangedCapital({})
                    dispatch(onDeleteCapitalReducer({id: isChangedCapital.id}))
                    dispatch(setMessage({
                        msg: res.msg,
                        type: "success",
                        active: true
                    }))
                })
            setDay(null)
            reset2()
        }
    }

    const onChange = (data) => {
        const formData = new FormData()

        formData.append(`img`, img);
        formData.append(`info`, JSON.stringify({...data, category_id: category.id,}));
        setLoading(true)

        request(`${BackUrl}account/add_capital_category`, typeModal === "add" ? 'POST' : "PUT", formData, headersImg())
            .then(res => {
                if (typeModal === "change") {
                    dispatch(onChangeCategory({category: res.category}))
                } else {
                    dispatch(onAddSubCategory({category: res.category}))
                }
                dispatch(setMessage({
                    msg: res.msg,
                    type: "success",
                    active: true
                }))
                setImg(null)
                reset()
                setActiveModal(false)
                setLoading(false)
            })
    }

    const onSubmitCapital = (data) => {
        const formData = new FormData()

        formData.append(`img`, imgCapital);
        formData.append(`info`, JSON.stringify({
            ...data,
            category_id: category.id,
            month,
            day,
            capital_id: isChangedCapital.id
        }));
        setLoading(true)

        request(`${BackUrl}account/add_capital/${locationId}`, isChangedCapital.id ? "PUT" : "POST", formData, headersImg())
            .then(res => {
                if (isChangedCapital.id) {
                    setIsChangedCapital({})
                    dispatch(onChangeCapitalReducer({capital: res.capital}))
                } else {
                    dispatch(onAddCapitalReducer({capital: res.capital}))
                }
                dispatch(setMessage({
                    msg: res.msg,
                    type: "success",
                    active: true
                }))
                setActiveAddCapital(false)
                setLoading(false)
                reset2()
                setDay(null)
            })
    }

    const renderPaymentType = useCallback(() => {
        return dataToChange?.payment_types?.map((item, index) => {
            return (
                <label key={index} className="radioLabel" htmlFor="">
                    <input
                        className="radio"
                        {...register2("payment_type_id", {required: true,})}
                        type="radio"
                        value={item.id}
                    />
                    <span>{item.name}</span>
                </label>
            )
        })
    }, [dataToChange?.payment_types])


    const renderDate = useCallback(() => {
        return tools?.map((item, index) => {
            if (item.value === month) {
                return (
                    <div className="date__item" key={index}>
                        <Select
                            number={true}
                            name={"day"}
                            title={"Kun"}
                            defaultValue={day}
                            onChangeOption={setDay}
                            options={item?.days}
                        />
                    </div>
                )
            }
        })
    }, [tools, month, day])

    const renderedDays = renderDate()
    const toggleChangeAddModal = (type) => {
        reset()
        setTypeModal(type)
        setActiveModal(true)
        setImg(null)

        if (Object.keys(category).length && type === "change") {
            setValue("name", category.name)
            setValue("number_category", category.number_category)
        }

    }


    const onChangeCapital = (id) => {
        const changedItem = capitals.filter(item => item.id === id)[0]
        setIsChangedCapital(changedItem)
        setMonth(changedItem.month)
        setDay(changedItem.day)
        setValue2("capital_name", changedItem.name)
        setValue2("number", changedItem.number)
        setValue2("term", changedItem.term)
        setValue2("price", changedItem.price)
        setValue2("payment_type_id", changedItem.payment_type.id.toString())
        setActiveAddCapital(true)
    }


    const toggleAddCapital = () => {
        setActiveAddCapital(!activeAddCapital)
        reset2()
        setDay(null)

    }

    const changePage = (type) => {
        setActivePage(type)
    }


    if (fetchCategoryStatus === "loading") {
        return <DefaultLoader/>
    }


    return (
        <div className={cls.capitalCategory}>
            <BackButton/>
            <div className={cls.header}>
                <Button onClickBtn={() => changePage("category")} active={activePage === "category"}> Category </Button>
                <Button onClickBtn={() => changePage("subcategory")} active={activePage === "subcategory"}> Sub
                    category </Button>
            </div>


            {
                activePage === "category" ?
                    <CapitalCategoryIndex
                        deletedCapitals={deletedCapitals}
                        category={category}
                        toggleChangeAddModal={toggleChangeAddModal}
                        onChangeCapital={onChangeCapital}
                        setActiveAddCapital={setActiveAddCapital}
                        capitals={capitals}
                        setCanDelete={setCanDelete}
                    />
                    :
                    <CapitalSubCategoryIndex
                        toggleChangeAddModal={toggleChangeAddModal}
                        subcategories={subCategories}
                    />

            }


            <Modal activeModal={activeModal} setActiveModal={setActiveModal}>
                <form className={cls.addModal} onSubmit={handleSubmit(onChange)}>
                    <h1>Kategoriya {typeModal === "add" ? "qo'shmoq" : "o'zgartirmoq"} </h1>
                    <ImgInput databaseImg={typeModal === "change" ? category?.img : null} img={img} setImg={setImg}/>
                    <InputForm title={"Nomi"} register={register} name={"name"} type={"text"} required/>
                    <InputForm title={"Raqami"} register={register} name={"number_category"} type={"text"} required/>
                    {loading ? <DefaultLoaderSmall/> : <Button type={"submit"}>Tasdiqlash</Button>}
                </form>
            </Modal>


            <Modal activeModal={activeAddCapital} setActiveModal={toggleAddCapital}>
                <form className={cls.addModal} id="addCapital" onSubmit={handleSubmit2(onSubmitCapital)}>
                    <h1>Mahsulot {isChangedCapital.id ? "o'zgartirish" : "qo'shmoq"} </h1>
                    <ImgInput databaseImg={isChangedCapital.img} img={imgCapital} setImg={setImgCapital}/>
                    <InputForm title={"Nomi"} register={register2}
                               name={"capital_name"} type={"text"} required/>
                    <InputForm title={"Raqami"} register={register2}
                               name={"number"} type={"text"} required/>
                    <InputForm title={"Narxi"} register={register2} name={"price"}
                               type={"number"} required/>
                    <InputForm title={"Muddat (yil)"} register={register2}
                               name={"term"} type={"number"} required/>
                    {
                        tools?.length >= 2 ?
                            <Select
                                name={"month"}
                                title={"Oy"}
                                defaultValue={month}
                                onChangeOption={setMonth}
                                options={tools}
                            /> :
                            null
                    }

                    {renderedDays}
                    {renderPaymentType()}

                    <div className={cls.btns}>
                        {
                            loading ? <DefaultLoaderSmall/> :
                                <>
                                    <Button
                                        name={"submit1"}
                                        formId={"addCapital"}
                                        type={"submit"}
                                    >
                                        Tasdiqlash
                                    </Button>
                                    {
                                        isChangedCapital.id ?
                                            <Button
                                                formId={""}
                                                name={"submit2"}
                                                onClickBtn={() => setCanDeleteCapital(true)}
                                                type={"danger"}
                                            >
                                                O'chirish
                                            </Button>
                                            : null
                                    }
                                </>
                        }

                    </div>
                    {/*<Button type={"submit"}>Tasdiqlash</Button>*/}
                </form>
            </Modal>


            <Modal activeModal={canDelete} setActiveModal={setCanDelete}>
                <Confirm text={'Katgoriyani uchirishni hohlaysizmi'} setActive={setCanDelete} getConfirm={onDelete}/>
            </Modal>


            <Modal activeModal={canDeleteCapital} setActiveModal={setCanDeleteCapital}>
                <Confirm text={'Capital uchirishni hohlaysizmi'} setActive={setCanDelete} getConfirm={onDeleteCapital}/>
            </Modal>
        </div>
    );
};

const CapitalCategoryIndex = (props) => {

    const [isDeletedCapital, setIsDeletedCapital] = useState(false)
    const [isTerm, setIsTerm] = useState(false)
    const [termId, setTermId] = useState(null)
    const {locationId} = useParams()


    const {
        toggleChangeAddModal,
        setCanDelete,
        capitals,
        category,
        setActiveAddCapital,
        deletedCapitals
    } = props
    const {request} = useHttp()
    const dispatch = useDispatch()

    useEffect(() => {
        if (isDeletedCapital) {
            dispatch(fetchCategoryDeletedCapitals({id: category.id, locationId}))
        }
    }, [isDeletedCapital])

    const handleDownload = () => {
        fetch(`${BackUrl}account/get_capital_numbers`, {
            headers: headers(),
            body: JSON.stringify({category_id: category.id}),
            method: "POST"
        })
            .then((response) => {
                return response.blob()
            })
            .then((blob) => {
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement("a");
                link.href = url;
                link.download = "downloaded-file";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            })
            .catch((error) => {
                console.error("Error fetching the file:", error);
            });
    };
    console.log(capitals , "capital")
    console.log(category , "img")
    return (
        <>
            <div className={cls.infoCategory}>
                <img src={`${BackUrlForDoc}${category.img}`} alt=""/>
                <div>
                    <h1>{category.name}</h1>
                    <h2>Kategoriya raqami: {category.number_category}</h2>

                    <div className={cls.btns}>
                        <RequireAuthChildren allowedRules={[ROLES.Accountant]}>
                            <Button onClickBtn={() => toggleChangeAddModal("change")} type={"submit"}>O'zgartirish</Button>
                            {category.is_delete && <Button onClickBtn={() => setCanDelete(true)} type={"danger"}>O'chirish</Button>}
                        </RequireAuthChildren>


                        <Button onClickBtn={handleDownload}>Kapitallar ro'yhati</Button>


                    </div>
                </div>
            </div>
            <div className={cls.subHeader}>
                <h1>Kategoriya mahsulotlari: </h1>


                <div>
                    {!isDeletedCapital && <h1>Jami (Down Cost): <span>{category.total_down_cost}</span></h1>}

                    <div
                        className={cls.plus}
                        onClick={() => setActiveAddCapital(true)}
                    >
                        <i className="fas fa-plus"></i>
                    </div>
                    <Button
                        type={"danger"}
                        active={isDeletedCapital}
                        onClickBtn={() => setIsDeletedCapital(!isDeletedCapital)}
                    >
                        O'chirilganlar
                    </Button>
                </div>
            </div>

            <div className={cls.wrapper}>
                {
                    isDeletedCapital ?
                        deletedCapitals.map(item => {
                            return (
                                    <div className={cls.capital}>
                                        <img src={`${BackUrlForDoc}${item.img}`} alt=""/>
                                        <div className={cls.info}>
                                            <h1>Nomi: <span>{item.name}</span></h1>
                                            <h1>Raqami: <span>{item.number}</span></h1>
                                            <h1>Narxi: <span>{item.price}</span></h1>
                                            <h1>Muddat (yil): <span>{item.term}</span></h1>
                                            <h1>Sana: <span>{item.month}-{item.day}</span></h1>
                                            <h1>To'lov turi: <span>{item.payment_type.name}</span></h1>
                                        </div>
                                    </div>
                            )
                        })
                        :
                        capitals?.map(item => {
                            if (item)
                            return (
                                <Link to={`../capital/${item.id}`}>
                                    <div className={cls?.capital}>
                                        <img src={`${BackUrlForDoc}${item?.img}`} alt=""/>
                                        <div className={cls.info}>
                                            <h1>Nomi: <span>{item.name}</span></h1>
                                            <h1>Raqami: <span>{item.number}</span></h1>
                                            <h1>Narxi: <span>{item.price}</span></h1>
                                            <h1>Muddat (yil): <span>{item.term}</span></h1>
                                            <h1>Sana: <span>{item.month}-{item.day}</span></h1>
                                            <h1>To'lov turi: <span>{item.payment_type.name}</span></h1>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })
                }
            </div>

            <Modal activeModal={isTerm} setActiveModal={setIsTerm}>
                <CapitalTerm id={termId}/>
            </Modal>

        </>
    )
}


const CapitalTerm = ({id}) => {

    const [capitalTerm, setCapitalTerm] = useState([])

    const {request} = useHttp()

    useEffect(() => {
        if (id)
            request(`${BackUrl}account/capital_info/${id}`, "GET", null, headers())
                .then(res => {
                    setCapitalTerm(res.terms)
                })
    }, [id])


    return (
        <div className={cls.capitalTerm}>
            <Table className={cls.tableTerm}>
                <thead>
                <tr>
                    <th>№</th>
                    <th>Capital</th>
                    <th>Date</th>
                    <th>Down cost</th>
                </tr>
                </thead>
                <tbody>

                {
                    capitalTerm.map((item,index) => {
                        return (
                            <tr>
                                <td>{index+1}</td>
                                <td>{item.capital.name}</td>
                                <td>{item.date}</td>
                                <td>{item.down_cost}</td>
                            </tr>
                        )
                    })
                }


                </tbody>
            </Table>
        </div>
    )
}


const CapitalSubCategoryIndex = ({subcategories, toggleChangeAddModal}) => {


    return (
        <>
            <div className={cls.subHeader}>
                <h1>Qo'shimcha kategoriyalar</h1>


                <RequireAuthChildren allowedRules={[ROLES.Accountant]}>
                    <div className={cls.plus} onClick={() => toggleChangeAddModal("add")}>
                        <i className="fas fa-plus"></i>
                    </div>
                </RequireAuthChildren>


            </div>

            <div className={cls.wrapper}>
                {
                    subcategories.map(item => {
                        return (
                            <NavLink to={`../${item.id}`}>
                                <div className={cls.category}>
                                    <img src={`${BackUrlForDoc}${item.img}`} alt=""/>
                                    <div className={cls.info}>
                                        <h1>{item.name}</h1>
                                    </div>
                                    <h2 className={cls.numberCategory}>{item.number_category}</h2>
                                </div>
                            </NavLink>
                        )
                    })
                }
            </div>
        </>
    )
}


export default CapitalCategory;


