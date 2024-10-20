import {useEffect,useState} from "react"

export const useGetTicketDetails=() => {
    const [technicians,setTechnicians]=useState<User[]>([])
    const [arcades,setArcades]=useState<IArcadeMachine[]>([])

    useEffect(() => {
        const getAllTechnicians=async () => {
            return fetch('/api/user/getTechnicians',{
                method: 'GET'
            })
                .then(res => {
                    if(res.ok) {
                        return res.json()
                    } else {
                        throw new Error('Error getting technicians')
                    }
                })
                .then(setTechnicians)
                .catch(err => {
                    console.log(err)
                })
        }

        getAllTechnicians()
    },[])

    useEffect(() => {
        const getAllArcades=async () => {
            return fetch('/api/arcades/getAllArcades',{
                method: 'GET'
            })
                .then(res => {
                    if(res.ok) {
                        return res.json()
                    } else {
                        throw new Error('Error getting arcades')
                    }
                })
                .then(setArcades)
                .catch(err => {
                    console.log(err)
                })
        }

        getAllArcades()
    },[])


    return {
        technicians,
        arcades
    }
}