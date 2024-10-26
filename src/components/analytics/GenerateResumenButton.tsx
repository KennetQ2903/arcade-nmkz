import type {PropsWithChildren} from "react"
import {Button} from "../ui/button"

interface Props {
    title: string
    onClick: () => void
}
export const GenerateResumenButton: React.FC<PropsWithChildren<Props>>=({title,children,onClick}) => {
    return (
        <Button onClick={onClick} className="justify-center gap-2">
            {children}
            {title}
        </Button>
    )
}