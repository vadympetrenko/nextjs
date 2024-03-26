"use client";
import classes from "@/UI/Input/Input.module.scss";
import { ReactNode } from "react";
import { Controller, FieldErrors } from "react-hook-form";

export type InputType = {
  className?: string;
  label?: string;
  type?: string;
  name: string;
  control: any;
  placeholder?: string;
  errors?: FieldErrors<any>;
  defaultValue?: string | number;
  isRequired?: string | boolean;
  autocomplete?:string
};

export const Input: React.FC<InputType> = ({
  className,
  type,
  name,
  placeholder,
  control,
  defaultValue,
  errors,
  isRequired,
  autocomplete
}) => {
  const cssClasses = `${classes.inputField} ${classes.text} ${
    className ? className : ""
  }`;

  if (type === "hidden") {
    return <Controller
      name={name}
      control={control}
      defaultValue={defaultValue ?? ""}
      render={({ field }) => (
        <div className={classes.field}>
          <div className={cssClasses}>
            <input
              type={type}
              {...field}
              className={
                field.value || (field.value >= 0 && field.value !== "")
                  ? classes.notEmpty
                  : classes.empty
              }
            />
          </div>
        </div>
      )}
    />;
  }

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue ?? ""}
      render={({ field }) => (
        <div className={classes.field}>
          <div className={cssClasses}>
            <input
              autoComplete={autocomplete}
              type={type ?? "text"}
              {...field}
              className={
                field.value || (field.value >= 0 && field.value !== "")
                  ? classes.notEmpty
                  : classes.empty
              }
            />
            <span className={`${classes.placeholder} ${isRequired}`}>
              {placeholder}
            </span>
          </div>
          {errors && errors[name]?.message && (
            <p className={classes.error}>
              {errors[name]?.message as ReactNode}
            </p>
          )}
        </div>
      )}
    />
  );
};
