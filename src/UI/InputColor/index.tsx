"use client";
import classes from "@/UI/Input/Input.module.scss";
import { ReactNode } from "react";
import {
  Controller,
  FieldErrors,
} from "react-hook-form";
import InputMask from 'react-input-mask';

type InputType = {
  className?: string;
  type?: string;
  name: string;
  control: any;
  placeholder: string;
  errors?: FieldErrors<any>;
  defaultValue?: string | number;
  isRequired? : string | boolean
};
export const InputColor: React.FC<InputType> = ({
  className,
  name,
  placeholder,
  control,
  defaultValue,
  errors,
  isRequired,
}) => {
  const cssClasses = `${classes.inputField} ${classes.text} ${
    className ? classes[className] : ""
  }`;

    return (
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue ?? ''}
        render={({ field }) => (
          <div className={classes.field}>
            <div className={cssClasses}>
                <label htmlFor="">
                    <span className={`${isRequired}`}>{placeholder}</span>
                    <input type="color" {...field}/>
                </label>
            </div>
            {errors && errors[name]?.message && <p className={classes.error}>{errors[name]?.message as ReactNode}</p>}
          </div>
        )}
      />
    );
};
