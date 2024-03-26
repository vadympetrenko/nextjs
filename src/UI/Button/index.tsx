import { PropsWithChildren, ReactNode } from "react";
import classes from '@/UI/Button/Button.module.scss'

type ButtonType = {
    className?: string,
    variation?: "center" | "full-width" | "primary" | "secondary" | "tertiary",
    icon? : ReactNode,
    onClick?: (event?:React.MouseEvent<HTMLElement>) => void,
    disabled?: boolean,
    active?: number,
    tabIndex?: number
}

export const Button:React.FunctionComponent<PropsWithChildren<ButtonType>> = ({children, className, variation, icon, onClick, disabled, active, tabIndex}) => {
    const buttonClasses = `${classes.button } ${className ? className : ''} ${variation ? classes[variation] : ''} ${active === tabIndex && active !== undefined && tabIndex !== undefined ? classes.active : ''}`
    const text = icon ? <>{icon} {children}</> : children 
    return (
        <button tabIndex={tabIndex} className={buttonClasses} onClick={onClick} disabled={disabled}>
            {text}
        </button>
    )
}