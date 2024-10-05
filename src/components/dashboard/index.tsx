import {useUserStore} from "@/store/user.store"
import {useEffect} from "react"

export function DashboardView() {
    const {user,setUser}=useUserStore((state) => state)

    useEffect(() => {
        const getUserData=async () => {
            return fetch('/api/query/getUserInfo',{
                method: 'GET'
            })
                .then(res => {
                    if(res.ok) {
                        return res.json()
                    }
                    else {
                        throw new Error('Error getting user data')
                    }
                })
                .then(data => {
                    setUser(data)
                })
                .catch(err => {
                    console.log(err)
                })
        }
        getUserData()
    },[])

    return (
        <>
            <h1>Welcome {user.nombre}</h1>
            <p>We are happy to see you here</p>
            <form action="/api/auth/signout">
                <button type="submit">Sign out</button>
            </form>
        </>
    )
}