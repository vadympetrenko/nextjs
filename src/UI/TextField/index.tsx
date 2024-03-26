import { PropsWithChildren } from "react";
import classes from '@/UI/TextField/styles.module.scss'

type TextFieldType = {
    className?: string
}

export const TextField:React.FC<PropsWithChildren<TextFieldType>> = ({children, className}) => {
    return <div className={`${classes.field} ${className ? className : ''}`}>
        {children}
    </div>
}