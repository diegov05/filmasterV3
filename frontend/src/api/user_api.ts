import { User as FirestoreUser } from 'firebase/auth';
import { User } from '../models/user';

async function fetchData(input: RequestInfo, init?: RequestInit) {
    const response = await fetch(input, init);
    if (response.ok) {
        return response
    } else {
        const errorBody = await response.json();
        const errorMessage = errorBody.error
        throw Error(errorMessage)
    }
}

export async function fetchUsers(): Promise<User[]> {
    const response = await fetchData("/api/users", { method: "GET" })
    return response.json();
}

export async function fetchUser(firestoreUser: FirestoreUser): Promise<User> {
    const response = await fetchData(`api/users/${firestoreUser}`, { method: "GET" })
    return response.json();
}

export interface UserInput {
    username: string
    password: string
}

export async function createUser(user: UserInput): Promise<User> {
    const response = await fetchData("/api/users",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });
    return response.json()
}