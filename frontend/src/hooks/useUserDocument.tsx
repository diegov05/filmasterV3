import { useState } from 'react'
import { User } from '../models/user'
import { User as FirestoreUser } from 'firebase/auth'
import axios from 'axios'


const useUserDocument = (firestoreUser: FirestoreUser) => {

    const [user, setUser] = useState<User | null>(null)

    async function loadUser() {
        try {
            const response = await axios.get(`/api/user/${firestoreUser.uid}`, { method: "GET" })
            const userDocument: User = response.data
            setUser(userDocument)
        } catch (error) {
            console.error("Error fetching user.", error)
        }
    }
    loadUser()

    return user
}

export { useUserDocument };