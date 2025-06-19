import React from 'react';
import classNames from "classnames";

import cls from "./form.module.sass"
import {useForm} from "react-hook-form";

const Form =
	({
		id,
	    onSubmit,
	    children,
	    extraClassname,
		typeSubmit = "inside"
	}) => {



	return (
		<form
			id={id}
			className={classNames(cls.form,extraClassname)}
			onSubmit={onSubmit}
			action=""
		>

			{children}

			{
				typeSubmit === "inside" ? <input value={"Tasdiqlash"} className={cls.submit} type="submit"/> : null
			}

		</form>
	);
};

export default Form;