
import React, {useCallback, useEffect, useState} from 'react';


import "./modal.sass"
import classNames from "classnames";
import {useNavigate} from "react-router-dom";




const Modal = ({activeModal,children,setActiveModal,link,id="",zIndex}) => {

    const navigate = useNavigate()




    const onClickOutside = useCallback((e) => {

        console.log(e.target.classList.contains(`modal-${id}`),id)
        if (e.target.classList.contains(`modal-${id}`)) {
            if (setActiveModal) {

                setActiveModal()
            }
            if (link) {
                navigate(link)
            }
        }
    },[id])

    return (
        <div
            className={classNames(`overlay-platform__modal modal-${id}`, {
                active: activeModal
            })}
            onClick={onClickOutside}
            style={{zIndex}}
        >
            <div className={`modal`}>
                {children}
            </div>
            <div
                onClick={() => {
                    if (setActiveModal) {
                        setActiveModal()
                    }
                    if (link) {
                        navigate(link)
                    }
                }}
                className="close">
                <i className="fas fa-times" />
            </div>
        </div>
    )

}

export default Modal


