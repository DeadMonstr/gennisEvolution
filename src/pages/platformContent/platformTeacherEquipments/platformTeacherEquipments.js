import React, { useEffect, useState } from 'react';

import cls from "./platformTeacherEquipments.module.sass";
import {TeacherEquipment} from "./teacherEquipment/teacherEquipment";
import {useDispatch, useSelector} from "react-redux";
import {fetchQuarterMasterData, updateLoading, updateQuarter} from "slices/teacherEquipmentsSlice";
import { useHttp } from 'hooks/http.hook';
import { BackUrl, headers } from 'constants/global';
import DefaultLoaderSmall from 'components/loader/defaultLoader/defaultLoaderSmall';
import Modal from 'components/platform/platformUI/modal';
import Form from 'components/platform/platformUI/form/Form';
import Select from 'components/platform/platformUI/select';
import { useForm } from 'react-hook-form';
import Textarea from 'components/platform/platformUI/textarea';

const statuses = [
    // {id: "sent", name: "Yuborildi"},
    {id: "review", name: "Ko‘rib chiqilmoqda"},
    {id: "accepted", name: "Qabul qilindi"},
    {id: "canceled", name: "Bekor qilindi"}
]

export const PlatformTeacherEquipments = () => {

    const {request} = useHttp()
    const dispatch = useDispatch()
    const {register, handleSubmit, setValue} = useForm()
    const {location} = useSelector(state => state.me)
    const {quarterMasters, loading} = useSelector(state => state.teacherEquipmentsSlice);

    const [isChange, setIsChange] = useState(false)
    const [changeItem, setChangeItem] = useState(null)
    const [selectedStatus, setSelectedStatus] = useState(null)
    const [selectedFilter, setSelectedFilter] = useState("all")

    useEffect(() => {
        if (location) {
            dispatch(fetchQuarterMasterData({id: location, status:selectedFilter}))
        }
    }, [location, selectedFilter])

    const onUpdate = (data) => {
        const forPatch = {
            ...data,
            status: selectedStatus
        }
        request(`${BackUrl}teacher/teacher-requests/${changeItem?.id}`, "PATCH", JSON.stringify(forPatch), headers())
            .then(res => {
                dispatch(updateQuarter(res))
                setIsChange(false)
                setSelectedStatus(null)
                setChangeItem(null)
            })
    }

    const render = () => {
        return quarterMasters?.map((item, index) => {
            // const sliceIndex = item?.text?.indexOf("ta")
            return <TeacherEquipment 
                order={item}
                statuses={[{id: "sent", name: "Yuborildi"},...statuses]}
                onChange={() => {
                    setChangeItem(item)
                    setIsChange(true)
                    setValue("comment", item?.comment)
                }}
            />
        })
    }

    return (
        <>
            <div className={cls.master}>
                <div className={cls.master__box}>
                    <div className={cls.titles}>
                        <h1 className={cls.master__box__title}>O'quv markazi uchun zarur buyumlar</h1>
                        <h3 className={cls.master__box__subtitle}>O'qituvchilar tomonidan yuborilgan talablar ro'yxati</h3>
                    </div>
                    <Select
                        clazzLabel={cls.select}
                        options={[{id: "all", name: "Hammasi"},{id: "sent", name: "Yuborildi"}, ...statuses]}
                        onChangeOption={setSelectedFilter}
                        defaultValue={selectedFilter}
                    />
                </div>
                <div className={cls.master__list}>
                    {
                        loading
                        ? <DefaultLoaderSmall/>
                        : render()
                    }
                </div>

            </div>
            <Modal 
                activeModal={isChange}
                setActiveModal={setIsChange} 
                extraClass={{background: "white", display: "flex", flexDirection: "column", padding: "2rem 0"}}
             >
                <h1>O'zgartirish</h1>
                <Form extraClassname={cls.change__form} onSubmit={handleSubmit(onUpdate)}>
                    <Select
                        options={statuses}
                        titleOption={"Status"}
                        defaultValue={changeItem?.status && changeItem?.status !== "sent" ? changeItem?.status : "review"}
                        value={selectedStatus}
                        onChangeOption={setSelectedStatus}
                    />
                    <Textarea 
                        extraClassName={cls.input}
                        name={"comment"}
                        register={register}
                        placeholder={"Koment"}
                        defaultValue={changeItem?.comment}
                        required
                    />
                </Form>
            </Modal>
        </>

    );
};

export default PlatformTeacherEquipments;
