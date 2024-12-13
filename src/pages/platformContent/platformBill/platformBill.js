import cls from "./platformBill.module.sass"
import React, {useCallback, useEffect, useState} from "react";
import Modal from "../../../components/platform/platformUI/modal";
import Form from "../../../components/platform/platformUI/form/Form";

import {useForm} from "react-hook-form";
import InputForm from "../../../components/platform/platformUI/inputForm";
import {useDispatch, useSelector} from "react-redux";
import {useHttp} from "hooks/http.hook";
import {fetchBill, onAddBill} from "slices/billSlice";
import {useNavigate} from "react-router-dom";
import {BackUrl, headers} from "constants/global";




const PlatformBill = () => {

    const [activeModal, setActiveModal] = React.useState(false)



    const {data} = useSelector(state => state.billSlice)





    const dispatch = useDispatch()


    const {request} = useHttp()
    const navigate = useNavigate()


    useEffect(() => {
        dispatch(fetchBill())
    }, [])





    return (
        <div className={cls.bill}>

            <div className={cls.plus_main}>

                <div>

                    <h1>Account</h1>


                </div>


                <div>

                    {/*<Select options={pages} value={activePage} onChangeOption={setActivePage} />*/}

                    <div className={cls.plus} onClick={() => setActiveModal(true)}>
                        <i className="fas fa-plus"></i>
                    </div>
                </div>



            </div>


            <div className={cls.bill__wrapper}>

                <div className={cls.bill__wrapper_item}>
                    <h1 style={{width: "100%"}}>Payable</h1>
                    {
                        data.payable?.map((item, index) => {
                            return (
                                <div className={cls.box} onClick={() => navigate(`./${item.id}`)}>
                                    <h2>{item?.name}</h2>

                                    <h3 className={cls.popup}>
                                        {item?.name}
                                    </h3>

                                </div>
                            )
                        })
                    }
                </div>
                <div className={cls.bill__wrapper_item}>
                    <h1 style={{width: "100%"}}>Receivable</h1>
                    {
                        data.receivable?.map((item, index) => {
                            return (
                                <div className={cls.box} onClick={() => navigate(`./${item.id}`)}>
                                    <h2>{item?.name}</h2>

                                    <h3 className={cls.popup}>
                                        {item?.name}
                                    </h3>

                                </div>
                            )
                        })
                    }
                </div>
            </div>

            <ModalBill setActiveModal={setActiveModal} activeModal={activeModal}/>
        </div>
    );
};

const status = [
    {name: "Payable", status: "payable"},
    {name: "Receivable", status: "receivable"}
]

const ModalBill = ({activeModal, setActiveModal}) => {
    const {register, handleSubmit, setValue} = useForm()

    const dispatch = useDispatch()

    const {request} = useHttp()

    const onClick = (data) => {

        request(`${BackUrl}create_account`, "POST" , JSON.stringify(data) , headers())
            .then(res => {
                dispatch(onAddBill({data: res.account, type: data.type_account}))
                setValue("name", "")
                setActiveModal(false)
            })
            .catch(err => {
                console.log(err)
            })
    }


    const renderDebtType = useCallback(() => {
        return status.map((item, i) => {
            return (
                <label key={i} className="radioLabel" htmlFor={`radio-${i}`}>
                    <input
                        id={`radio-${i}`}
                        className="radio"
                        {...register("type_account", {required: true})}
                        type="radio"
                        value={item.status}
                    />
                    <span>{item.name}</span>
                </label>
            )
        })
    }, [status])


    return (
        <Modal setActiveModal={setActiveModal} activeModal={activeModal}>
            <Form onSubmit={handleSubmit(onClick)} extraClassname={cls.modal}>
                <InputForm placeholder={"Nomi"} name={"name"} register={register}/>


                <div className={cls.types}>
                    { renderDebtType() }
                </div>



            </Form>
        </Modal>
    )
}

export default PlatformBill;