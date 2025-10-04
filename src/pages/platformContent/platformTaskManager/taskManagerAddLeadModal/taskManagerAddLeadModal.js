import React from 'react';
import cls from '../platformTaskManager.module.sass'
import Modal from "../../../../components/platform/platformUI/modal";
import Form from "../../../../components/platform/platformUI/form/Form";
import InputForm from "../../../../components/platform/platformUI/inputForm";
import {useForm} from "react-hook-form";
import {useHttp} from "../../../../hooks/http.hook";
import {useDispatch} from "react-redux";
import {BackUrl, formatDate, headers} from "../../../../constants/global";
import {setMessage} from "../../../../slices/messageSlice";
import {fetchLeadsData} from "../../../../slices/taskManagerSlice";

export const TaskManagerAddLeadModal = ({leadActive, setLeadActive, leadId, date, locationId, setActiveModal}) => {

    const {handleSubmit, register} = useForm()
    const dispatch = useDispatch()
    const {request} = useHttp()

    const onLeadAdd = (source) => {
        const data = {
            ...source,
            recommended_by_id: leadId
        }
        const formatted = formatDate(date)
        request(`${BackUrl}register_lead/recommend`, "POST", JSON.stringify(data), headers())
            .then((res) => {
                dispatch(setMessage({
                    msg: res.msg,
                    type: "success",
                    active: true
                }))
                dispatch(fetchLeadsData({locationId, date: formatted}))
                setLeadActive(false)
                setActiveModal(false)

            })


    }

    return (
        <Modal activeModal={leadActive} setActiveModal={() => setLeadActive(!leadActive)}>
            <Form extraClassname={cls.leadModal} onSubmit={handleSubmit(onLeadAdd)}>
                <InputForm
                    register={register}
                    name={"name"}
                    type={"text"}
                    required
                    placeholder={"Ism-Familiya"}
                />
                <InputForm
                    register={register}
                    name={"phone"}
                    type={"number"}
                    required
                    placeholder={"Telefon raqami"}
                />

            </Form>
        </Modal>
    );
};

