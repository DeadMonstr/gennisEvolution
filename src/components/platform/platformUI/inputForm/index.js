import React from 'react';


import "./input.sass"


const InputForm = ({title, name, type, required, register, defaultValue, placeholder, value, error}) => {


    return (
        <label className="input-label" htmlFor={name}>
            <span className="name-field">{title}</span>
            <input
                {...register(`${name}`)}
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