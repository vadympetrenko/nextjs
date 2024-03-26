"use client";
import classes from "@/UI/Input/Input.module.scss";
import { ReactNode } from "react";
import {
  Controller,
} from "react-hook-form";
import { InputType } from "@/UI/Input";

export type SelectType = InputType & { 
  data?:any[]
}

export const Select: React.FC<SelectType> = ({
  className,
  name,
  placeholder,
  control,
  defaultValue,
  errors,
  data,
  isRequired
}) => {
  const cssClasses = `${classes.inputField} ${
    className ? classes[className] : ""
  }`;

  const defaultVal = defaultValue || 'Default option';

    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className={classes.field}>
            <div className={cssClasses}>
            <p className={`${isRequired} ${classes.title}`}>{placeholder}:</p>
              <select
                {...field}
                className={field.value ? classes.notEmpty : classes.empty}
              >
              <option value=''>{defaultVal}</option>
                {data && data.map((item, index) => {
                    return <option key={index} value={item._id} >{item.name}</option>
                })}
                </select>
            </div>
            {errors && errors[name]?.message && <p className={classes.error}>{errors[name]?.message as ReactNode}</p>}
          </div>
        )}
      />
    );
};
