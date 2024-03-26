"use client";
import classes from "@/UI/Input/Input.module.scss";
import { ReactNode } from "react";
import {
  Controller,
} from "react-hook-form";
import { InputType } from "@/UI/Input";


export const DatePicker: React.FC<InputType> = ({
  className,
  label,
  type,
  name,
  placeholder,
  control,
  defaultValue,
  errors,
  isRequired,
}) => {
  const cssClasses = `${classes.inputField} ${classes.date} ${
    className ? classes[className] : ""
  }`;


  if (!label && placeholder)
    return (
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue ?? ''}
        render={({ field }) => (
          <div className={classes.field}>
            <div className={cssClasses}>
              <label className={`${isRequired}`}>{placeholder}:</label>
              <input
                type='date'
                {...field}
                className={field.value ? classes.notEmpty : classes.empty}
              />
            </div>
            {errors && errors[name]?.message && <p className={classes.error}>{errors[name]?.message as ReactNode}</p>}
          </div>
        )}
      />
    );

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className={cssClasses}>
          <label>
            <span>{label}:</span>
            <input
              type={type ?? "text"}
              {...field}
              className={field.value ? classes.notEmpty : classes.empty}
            />
          </label>
        </div>
      )}
    />
  );
};
