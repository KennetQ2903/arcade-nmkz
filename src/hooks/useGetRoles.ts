import {useEffect,useState} from "react"

export const useGetRoles=() => {
    const [roles,setRoles]=useState<IRol[]>([])

    useEffect(() => {
        const getAllRoles=async () => {
            return fetch('/api/util/getAllRoles',{
                method: 'GET'
            })
                .then(res => {
                    if(res.ok) {
                        return res.json()
                    } else {
                        throw new Error('Error getting roles')
                    }
                })
                .then(setRoles)
                .catch(err => {
                    console.log(err)
                })
        }

        getAllRoles()
    },[])

    return {
        roles
    }
}