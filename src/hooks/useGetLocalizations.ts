import {useEffect,useState} from "react"

export const useGetLocalizations=() => {
    const [localidades,setLocalidades]=useState<ILocalization[]>([])
    useEffect(() => {
        const getAllLocalities=async () => {
            return fetch('/api/util/getAllLocalizations',{
                method: 'GET'
            })
                .then(res => {
                    if(res.ok) {
                        return res.json()
                    } else {
                        throw new Error('Error getting localities')
                    }
                })
                .then(setLocalidades)
                .catch(err => {
                    console.log(err)
                })
        }

        getAllLocalities()
    },[])

    return {
        localidades
    }
}