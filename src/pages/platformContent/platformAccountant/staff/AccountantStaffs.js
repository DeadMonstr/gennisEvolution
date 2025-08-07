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
import accountantSlice, {
    fetchAccountantRegisteredStaffs,
    fetchAccountantRegisterRoles,
    onAddStaff
} from "slices/accountantSlice";
import Button from "components/platform/platformUI/button";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";
import {useNavigate} from "react-router-dom";
import DefaultLoaderSmall from "components/loader/defaultLoader/defaultLoaderSmall";


const AccountantStaffs = () => {


    const [add, setAdd] = useState(false)
    const [job, setJob] = useState(null)
    const [loading, setLoading] = useState(false)
    const [activeError, setActiveError] = useState(false)


    const {register, handleSubmit, setError, formState: {errors}} = useForm()

    const {register: registerData} = useSelector(state => state.accountantSlice)


    const dispatch = useDispatch()
    const {request} = useHttp()

    useEffect(() => {
        dispatch(fetchAccountantRegisterRoles())
    }, [])


    useEffect(() => {
        dispatch(fetchAccountantRegisteredStaffs())
    }, [])


    const onSubmit = (data) => {

        const newData = {
            ...data,
            password: "12345678",
            role_id: job
        }


        request(`${BackUrl}account/register_camp_staff`, "POST", JSON.stringify(newData), headers())
            .then(res => {
                console.log(res)
                dispatch(onAddStaff(res.user))
                setAdd(false)
            })

    }


    const navigate = useNavigate()


    const LinkToUser = (e, id) => {
        if (e.target.type !== "checkbox" && !e.target.classList.contains("delete") && !e.target.classList.contains("fa-times")) {
            navigate(`../../profile/${id}`)
        }
    }

    const checkUsername = (username) => {
        setLoading(true)
        request(`${BackUrl}checks/check_username`, "POST", JSON.stringify(username))
            .then(res => {
                setLoading(false)

                if (res.found) {
                    setError('username', {
                        type: "manual",
                        message: "username band"

                    }, {shouldFocus: true})
                    setActiveError(true)
                } else {
                    setActiveError(false)

                }
            })
    }


    console.log(errors)
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
                        registerData?.staffs?.map((item, index) => {
                            return (
                                <tr onClick={(e) => LinkToUser(e, item.user_id)}>
                                    <td>{index + 1}</td>
                                    <td>{item.name}</td>
                                    <td>{item.surname}</td>
                                    <td>{item.username}</td>
                                    <td>{item.phone}</td>
                                    <td>{item.age}</td>
                                    <td>{item.role}</td>
                                </tr>
                            )
                        })
                    }


                    </tbody>

                </Table>
            </div>


            <Modal activeModal={add} setActiveModal={() => setAdd(false)}>
                <div className={cls.add}>
                    <Form typeSubmit={"hand"} onSubmit={handleSubmit(onSubmit)}>

                        <InputForm onBlur={checkUsername} register={register} title={"Username"} name={"username"}/>
                        {
                            (errors?.username && activeError) &&
                            <span className={cls.form__error}>
                                                {errors?.username?.message}
                                            </span>
                        }
                        <InputForm register={register} title={"Name"} name={"name"}/>
                        <InputForm register={register} title={"Surname"} name={"surname"}/>
                        <InputForm register={register} title={"Father name"} name={"father_name"}/>
                        <InputForm register={register} type={"date"} title={"Birth date"} name={"birth_date"}/>
                        <InputForm register={register} type={"number"} title={"Phone number"} name={"phone"}/>
                        <InputForm register={register} type={"number"} title={"Salary"} name={"salary"}/>
                        <Select options={registerData?.roles} onChangeOption={setJob} value={job}/>

                        {loading ? <DefaultLoaderSmall/> : <Button type={"submit"}>Submit</Button>}
                    </Form>
                </div>
            </Modal>
        </div>
    );
};

export default AccountantStaffs;