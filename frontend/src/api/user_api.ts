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

export async function fetchUser(firebaseId: string): Promise<User> {
    const users = await fetchUsers();
    const filteredUser = users.find((user: User) => user.firebaseId === firebaseId);
    const response = await fetchData(`/api/users/${filteredUser?._id}`)

    if (response.ok) {
        return response.json()
    }
    else {
        const errorBody = await response.json();
        const errorMessage = errorBody.error
        throw Error(errorMessage)
    }
}

export interface UserInput {
    email: string
    firebaseId: string
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

export interface UpdateUserInput {
    firebaseId: string
    email?: string
    username?: string
    password?: string
    favorites?: string[]
    watchList?: string[]
}

export async function updateUser(user: UpdateUserInput): Promise<User> {
    const userDocument = await fetchUser(user.firebaseId)
    const response = await fetchData(`/api/users/${userDocument._id}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });
    return response.json()
}

