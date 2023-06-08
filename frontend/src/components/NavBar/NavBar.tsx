import { FC, useEffect, useRef, useState } from 'react'
import images from "../../assets"
import { SearchBar } from '../SearchBar/SearchBar'
import { useNavigate } from 'react-router-dom'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { User as FirestoreUser, onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../../firebase'
import { User } from '../../models/user'
import { fetchUser } from '../../api/user_api'
import Lottie from 'lottie-react'

interface NavBarProps {

}

const NavBar: FC<NavBarProps> = () => {

    const navigate = useNavigate()
    const [user, setUser] = useState<FirestoreUser | null>(null);
    const [userDocument, setUserDocument] = useState<User | null>(null);
    const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);
    const [isToggled, setIsToggled] = useState<boolean>(false);
    const [isFocused, setIsFocused] = useState<boolean>(false);

    const userRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (userRef.current && !userRef.current.contains(event.target as Node)) {
                setIsToggled(false)
                setTimeout(() => {
                    setIsFocused(false);
                    setIsMenuVisible(false)
                }, 500)
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleFocus = () => {
        setIsFocused(!isFocused)
    }

    const handleToggleMenu = () => {
        if (isMenuVisible) {
            setIsToggled(false)
            setTimeout(() => {
                setIsMenuVisible(false)
            }, 500)
            return
        }
        setIsToggled(true)
        setIsMenuVisible(true)
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                const userDocument = await fetchUser(user.uid)
                setUserDocument(userDocument)
            } else {
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, []);

    return (
        <div className='flex flex-row w-full justify-between items-center'>
            <div>
                <img onClick={() => navigate('/')} className='cursor-pointer w-28 md:max-4xl:w-36' src={images.logoWhite} alt="logo" />
            </div>
            <div className='hidden sm:max-4xl:flex flex-row justify-end items-center gap-4'>
                <SearchBar />
                {!user &&
                    <>
                        <button onClick={() => navigate('/login')} className='sm:max-4xl:px-5 sm:max-4xl:py-3 text-xs font-bold bg-button-primary-color text-bg-color rounded-2xl transition-all hover:bg-accent-color hover:text-text-color'>Sign In</button>
                        <button onClick={() => navigate('/register')} className='sm:max-4xl:px-5 sm:max-4xl:py-3 text-xs font-bold bg-bg-color text-text-color rounded-2xl transition-all hover:bg-accent-color'>Register</button>
                    </>}
                {user && (
                    <>
                        <div ref={userRef} className='relative'>
                            {isMenuVisible && isFocused &&
                                <div className={`slide-in-fwd-center ${!isToggled ? "slide-out-bck-center" : ""} absolute w-28 top-14 right-0 rounded-2xl bg-bg-color flex flex-col justify-center items-center`}>
                                    <div onClick={() => {
                                        signOut(auth)
                                        navigate('/login')
                                    }} className='w-full px-4 py-4 flex justify-center items-center font-medium cursor-pointer transition-all hover:bg-accent-color rounded-2xl'>Sign Out</div>
                                </div>
                            }
                            <button onFocus={handleFocus} onClick={handleToggleMenu} className='px-5 py-3 bg-bg-color rounded-2xl flex flex-row justify-between items-center text-text-color transition-all hover:bg-accent-color gap-3'>
                                {userDocument ? <img src={userDocument?.avatar} className='w-4 h-4' /> : <Lottie animationData={images.loading} className='w-4' />}
                                <ChevronDownIcon className='w-4 h-4' />
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div >
    )
}

export { NavBar };