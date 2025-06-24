import React, {useEffect, useMemo, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {fetchParentsData, onDeleteParent} from '../../../slices/parentSectionSlice';
import { useParams } from 'react-router-dom';
import { fetchFilters } from '../../../slices/filtersSlice';
import SampleUsers from 'components/platform/platformSamples/sampleUsers/SampleUsers';
import Modal from "../../../components/platform/platformUI/modal";
import Confirm from "../../../components/platform/platformModals/confirm/confirm";
import ConfimReason from "../../../components/platform/platformModals/confirmReason/confimReason";
import {useHttp} from "../../../hooks/http.hook";
import {BackUrl, headers} from "../../../constants/global";

const PlatformParentsList = () => {
    const { locationId } = useParams();
    const dispatch = useDispatch();
    const { parents, loading, error } = useSelector(state => state.parentSlice);
    const { filters } = useSelector(state => state.filters);
    const [activeModal, setActiveModal] = useState(false)
    const [deleteStId, setDeleteStId] = useState()
    const [isConfirm, setIsConfirm] = useState(false)
    const {request} = useHttp()
    useEffect(() => {
        if (locationId) {
            dispatch(fetchParentsData(locationId));
            dispatch(fetchFilters());
        }
    }, [dispatch, locationId]);


    const activeRowsInTable = useMemo(() => ({
        name: true,
        surname: true,
        username: true,
        phone: true,
        address: true,
        birth_day: true,
        sex: true,
        location: true,
        children: false,
        delete: true,
    }), []);

    const onDelete = (id, type) => {
        setDeleteStId(id)
        setActiveModal(true)

    }

    const funcsSlice = useMemo(() => ({
        onDelete
    }), []);



    const getConfirm = (data) => {
        return request(`${BackUrl}parent/crud/${deleteStId}`, "DELETE", JSON.stringify(data), headers())
            .then(res => {
                if (res && res.success !== false) {
                    dispatch(onDeleteParent(deleteStId))
                    setActiveModal(false)
                    setIsConfirm(false)
                } else {
                    console.error("Serverdan noto'g'ri javob:", res)
                }
            })
            .catch(err => {
                console.error("So'rov xatoligi:", err)
            })
    }


    const btns = useMemo(() => [
        { name: 'delete', icon: 'fa-trash', type: 'delete' },
    ], []);

    console.log('parents:', parents);

    return (
        <>
            <SampleUsers
                locationId={locationId}
                isDeletedData={true}
                isFiltered={true}
                funcsSlice={funcsSlice}
                fetchUsersStatus={loading ? 'loading' : 'idle'}
                activeRowsInTable={activeRowsInTable}
                users={parents}
                filters={filters}
                btns={btns}
                pageName="parents"
            />

            <div>
                <Modal activeModal={activeModal} setActiveModal={() => setActiveModal(false)}>

                <Confirm setActive={setActiveModal} text={"O'qituvchini o'chirishni xohlaysizmi ?"}
                             getConfirm={setIsConfirm}/>
                </Modal>
                {
                    isConfirm === "yes" ?
                        <Modal
                            activeModal={activeModal}
                            setActiveModal={() => {
                                setActiveModal(false)
                                setIsConfirm(false)
                            }}
                        >
                            <ConfimReason getConfirm={getConfirm} reason={true}/>
                        </Modal> : null
                }

            </div>
        </>

    );
};

export default PlatformParentsList;