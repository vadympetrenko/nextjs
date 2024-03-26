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
export const InputPhone: React.FC<InputType> = ({
  className,
  type,
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

  const mask = "+9(999)999-99-99"

    return (
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue ?? ''}
        render={({ field }) => (
          <div className={classes.field}>
            <div className={cssClasses}>
              <InputMask
                type={type ?? "text"}
                {...field}
                mask={mask}
                className={field.value ? classes.notEmpty : classes.empty}
              />
              <span className={`${classes.placeholder} ${isRequired}`}>{placeholder}</span>
            </div>
            {errors && errors[name]?.message && <p className={classes.error}>{errors[name]?.message as ReactNode}</p>}
          </div>
        )}
      />
    );
};
