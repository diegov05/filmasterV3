import { useState, FC, useEffect } from 'react'
import "./App.css"
import { User } from './models/user'
import axios from 'axios';

interface AppProps {

}

const App: FC<AppProps> = () => {
    const [users, setUsers] = useState<User[]>([])

    useEffect(() => {
        async function loadUsers() {
            try {
                const response = await axios.get("/api/users", { method: "GET" })
                const users = response.data
                setUsers(users)
            } catch (error) {
                console.error(error)
            }
        }
        loadUsers()
    }, [])

    return (
        <div>
        </div>
    )
}

export { App };