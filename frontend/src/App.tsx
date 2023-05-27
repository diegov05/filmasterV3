import { useState, FC, useEffect } from 'react'
import "./App.css"
import { User } from './models/user'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

interface AppProps {

}

const App: FC<AppProps> = () => {
    const [users, setUsers] = useState<User[]>([])

    useEffect(() => {
        const fetchUsers = async () => {
            // const config: AxiosRequestConfig = {
            //     method: 'GET',
            //     url: '/api/users',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     }
            // }
            // try {
            //     const response: AxiosResponse = await axios.request(config);
            //     setUsers(response.data);
            // } catch (error) {
            //     console.error(error); // Handle the error response
            // }
            try {
                const response = await fetch('/api/users', { method: "GET" })
                const users = await response.json();
                setUsers(users)
            } catch (error) {
                console.error("Error in the code")
            }
        }
        fetchUsers()
    }, [])

    return (
        <div>
            {JSON.stringify(users)}
        </div>
    )
}

export { App };