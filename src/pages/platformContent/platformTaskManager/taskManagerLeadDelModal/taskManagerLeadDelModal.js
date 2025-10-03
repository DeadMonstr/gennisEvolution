import React from 'react';
import Modal from "../../../../components/platform/platformUI/modal";
import Confirm from "../../../../components/platform/platformModals/confirm/confirm";
import ConfimReason from "../../../../components/platform/platformModals/confirmReason/confimReason";
import {BackUrl, headers} from "../../../../constants/global";
import {onChangeProgress, onDelLeads} from "../../../../slices/taskManagerSlice";
import {setMessage} from "../../../../slices/messageSlice";
import {useHttp} from "../../../../hooks/http.hook";
import {useDispatch} from "react-redux";

export const TaskManagerLeadDelModal = ({dellLead, setDellLead, setIsConfirm, isConfirm, locationId, studentId}) => {

    const {request} = useHttp()
    const dispatch = useDispatch()

    const onDelete = (data) => {
        const res = {
            location_id: locationId,
            status: studentId?.status,
            ...data
        }
        request(`${BackUrl}task_leads_delete/${studentId?.id}`, "DELETE", JSON.stringify(res), headers())
            .then((res) => {
                setIsConfirm(false)
                setDellLead(false)
                dispatch(onDelLeads({id: studentId?.id}))
                dispatch(onChangeProgress({progress: res.task_statistics, allProgress: res.task_daily_statistics}))
                dispatch(setMessage({
                    msg: res.msg,
                    type: "success",
                    active: true
                }))
            })

        if (data.confirm === "no") {
            setDellLead(false)
        }
    }
    return (
        <>
            <Modal activeModal={dellLead} setActiveModal={() => setDellLead(false)}>
                         <Confirm setActive={setDellLead} getConfirm={setIsConfirm} text={"O'chirishni hohlaysizmi"}/>
                     </Modal>
                 {
                    isConfirm === "yes" ?
                        <Modal
                            activeModal={dellLead}
                            setActiveModal={() => {
                                setDellLead(false)
                                setIsConfirm(false)
                            }}
                        >
                            <ConfimReason getConfirm={onDelete} reason={true}/>
                        </Modal> : null
                }
        </>
    );
};

