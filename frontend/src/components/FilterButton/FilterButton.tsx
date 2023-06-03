import { FC, useEffect, useRef, useState } from 'react';
import { AdjustmentsVerticalIcon } from '@heroicons/react/24/outline';

interface FilterButtonProps {
    handleIndexChange: (index: number) => void
}

const FilterButton: FC<FilterButtonProps> = (props) => {

    const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);
    const [isFocused, setIsFocused] = useState<boolean>(false);

    const userRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (userRef.current && !userRef.current.contains(event.target as Node)) {
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
            setTimeout(() => {
                setIsMenuVisible(false)
            }, 500)
            return
        }
        setIsMenuVisible(true)
    }

    return (
        <div ref={userRef} className='flex flex-col relative'>
            <button onFocus={handleFocus} onClick={handleToggleMenu} className='flex flex-row gap-2 justify-center items-center px-5 py-3 sm:max-4xl:py-3 bg-button-primary-color text-bg-color rounded-2xl font-bold text-sm sm:max-4xl:text-base transition-all hover:bg-accent-color hover:text-text-color'>
                Filter
                <AdjustmentsVerticalIcon className='w-3 h-3 sm:max-4xl:w-4 sm:max-4xl:h-4' />
            </button>
            {isMenuVisible &&
                <div className='absolute z-50 w-28 top-16 md:max-4xl:top-20 right-0 rounded-2xl bg-bg-color flex flex-col justify-center items-center shadow-sm shadow-zinc-500'>
                    <div onClick={() => {
                        handleToggleMenu()
                        props.handleIndexChange(0)
                    }} className='w-full px-4 py-4 flex justify-center items-center font-medium cursor-pointer transition-all hover:bg-accent-color rounded-t-2xl border-b border-zinc-200'>Now Playing</div>
                    <div onClick={() => {
                        handleToggleMenu()
                        props.handleIndexChange(1)
                    }} className='w-full px-4 py-4 flex justify-center items-center font-medium cursor-pointer transition-all hover:bg-accent-color border-b border-zinc-200'>Upcoming</div>
                    <div onClick={() => {
                        handleToggleMenu()
                        props.handleIndexChange(2)
                    }} className='w-full px-4 py-4 flex justify-center items-center font-medium cursor-pointer transition-all hover:bg-accent-color rounded-b-2xl'>Trending</div>
                </div>
            }
        </div>
    )
}

export { FilterButton };