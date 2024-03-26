import { PropsWithChildren } from 'react'
import classes from '@/UI/Toolbar/toolbar.module.scss'

type ToolbarType = {
    className? : string
}


export const Toolbar:React.FC<PropsWithChildren<ToolbarType>> = ({children, className}) => {
    const tollbarClasses = `${classes.toolbar} ${className ? classes[className] : ''}`
    return <div className={tollbarClasses}>{children}</div>
}