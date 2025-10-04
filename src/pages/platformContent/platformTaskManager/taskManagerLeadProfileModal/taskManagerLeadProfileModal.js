import React from 'react';
import cls from "../platformTaskManager.module.sass";
import {Link} from "react-router-dom";
import unknownUser from "../../../../assets/user-interface/user_image.png";
import Button from "../../../../components/platform/platformUI/button";
import Select from "../../../../components/platform/platformUI/select";
import InputForm from "../../../../components/platform/platformUI/inputForm";
import Modal from "../../../../components/platform/platformUI/modal";
import {useForm} from "react-hook-form";
import {onChangeProgress, onDelDebtors, onDelLeads, onDelNewStudents} from "../../../../slices/taskManagerSlice";
import {BackUrl, headers} from "../../../../constants/global";
import {useDispatch} from "react-redux";
import {useHttp} from "../../../../hooks/http.hook";


const options = [
    {
        name: "tel ko'tardi",
        label: "yes"
    },
    {
        name: "tel ko'tarmadi",
        label: "no"
    }
]

export const TaskManagerLeadProfileModal = ({locationId, showMessage,setStudentSelect,studentSelect, activeModal, setActiveModal, studentId, profile, activeMenu, setLeadActive, leadActive, setLeadId,isCompleted}) => {

    const {handleSubmit, register} = useForm();
    const dispatch = useDispatch()
    const {request} = useHttp()

    const onChange = (value) => {
        setStudentSelect(value)
    }

    const onSubmit = (data) => {

        console.log("hello")

        const res = {
            id: studentId,
            ...data
        }


        if (activeMenu === "newStudents") {


            dispatch(onDelNewStudents({id: res.id}))


            request(`${BackUrl}call_to_new_students`, "POST", JSON.stringify(res), headers())
                .then(res => {


                    console.log(res)

                    if (res?.student.student_id) {
                        dispatch(onChangeProgress({
                            progress: res.student.task_statistics,
                            allProgress: res.student.task_daily_statistics
                        }))

                        showMessage(res.student.msg)
                    } else {
                        showMessage(res.msg)
                    }
                })
                .catch(err => console.log(err))

        } else if (activeMenu === "debtors") {

            const result = {
                select: studentSelect,
                ...res
            }

            request(`${BackUrl}call_to_debts`, "POST", JSON.stringify(result), headers())
                .then(res => {

                    dispatch(onDelDebtors({id: result.id}))
                    dispatch(onChangeProgress({progress: res.task_statistics, allProgress: res.task_daily_statistics}))

                    showMessage(res.message)
                })
                .catch(err => console.log(err))


        } else if (activeMenu === "leads") {

            request(`${BackUrl}task_leads_update/${studentId}`, "POST", JSON.stringify({
                ...res,
                location_id: locationId
            }), headers())
                .then(res => {
                    if (res.lead_id) {
                        dispatch(onDelLeads({id: res?.lead_id}))
                        dispatch(onChangeProgress({
                            progress: res.task_statistics,
                            allProgress: res.task_daily_statistics
                        }))
                    }
                    showMessage(res.msg)
                })
                .catch(err => console.log(err))


        }
    }

    return (
        <Modal activeModal={activeModal} setActiveModal={setActiveModal}>
            <div className={cls.userbox}>
                <div className={cls.userbox__img}>
                    <Link to={`../profile/${studentId}`}>
                        <img src={profile.img ? profile.img : unknownUser} alt=""/>
                    </Link>
                    {
                        activeMenu === "leads" ?
                            <Button extraClass={cls.userbox__btn} children={"+"} onClickBtn={() => {
                                setLeadActive(!leadActive)
                                setLeadId(studentId)
                            }}/> : null
                    }


                </div>
                <h2 className={cls.userbox__name}>
                    <span>{profile.name} {profile.surname}</span> <br/>
                </h2>
                <div className={cls.userbox__info}>
                    <div className={cls.userbox__infos}>
                        <p className={cls.userbox__subjects}>
                            Balance :
                            <span>{profile.balance ? profile.balance : <>No balance</>} </span>
                        </p>
                        <p className={cls.userbox__number}>
                            Number :
                            <span>{profile.phone} </span>
                        </p>
                    </div>
                </div>
                {
                    isCompleted ? null : <form onSubmit={handleSubmit(onSubmit)}>
                        <div className={cls.userbox__inputs}>
                            {
                                activeMenu === "debtors" ? <Select
                                    options={options}
                                    // defaultValue={options[0].name}
                                    onChangeOption={onChange}
                                /> : null
                            }
                            {
                                studentSelect === "tel ko'tarmadi" ? null : <>
                                    <InputForm placeholder="koment" type="text" register={register} name={"comment"}
                                               required/>
                                    <InputForm placeholder="keyingiga qoldirish" type="date" register={register}
                                               name={"date"}
                                               required/>
                                </>
                            }
                        </div>
                        <div className={cls.userbox__footer_btn}>
                            <Button type={"submit"} formId>
                                Button
                            </Button>
                        </div>
                    </form>
                }
            </div>
            {profile.comments?.length >= 1 ? <div className={cls.wrapperList}>
                {
                    profile.comments && profile.comments?.map((item) => {
                        return (
                            <div className={cls.wrapperList__box}>
                                <div className={cls.wrapperList__items}>
                                    <div className={cls.wrapperList__number}>
                                        Telefon qilingan :
                                        <span>
                                            {activeMenu === "newStudents" ? item.day : item.added_date}
                                        </span>
                                    </div>
                                    <div className={cls.wrapperList__comment}>
                                        Comment : <span>{item.comment}</span>
                                    </div>
                                    <div className={cls.wrapperList__smen}>
                                        {item.shift}
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div> : null}
            {profile.invitations?.length >= 1 ? <div className={cls.wrapperList}>
                {
                    profile.invitations && profile.invitations?.map((item) => {
                        return (
                            <div className={cls.wrapperList__box}>
                                <div className={cls.wrapperList__items}>
                                    <div className={cls.wrapperList__comment}>
                                        Ism-familiya : <span>{item.name}</span>
                                    </div>
                                    <div className={cls.wrapperList__smen}>
                                        Telefon raqami: <span>{item.phone}</span>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div> : null}
        </Modal>
    );
};

