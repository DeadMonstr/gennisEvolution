import React from 'react';


import "./input.sass"


<<<<<<< HEAD
const InputForm = ({title, name, type, required, register, defaultValue, placeholder, value, error, onChange, onBlur}) => {
=======
const InputForm = ({title, name, type, required, register, defaultValue, placeholder, value, error, onChange}) => {
>>>>>>> origin/sardor


    return (
        <label className="input-label" htmlFor={name}>
            <span className="name-field">{title}</span>
            <input
                {...register(`${name}`, {
<<<<<<< HEAD
                    onChange: onChange ? (e) => onChange(e.target.value) : null,
                    onBlur: onBlur ? (e) => onBlur(e.target.value) : null
=======
                    onChange: onChange ? (e) => onChange(e.target.value) : null
>>>>>>> origin/sardor
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

export default InputForm;