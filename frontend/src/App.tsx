import { FC } from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { AuthProvider } from './contexts/AuthContext'
import { Login, MainPage, Movie, Register } from "./pages"
import "./App.css"

interface AppProps {

}

const App: FC<AppProps> = () => {
    return (
        <>
            <AuthProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path='/login' element={<Login />} />
                        <Route path='/register' element={<Register />} />
                        <Route path='/' element={<MainPage />} />
                        <Route path='/movie/:id' element={<Movie />} />
                    </Routes>
                </BrowserRouter>
            </AuthProvider >
        </>
    )
}

export { App };