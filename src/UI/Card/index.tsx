import { PropsWithChildren } from "react";
import classes from './Card.module.css'

type CardType = {
    className?: string,
    variation?: "center" 
}

export const Card:React.FunctionComponent<PropsWithChildren<CardType>> = ({children, className, variation}) => {
    const cssClasses = `${classes.card } ${className ? classes[className] : ''}`
    const variationClass = `${variation ? classes[variation] : ''}`
    return (
        <section className={`${cssClasses} ${variationClass}`}>
            {children}
        </section>
    )
}