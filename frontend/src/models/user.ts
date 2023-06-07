export interface User {
    _id: string,
    username: string,
    firebaseId: string,
    password: string,
    avatar: string
    favorites: string[],
    watchList: string[],
    createdAt: string,
    updatedAt: string,
}