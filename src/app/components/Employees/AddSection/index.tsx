import Link from "next/link"
import classes from "@/app/components/Employees/AddSection/styles.module.scss"
import { TiPlus } from "react-icons/ti"

type AddSectionType = {
    className?: string,
    text: string,
    link: string
}

export const AddSection:React.FC<AddSectionType> = ({className, text, link}) => {
    return <Link href={link}>
    <div className={`bg-white rounded ${className}`}>
      <h4 className={`text-center`}> {text}</h4> <TiPlus className={classes.add} />
    </div>
    </Link>
}