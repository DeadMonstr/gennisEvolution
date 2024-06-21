import React from 'react';
import {useNavigate} from "react-router-dom";

const BackButton = ({to}) => {
    const navigate = useNavigate()

    const onClick = () => {
        if (to) {
            navigate(to)
        } else {
            navigate(-1)
        }
    }

    return (
        <div onClick={onClick} className="backBtn">
            <i className="fas fa-arrow-left" />
            Ortga
        </div>
    );
};

export default BackButton;