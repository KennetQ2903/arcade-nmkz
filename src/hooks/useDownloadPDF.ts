import {useCallback,useRef} from "react"
import generatePDF from "react-to-pdf"
import {toast} from "sonner"

export const useDownloadPDF=() => {
    const tableRef=useRef()
    const handleDownload=useCallback(async () => {
        const response=await generatePDF(tableRef,{filename: `resumen-${new Date().toISOString()}.pdf`})
        if(!response) {
            toast.error("Error al generar el PDF")
        }

    },[toast])

    return {handleDownload,tableRef}
}