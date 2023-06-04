export interface User {
    _id: string,
    username: string,
    password: string,
    favorites: string[],
    watchList: string[],
    createdAt: string,
    updatedAt: string,
}