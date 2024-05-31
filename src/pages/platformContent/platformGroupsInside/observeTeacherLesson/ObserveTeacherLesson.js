import React, {useCallback, useEffect, useState} from 'react';
import cls from "./observeTeacherLesson.module.sass"



import {Navigate, NavLink, Route, Routes, useParams} from "react-router-dom";
import BackButton from "components/platform/platformUI/backButton/backButton";
import Select from "components/platform/platformUI/select";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";
import Button from "components/platform/platformUI/button";
import {setMessage} from "slices/messageSlice";
import {useForm} from "react-hook-form";
import {useDispatch} from "react-redux";
import Textarea from "components/platform/platformUI/textarea";
import LessonPlan from "pages/platformContent/platformGroupsInside/lessonPlan/LessonPlan";
// import Back from "components/ui/back";
// import LessonPlan from "pages/groups/group/lessonPlan/LessonPlan";
// import {setAlertOptions} from "slices/layoutSlice";
// import {useDispatch} from "react-redux";


const ObserveTeacherLesson = () => {






    return (
        <div className={cls.observeTeacherLesson}>
            <BackButton to={".."}/>
            <div className={cls.btns}>
                <NavLink
                    className={({isActive}) =>
                        isActive ? `${cls.item} ${cls.active}` : `${cls.item}`
                    }
                    to={"observe"}
                >
                    <i className="fas fa-user-check"></i>
                    <span>Observe</span>
                </NavLink>
                <NavLink
                    to={"list"}
                    className={({isActive}) =>
                        isActive ? `${cls.item} ${cls.active}` : `${cls.item}`
                    }
                >
                    <i className="fas fa-list"></i>
                    <span>Lesson Plan</span>
                </NavLink>


            </div>




            <div className={cls.wrapper}>
                <Routes>
                    <Route path={"observe"} element={<ObserveTeacherLessonIndex />}/>
                    <Route path={"list"} element={<LessonPlan/>}/>
                    <Route
                        path="*"
                        element={<Navigate to="observe" replace/>}
                    />
                </Routes>
            </div>

        </div>
    );
};

const ObserveTeacherLessonIndex = () => {

    const {groupId} = useParams()

    const [fields,setFields] = useState([])
    const [options,setOptions] = useState([])
    const [months, setMonths] = useState([])
    const [month, setMonth] = useState(null)
    const [day, setDays] = useState(null)
    const [error, setError] = useState(false)

    const {request} = useHttp()


    useEffect(() => {
        request(`${BackUrl}teacher_observe/${groupId}`, "GET", null, headers())
            .then(res => {
                if (res.observation_tools.length < 1) {
                    setMonth(res.observation_tools[0].value)
                    setMonths(res.observation_tools)
                } else {
                    setMonths(res.observation_tools)
                }
            })
    }, [])



    useEffect(() => {
        request(`${BackUrl}observe_info`,"GET",null,headers())
            .then(res => {
                setFields(res.observations.map(item => ({...item,value: "1"})))
                setOptions(res.options)
            })
    },[])

    const onChangeOption = (value,id) => {
        setFields(items => items.map(item => {
            if (item.id === id) {
                return {
                    ...item,
                    value: value
                }
            }
            return item
        }))
    }
    const onChangeText = (value,id) => {
        setFields(items => items.map(item => {
            if (item.id === id) {
                return {
                    ...item,
                    comment: value
                }
            }
            return item
        }))
    }



    const renderField = useCallback(() => {
        if (!fields?.length) return null
        return fields.map((item,key) => {
            return (
                <div className={cls.field} key={key}>
                    <h2>{item.title} </h2>
                    <Select
                        name={`select-${key}`}
                        value={item.value}
                        extraClassName={cls.select}
                        onChangeOption={(e) => onChangeOption(e,item.id)}
                        options={options}
                        defaultValue={1}
                    />
                    <Textarea
                        value={item.comment}
                        onChange={(e) => onChangeText(e,item.id)}
                        required
                        extraClassName={cls.textarea}
                    />
                </div>
            )
        })
    },[fields])


    const dispatch = useDispatch()


    const onSubmit = (e) => {
        if (month && day) {


            request(`${BackUrl}teacher_observe/${groupId}`, "POST", JSON.stringify({list: fields,month,day}),headers())
                .then(res => {
                    dispatch(setMessage({
                        msg: res.msg,
                        type: "success",
                        active: true
                    }))
                })
            setError(false)
        } else {
            setError(true)
        }

    }


    return (
        <div className={cls.observeTeacherLesson}>




            <h1>Observe Teacher</h1>

            <div className={cls.subheader}>
                {months.length > 1 &&  <Select title={"Oy"} name={"month"} options={months} value={month} onChangeOption={setMonth}/> }
                <Select title={"Kun"} name={"day"} options={months.filter(item => item.value === month)[0]?.days} value={day} onChangeOption={setDays}/>
            </div>



            {error && <h1 style={{color: "red",textAlign: "center"}}>Oy yoki kun tanlanmagan</h1>}


            <div className={cls.fields}>
                {renderField()}
            </div>



            <div className={cls.footer}>
                <Button
                    onClickBtn={onSubmit}
                    formId={"fields"}
                    type={"submit"}
                >
                    Tasdiqlash
                </Button>
            </div>
        </div>
    )
}


export default ObserveTeacherLesson;