"use client";
import { InputType } from "@/UI/Input";
import { ReactNode } from "react";
import { Controller, FieldErrors } from "react-hook-form";
import classes from "@/UI/Input/Input.module.scss";

export type RadioType = InputType & {
  data?: any;
};

export const Radio: React.FC<RadioType> = ({
  className,
  name,
  placeholder,
  control,
  defaultValue,
  errors,
  isRequired,
  data,
}) => {
  const cssClasses = `${classes.inputField} ${classes.radio} ${
    className ? classes[className] : ""
  }`;
  return typeof data === "object" ? (
    <div className={classes.field}>
      <p className={`${isRequired} ${classes.title}`}>{placeholder}:</p>
      {Object.entries(data).map(([key, value], index) => {
        return (
          <Controller
            key={index}
            name={name}
            control={control}
            defaultValue={defaultValue ?? ""}
            render={({ field }) => (
              <>
                <div className={cssClasses}>
                  <input
                    checked={field.value === value}
                    type="radio"
                    {...field}
                    id={value as string}
                    className={field.value ? classes.notEmpty : classes.empty}
                    value={value as string}
                  />
                   <label htmlFor={value as string}>
                    {value as string}
                  </label>
                </div>
              </>
            )}
          />
        );
      })}
      {errors && errors[name]?.message && (
        <p className={classes.error}>{errors[name]?.message as ReactNode}</p>
      )}
    </div>
  ) : (
    "array in progress"
  );
};
