import { ReactNode } from "react";
import { Controller, FieldErrors } from "react-hook-form";
import { InputType } from "@/UI/Input";
import classes from "@/UI/Input/Input.module.scss";

export type CheckBox = InputType & {
  data: [] | {};
};

export const Checkbox: React.FC<CheckBox> = ({
  className,
  name,
  placeholder,
  control,
  defaultValue,
  errors,
  isRequired,
  data,
}) => {
  const cssClasses = `${classes.inputField} ${classes.checkbox} ${
    className ? classes[className] : ""
  }`;

  return typeof data === "object" && data !== null && !Array.isArray(data) ? (
    <div className={classes.field}>
      <p className={`${isRequired} ${classes.title}`}>{placeholder}:</p>

      {Object.entries(data).map(([key, value], index) => {
        return (
          <Controller
            name={name}
            key={index}
            control={control}
            defaultValue={defaultValue ?? ""}
            render={({ field }) => (
              <>
                <div className={cssClasses}>
                  <input
                    type="checkbox"
                    {...field}
                    checked={field.value.includes(value)}
                    id={value as string}
                    className={field.value ? classes.notEmpty : classes.empty}
                    value={value as string}
                    onChange={(event) => {
                      event.target.checked
                        ? field.onChange(field.value.push(event.target.value))
                        : (field.value = field.value.filter(
                            (item: string) => item !== event.target.value
                          ));

                      field.onChange(field.value);
                    }}
                  />
                  <label htmlFor={value as string}>{value as string}</label>
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
    <div className={classes.field}>
      <p className={`${isRequired} ${classes.title}`}>{placeholder}:</p>
      {Array.isArray(data) &&
        data.map((item) => {
          return (
            <Controller
              name={name}
              key={item._id}
              control={control}
              defaultValue={defaultValue ?? ""}
              render={({ field }) => (
                <>
                  <div className={cssClasses}>
                    <input
                      type="checkbox"
                      {...field}
                      checked={field.value.includes(item._id)}
                      id={item._id as string}
                      className={field.value ? classes.notEmpty : classes.empty}
                      value={item._id as string}
                      onChange={(event) => {
                        event.target.checked
                          ? field.onChange(field.value.push(event.target.value))
                          : (field.value = field.value.filter(
                              (item: string) => item !== event.target.value
                            ));

                        field.onChange(field.value);
                      }}
                    />
                    <label htmlFor={item._id as string}>{item.name as string}</label>
                  </div>
                </>
              )}
            />
          );
        })}
    </div>
  );
};
