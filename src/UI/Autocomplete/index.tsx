import { Input } from "@/UI/Input";
import classes from '@/UI/Autocomplete/styles.module.scss'
import {  FieldErrors } from "react-hook-form";
export type selectFuncType = {employee_id:string, employee_name:string}

type AutocompleteType<T> = {
    data: T,
    name: string,
    control: any,
    selectFunc: ({employee_id, employee_name}:selectFuncType) => void,
    className?: string,
    showList: boolean,
    errors?: FieldErrors<any>,
    isRequired?: string | boolean;
}



export function Autocomplete<T>({ data, name, control, selectFunc, className, showList, errors, isRequired }: AutocompleteType<T>) {
    return <>
        <Input name={name} control={control} placeholder="Name:" className={className} autocomplete="off" errors={errors} isRequired={isRequired}/>
        {showList && <ul className={classes.list}>
        {Array.isArray(data) && data.map(item => {
                return <li key={item._id} data-id={item._id} onClick={selectFunc.bind(null, {employee_id: item._id, employee_name: item.name})}>{item.name}</li>
            })}
        </ul>}
    
    </>
}