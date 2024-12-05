import cls from "./platformBill.module.sass"
import React, {useEffect} from "react";
import Modal from "../../../components/platform/platformUI/modal";
import Form from "../../../components/platform/platformUI/form/Form";

import {useForm} from "react-hook-form";
import InputForm from "../../../components/platform/platformUI/inputForm";
import {useDispatch, useSelector} from "react-redux";
import {useHttp} from "../../../hooks/http.hook";
import {onAddBill} from "../../../slices/billSlice";
import Button from "../../../components/platform/platformUI/button";
import {useNavigate} from "react-router-dom";


const PlatformBill = () => {

    const [activeModal, setActiveModal] = React.useState(false)


    const {data} = useSelector(state => state.billSlice)


    const dispatch = useDispatch()


    const {request} = useHttp()
    const navigate = useNavigate()



    // useEffect(() => {
    // dispatch()
    // } , [])


    const renderData = () => {
        return data.map((item, index) => {
            return (
                <div className={cls.box} onClick={() => navigate(`./${item.id}`)}>
                    <h2>{item.name}</h2>

                    <h3 className={cls.popup}>
                        {item.name}
                    </h3>

                </div>
            )
        })
    }


    const render = renderData()

    return (
        <div className={cls.bill}>

            <div className={cls.plus_main}>

                <div>

                    <h1>Account</h1>

                    <span>{data.length}</span>
                </div>


                <div className={cls.plus} onClick={() => setActiveModal(true)}>
                    <i className="fas fa-plus"></i>
                </div>


            </div>


            <div className={cls.bill__wrapper}>
                {render}
            </div>

            <ModalBill setActiveModal={setActiveModal} activeModal={activeModal}/>
        </div>
    );
};


const ModalBill = ({activeModal, setActiveModal}) => {
    const {register, handleSubmit, setValue} = useForm()

    const dispatch = useDispatch()

    const onClick = (data) => {
        console.log(data)

        const res = {
            name: data.name,
            id: new Date().getTime()
        }
        dispatch(onAddBill(res))

        setValue("name", "")

        setActiveModal(false)

    }

    return (
        <Modal setActiveModal={setActiveModal} activeModal={activeModal}>


            <Form onSubmit={handleSubmit(onClick)} extraClassname={cls.modal}>
                <InputForm placeholder={"Nomi"} name={"name"} register={register}/>


            </Form>

        </Modal>
    )
}

export default PlatformBill;