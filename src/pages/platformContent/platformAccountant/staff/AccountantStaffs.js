import React, {useEffect, useState} from 'react';


import cls from "./AccountantStaffs.module.sass"

import Table from "components/platform/platformUI/table";
import Modal from "components/platform/platformUI/modal";
import Form from "components/platform/platformUI/form/Form";
import InputForm from "components/platform/platformUI/inputForm";
import Select from "components/platform/platformUI/select";


import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import {fetchDataToChange} from "slices/dataToChangeSlice";
import accountantSlice, {fetchAccountantRegisteredStaffs, fetchAccountantRegisterRoles} from "slices/accountantSlice";
import Button from "components/platform/platformUI/button";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";
import {useNavigate} from "react-router-dom";


const AccountantStaffs = () => {


    const [add,setAdd] = useState(false)
    const [job,setJob] = useState(null)


    const {register,handleSubmit} = useForm()

    const {register: registerData} = useSelector(state => state.accountantSlice)


    const dispatch = useDispatch()
    const {request} = useHttp()

    useEffect(() => {
        dispatch(fetchAccountantRegisterRoles())
    },[])


    useEffect(() => {
        dispatch(fetchAccountantRegisteredStaffs())
    },[])
    
    
    
    const onSubmit = (data) => {

        const newData = {
            ...data,
            password: "12345678",
            role_id: job
        }



        request(`${BackUrl}register_camp_staff`, "POST", JSON.stringify(newData), headers())
            .then(res => {
                console.log(res)
            })

    }



    const navigate = useNavigate()


    const LinkToUser = (e,id) => {
        if (e.target.type !== "checkbox" && !e.target.classList.contains("delete") && !e.target.classList.contains("fa-times")) {
            navigate(`../../profile/${id}`)
        }
    }

    console.log(registerData.roles)


    return (
        <div className={cls.staffs}>

            <div className={cls.header}>


                <h1>Staffs</h1>

                <div className={cls.plus} onClick={() => setAdd(true)}>
                    <i className="fas fa-plus"></i>
                </div>

            </div>

            <div className={cls.wrapper}>
                <Table>
                    <thead>
                        <tr>
                            <th>№</th>
                            <th>Ism</th>
                            <th>Familya</th>
                            <th>Username</th>
                            <th>Tel.</th>
                            <th>Yoshi</th>
                            <th>Kasb</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        registerData?.staffs?.map((item,index) => {
                            return (
                                <tr onClick={(e) => LinkToUser(e,item.id)}>
                                    <td>{index+1}</td>
                                    <td>{item.name}</td>
                                    <td>Fatxullayev</td>
                                    <td>Jeki</td>
                                    <td>949200232</td>
                                    <td>21</td>
                                    <td>No'malum</td>
                                </tr>
                            )
                        })
                    }



                    </tbody>

                </Table>
            </div>



            <Modal activeModal={add} setActiveModal={() => setAdd(false)}>
                <div className={cls.add}>
                    <Form typeSubmit={"hand"} onSubmit={handleSubmit(onSubmit)} >
                        <InputForm register={register} title={"Username"} name={"username"} />
                        <InputForm register={register} title={"Name"} name={"name"} />
                        <InputForm register={register} title={"Surname"} name={"surname"} />
                        <InputForm register={register} title={"Father name"} name={"father_name"} />
                        <InputForm register={register} type={"date"} title={"Birth date"} name={"birth_date"} />
                        <InputForm register={register} title={"Phone number"} name={"phone"} />
                        <Select options={registerData?.roles} onChangeOption={setJob} value={job} />


                        <Button type={"submit"}>Submit</Button>
                    </Form>
                </div>
            </Modal>
        </div>
    );
};

export default AccountantStaffs;