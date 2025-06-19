import React from 'react';

import cls from "./button.module.sass"
import classNames from "classnames";

const Button = ({children = "",active,onClickBtn,name,extraMsg,extraClass,formId,disabled,type = "simple",reset}) => {


    const onClick = () => {
        if (onClickBtn) {
            if (name) {
                onClickBtn(name)
            }
            else {
                onClickBtn()
            }
        }
    }

    return (
        <button
            disabled={disabled}
            name={name}
            form={formId}
            type={formId ? "submit" : "button"}
            className={classNames(cls.btnPlatform,cls[type],{
                [cls.active]: active,
                [cls.disabled]: disabled,
            })}
            onClick={onClick}
        >
            {extraMsg && <span className={"extraMsg"}>{extraMsg}</span>}


            {children}
        </button>
    );
};

export default Button;