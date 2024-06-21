import React, {useEffect, useState} from 'react';

import cls from "./groupTest.module.sass"
import BackButton from "components/platform/platformUI/backButton/backButton";
import Select from "components/platform/platformUI/select";
import Button from "components/platform/platformUI/button";
import Table from "components/platform/platformUI/table";
import Accordion from "components/platform/platformUI/accordion/Accordion";


import img from "assets/user-interface/user_image.png"
import Modal from "components/platform/platformUI/modal";
import InputForm from "components/platform/platformUI/inputForm";
import {useForm} from "react-hook-form";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {setMessage} from "slices/messageSlice";
import Input from "components/platform/platformUI/input";
import {setActive} from "slices/filtersSlice";

const GroupTest = () => {

    const {groupId} = useParams()

    const {data} = useSelector(state => state.group)


    const [tests, setTests] = useState([])

    const [currentMonth, setCurrentMonth] = useState()


    const [active, setActive] = useState(false)
    const [activeTest, setActiveTest] = useState(false)

    const [year, setYear] = useState()
    const [years, setYears] = useState([])

    const [month, setMonth] = useState()
    const [months, setMonths] = useState([])


    const [changedTest, setChangedTest] = useState({})


    const {request} = useHttp()


    useEffect(() => {
        request(`${BackUrl}filter_datas_in_group/${groupId}`, "GET", null, headers())
            .then(res => {
                setMonths(res.month_list)
                setYears(res.years_list)

                setYear(res.current_year)
                setMonth(res.current_month)

                setCurrentMonth(res.current_month)

            })
    }, [])


    useEffect(() => {
        if (year) {
            request(`${BackUrl}filter_datas_in_group/${groupId}`, "POST", JSON.stringify({year}), headers())
                .then(res => {

                    setMonths(res.month_list)
                })
        }

    }, [year])

    useEffect(() => {
        if (year && month) {
            request(`${BackUrl}filter_test_group/${groupId}`, "POST", JSON.stringify({year, month}), headers())
                .then(res => {
                    setTests(res.tests)
                })
        }
    }, [year, month])


    // const onAddResultStudents = (data) => {
    //     request(`${BackUrl}submit_test_group/${groupId}`, "POST",JSON.stringify({students,test_id: selectedTest}),headers())
    //         .then(res => {
    //             setActiveTest(false)
    //             setTests(tests => [...tests,res.test])
    //             dispatch(setMessage({
    //                 msg: res.msg,
    //                 active: true,
    //                 type: "success"
    //             }))
    //         })
    // }

    // const onSetStudentsResult = (id,name,value) => {
    //
    //     setStudents(students => students.map(item => {
    //         if (item.id === id) {
    //             return {...item, [name]: value}
    //         }
    //         return item
    //     }))
    // }


    const onClick = (test, type) => {
        // setStudents(test.students)
        setChangedTest(test)

        if (type === "result") {
            setActive(true)
        } else {
            setActiveTest(true)
        }

    }


    return (
        <div className={cls.groupTest}>

            <BackButton/>

            <div className={cls.header}>
                <h1>Group Test</h1>

                <div>
                    {
                        years.length > 1 ?
                            <Select
                                name={"years"}
                                value={year}
                                title={"Yil"}
                                options={years}
                                onChangeOption={(e) => {
                                    setYear(e)
                                }}
                            /> : null
                    }
                    {
                        months.length > 1 ?
                            <Select
                                name={"month"}
                                value={month}
                                title={"Oy"}
                                options={months}
                                onChangeOption={(e) => {
                                    setMonth(e)
                                }}
                            /> : null
                    }
                </div>
            </div>


            <div className={cls.subheader}>
                {currentMonth === month &&
                    <Button onClickBtn={() => setActive(true)} type={"submit"}>Natija Qo'shish</Button>}

                <Button onClickBtn={() => setActiveTest(true)}>Test Qo'shish</Button>
            </div>

            <div className={cls.wrapper}>

                {
                    tests.map(item => {
                        return (
                            <Accordion
                                clazz={cls.accordion}
                                subtitle={"Jami: " + item.percentage+"%"}
                                btns={[
                                    <h1>Level: {item.level}</h1>,
                                    (item.students.length > 0 &&
                                        <Button type={"submit"} onClickBtn={() => onClick(item, "result")}>Natijani
                                            O'zgartirish</Button>),
                                    (!item.students.length &&
                                        <Button onClickBtn={() => onClick(item, "test")}>Test O'zgartirish</Button>)


                                ]}
                                // img={img}
                                title={item.name}
                                // subtitle={"Fatxullayev"}
                            >
                                <Table>
                                    <thead>
                                    <tr>
                                        <th>№</th>
                                        <th>Ism Familya</th>
                                        <th>Natija</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        item.students.map((item, index) => {
                                            return (
                                                <tr>
                                                    <td>{index + 1}</td>
                                                    <td>{item.student_name} {item.student_surname}</td>
                                                    <td>{item.percentage}</td>
                                                </tr>
                                            )
                                        })
                                    }
                                    </tbody>
                                </Table>

                            </Accordion>
                        )
                    })
                }


                <SetResultModal
                    changedTest={changedTest}
                    active={active}
                    setActive={setActive}
                    data={data}
                    tests={tests}
                    setTests={setTests}
                    setChangedTest={setChangedTest}
                />
                <ChangeCreateTestModal
                    activeTest={activeTest}
                    setActiveTest={setActiveTest}
                    setTests={setTests}
                    changedTest={changedTest}
                    setChangedTest={setChangedTest}
                />

            </div>
        </div>
    );
};

const ChangeCreateTestModal = ({activeTest, setActiveTest, setTests, setChangedTest, changedTest}) => {


    const {register, handleSubmit, setValue, reset} = useForm()
    const [level, setLevel] = useState()
    const {groupId} = useParams()


    const levels = [
        "A1","A2","B1","B2","C1","C2"
    ]

    useEffect(() => {
        if (Object.keys(changedTest).length) {
            setLevel(changedTest.level_id)
            setValue("name", changedTest.name)
            setValue("date", changedTest.date)
            setValue("number", changedTest.number)

        }
    }, [changedTest])


    const dispatch = useDispatch()
    const {request} = useHttp()
    const onCreateTest = (data) => {
        if (changedTest.id) {
            request(`${BackUrl}create_test/${groupId}`, "PUT", JSON.stringify({
                ...data,
                level,
                test_id: changedTest.id
            }), headers())
                .then(res => {
                    setActiveTest(false)
                    setTests(tests => tests.map(item => {
                        if (item.id === res.test.id) {
                            return res.test
                        }
                        return item
                    }))
                    dispatch(setMessage({
                        msg: res.msg,
                        active: true,
                        type: "success"
                    }))
                })
        } else {
            request(`${BackUrl}create_test/${groupId}`, "POST", JSON.stringify({...data, level}), headers())
                .then(res => {
                    setActiveTest(false)
                    setTests(tests => [...tests, res.test])
                    dispatch(setMessage({
                        msg: res.msg,
                        active: true,
                        type: "success"
                    }))
                })
        }


    }


    const onDeleteTest = () => {

        request(`${BackUrl}create_test/${groupId}`, "DELETE", JSON.stringify({test_id: changedTest.id}), headers())
            .then(res => {
                setActiveTest(false)
                setTests(tests => tests.filter(item => item.id !== changedTest.id))
                dispatch(setMessage({
                    msg: res.msg,
                    active: true,
                    type: "success"
                }))
            })
    }

    return (
        <Modal activeModal={activeTest} setActiveModal={() => {
            reset()
            setLevel(null)
            setChangedTest({})
            setActiveTest(false)
        }}>
            <form id={"form"} className={cls.createTest} onSubmit={handleSubmit(onCreateTest)}>
                <h1>Test qo'shmoq</h1>
                <Select
                    value={level}
                    options={levels}
                    onChangeOption={setLevel}
                    title={"Levellar"}
                />
                <InputForm required title={"Nomi"} register={register} name={"name"}/>
                <InputForm required title={"Sana"} type={"date"} register={register} name={"date"}/>
                <InputForm required title={"Savollar soni"} type={"number"} register={register} name={"number"}/>
                <div className={cls.btns}>
                    {Object.keys(changedTest).length > 0 && !changedTest.status &&
                        <Button formId={""} onClickBtn={onDeleteTest} type={"danger"}>O'chirish</Button>}
                    <Button formId={"form"} type={"submit"}>Tasdiqlash</Button>
                </div>

            </form>
        </Modal>
    )
}


const SetResultModal = React.memo(({active, setActive, data, tests, changedTest, setTests, setChangedTest}) => {


    const {groupId} = useParams()

    const [students, setStudents] = useState([])
    const [selectedTest, setSelectedTest] = useState()
    const [isError, setError] = useState(false)
    const [isDisabled, setIsDisabled] = useState(false)



    useEffect(() => {
        if (Object.keys(changedTest).length) {
            setSelectedTest(changedTest.id)
            setStudents(students => students.map(item => {
                const true_answers = changedTest.students.filter(st => st.student_id === item.id)[0]?.true_answers
                return {...item, true_answers}
            }))
        }
    }, [changedTest])


    useEffect(() => {
        if (students.length && selectedTest) {
            const max = tests.filter(item => item.id === +selectedTest)[0].number

            setError(students.some(item => item?.true_answers > max))
            setIsDisabled(students.some(item => item?.true_answers > max || !item.true_answers))

        } else {
            setIsDisabled(true)
        }
    }, [students, selectedTest])


    useEffect(() => {
        if (data?.students?.length) {
            setStudents(data.students)
        }
    }, [data])

    const {request} = useHttp()
    const dispatch = useDispatch()

    const onAddResultStudents = () => {

        request(`${BackUrl}submit_test_group/${groupId}`, "POST", JSON.stringify({
            students,
            test_id: selectedTest
        }), headers())
            .then(res => {
                setActive(false)
                // setActiveTest(false)
                setTests(tests => tests.map(item => {
                    if (item.id === res.test.id) {
                        return res.test
                    }
                    return item
                }))
                dispatch(setMessage({
                    msg: res.msg,
                    active: true,
                    type: "success"
                }))
                resetBalls()
            })
    }

    const onSetStudentsResult = (id, name, value) => {

        setStudents(students => students.map(item => {
            if (item.id === id) {
                return {...item, [name]: +value}
            }
            return item
        }))
    }


    const resetBalls = () => {
        setStudents(students => students.map(item => {

            return {...item, true_answers: null}
        }))
    }


    return (
        <Modal activeModal={active} setActiveModal={() => {
            setActive()
            setChangedTest({})
        }}>
            <div className={cls.createTest}>
                <h1>Student Natijalarini qo'shmoq</h1>
                {!Object.keys(changedTest).length > 0 &&
                    <Select required={true} title={"Testlar"} value={selectedTest} options={tests}
                            onChangeOption={setSelectedTest}/>}
                {isError &&
                    <h1 style={{color: "red", textAlign: "center"}}>O'quvchi tog'ri javoblari test savollar sonidan kop
                        bo'lmasligi kerak</h1>}
                {
                    students.map(item => {
                        return (
                            <div className={cls.student}>
                                <div className={cls.info}>
                                    <h1>{item.name}</h1>
                                    <h1>{item.surname}</h1>
                                </div>
                                <div>
                                    <Input
                                        onChange={(e) => onSetStudentsResult(item.id, "true_answers", e)}
                                        value={item.true_answers}
                                        title={"Tog'ri javoblar"}
                                        type={"number"}
                                        others={{max: tests.filter(test => test.id === +selectedTest)[0]?.number}}
                                    />
                                </div>
                            </div>
                        )
                    })
                }

                <div className={cls.btns}>
                    <Button disabled={isDisabled} onClickBtn={onAddResultStudents} type={"submit"}>Tasdiqlash</Button>

                </div>
            </div>
        </Modal>

    )
})


export default GroupTest;