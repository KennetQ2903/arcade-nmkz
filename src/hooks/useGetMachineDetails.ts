import {useEffect,useState} from "react"

export const useGetMachineDetails=() => {
    const [machineTypes,setMachineTypes]=useState<IArcadeMachineType[]>([])
    const [machineHealthStatus,setMachineHealthStatus]=useState<IArcadeMachineState[]>([])
    const [providers,setProviders]=useState<IProvider[]>([])
    const [technicians,setTechnicians]=useState<User[]>([])
    const [shops,setShops]=useState<IShop[]>([])


    useEffect(() => {
        const getAllMachineTypes=async () => {
            return fetch('/api/arcades/getTypes',{
                method: 'GET'
            })
                .then(res => {
                    if(res.ok) {
                        return res.json()
                    } else {
                        throw new Error('Error getting machine types')
                    }
                })
                .then(setMachineTypes)
                .catch(err => {
                    console.log(err)
                })
        }

        getAllMachineTypes()
    },[])

    useEffect(() => {
        const getAllMachineHealthStatus=async () => {
            return fetch('/api/arcades/getStates',{
                method: 'GET'
            })
                .then(res => {
                    if(res.ok) {
                        return res.json()
                    } else {
                        throw new Error('Error getting machine states')
                    }
                })
                .then(setMachineHealthStatus)
                .catch(err => {
                    console.log(err)
                })
        }

        getAllMachineHealthStatus()
    },[])

    useEffect(() => {
        const getAllProviders=async () => {
            return fetch('/api/providers/getAllProviders',{
                method: 'GET'
            })
                .then(res => {
                    if(res.ok) {
                        return res.json()
                    } else {
                        throw new Error('Error getting providers')
                    }
                })
                .then(setProviders)
                .catch(err => {
                    console.log(err)
                })
        }

        getAllProviders()
    },[])

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
        const getAllShops=async () => {
            return fetch('/api/shops/getAllShops',{
                method: 'GET'
            })
                .then(res => {
                    if(res.ok) {
                        return res.json()
                    } else {
                        throw new Error('Error getting shops')
                    }
                })
                .then(setShops)
                .catch(err => {
                    console.log(err)
                })
        }

        getAllShops()
    },[])

    return {
        machineTypes,
        machineHealthStatus,
        providers,
        technicians,
        shops
    }
}