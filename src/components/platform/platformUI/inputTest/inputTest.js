// import React from 'react';


import "./inputTest.module.sass"


export const InputTest = ({title, name, type, required, register, defaultValue, placeholder, value, error, onChange, onBlur}) => {


    return (
        <label className="input-label" htmlFor={name}>
            <span className="name-field">{title}</span>
            <input
                {...register(`${name}`, {
                    onChange: onChange ? (e) => onChange(e.target.value) : null,
                    onBlur: onBlur ? (e) => onBlur(e.target.value) : null
                })}
                value={value}
                placeholder={placeholder}
                required={required}
                type={type}
                defaultValue={defaultValue}
                id={name}
                className="input-fields"
            />
            {
                error &&
                <span className="error-field">{error?.message}</span>
            }
        </label>
    );
};

