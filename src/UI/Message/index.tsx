import { Status } from "@/lib/serverFetching";
import { TiWarningOutline, TiInfoOutline, TiTickOutline, TiTimesOutline  } from "react-icons/ti";
import classes from '@/UI/Message/styles.module.scss'

export type MessageType = {
    status: Status,
    message: string
}

const icons = {
    warning : <TiWarningOutline />,
    success : <TiTickOutline />,
    info : <TiInfoOutline />,
    error : <TiTimesOutline />,
    default : '',
}
export const Message:React.FC<MessageType> = ({message, status}) => {
    return <p className={`${classes[status]} ${classes.message}`}>{icons[status]} {message}</p>
}