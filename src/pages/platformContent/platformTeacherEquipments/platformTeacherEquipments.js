import React, { useEffect, useState } from 'react';

import cls from "./platformTeacherEquipments.module.sass";
import {TeacherEquipment} from "./teacherEquipment/teacherEquipment";
import {useDispatch, useSelector} from "react-redux";
import {fetchQuarterMasterData, updateLoading, updateQuarter, deleteQuarter} from "slices/teacherEquipmentsSlice";
import { useHttp } from 'hooks/http.hook';
import { BackUrl, headers } from 'constants/global';
import DefaultLoaderSmall from 'components/loader/defaultLoader/defaultLoaderSmall';
import Modal from 'components/platform/platformUI/modal';
import Form from 'components/platform/platformUI/form/Form';
import Select from 'components/platform/platformUI/select';
import { useForm } from 'react-hook-form';
import Textarea from 'components/platform/platformUI/textarea';
import Confirm from 'components/platform/platformModals/confirm/confirm';
import Button from 'components/platform/platformUI/button';

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
    const [isFilter, setIsFilter] = useState(false)
    const [isDelete, setIsDelete] = useState(false)
    const [changeItem, setChangeItem] = useState(null)
    const [selectedStatus, setSelectedStatus] = useState("review")
    const [selectedFilter, setSelectedFilter] = useState("all")
    const [isDeletedData, setIsDeletedData] = useState(false)

    useEffect(() => {
        if (location) {
            dispatch(fetchQuarterMasterData({id: location, status:selectedFilter, deleted: isDeletedData}))
        }
    }, [location, selectedFilter, isDeletedData])

    const onUpdate = (data) => {
        dispatch(updateLoading())
        const forPatch = {
            ...data,
            status: selectedStatus,
            deleted: true
        }
        request(`${BackUrl}teacher/teacher-requests/${changeItem?.id}`, "PATCH", JSON.stringify(forPatch), headers())
            .then(res => {
                dispatch(updateQuarter(res))
                setIsChange(false)
                setSelectedStatus(null)
                setChangeItem(null)
            })
    }

    const onDelete = (confirm) => {
        dispatch(updateLoading())
        if (confirm === "yes") {
            request(`${BackUrl}teacher/teacher-requests/${changeItem?.id}`, "PATCH", JSON.stringify({deleted: true}), headers())
                .then(res => {
                    dispatch(deleteQuarter(changeItem?.id))
                    setIsDelete(false)
                    setChangeItem(null)
                })
        } else {
            setIsDelete(false)
            setChangeItem(null)
        }
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
                onDelete={() => {
                    setIsDelete(true)
                    setChangeItem(item)
                }}
                isDelete={isDeletedData}
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
                    <Button
                        extraClass={cls.select}
                        onClickBtn={() => setIsFilter(true)}
                    >
                        Filter
                    </Button>
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
                activeModal={isFilter}
                setActiveModal={setIsFilter} 
                extraClass={cls.change}
            >
                <h1>Filter</h1>
                <Select
                    title={"Status"}
                    clazzLabel={cls.select}
                    options={[{id: "all", name: "Hammasi"},{id: "sent", name: "Yuborildi"}, ...statuses]}
                    onChangeOption={setSelectedFilter}
                    defaultValue={selectedFilter}
                />
                <Button onClickBtn={() => setIsDeletedData(!isDeletedData)} active={isDeletedData}>Deleted</Button>
            </Modal>
            <Modal 
                activeModal={isChange}
                setActiveModal={setIsChange} 
                extraClass={cls.change}
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
            <Modal 
                activeModal={isDelete}
                setActiveModal={setIsDelete} 
            >
                <Confirm
                    setActive={setIsDelete}
                    text={"O'chirishni xohlaysizmi ?"}
                    getConfirm={onDelete}
                />
            </Modal>
        </>

    );
};

export default PlatformTeacherEquipments;
