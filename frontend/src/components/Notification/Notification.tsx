import { FC, useEffect, useState } from 'react'
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon } from '@heroicons/react/20/solid'
import "./Notification.css"

interface NotificationProps {
    message: string,
    success: number
}

const Notification: FC<NotificationProps> = (props) => {

    const [canShow, setCanShow] = useState<boolean>(false);

    useEffect(() => {
        setTimeout(() => {
            setCanShow(true)
        }, 3000)
        setCanShow(false)
    }, [])

    return (
        <div className={`slide-in-top ${canShow ? "slide-out-top" : ""} flex flex-row gap-2 justify-center items-center w-max fixed top-8 left-0 right-0 ml-auto mr-auto bg-white px-4 py-4 rounded-2xl shadow-fr shadow-md`}>
            {props.success === 1 ?
                <CheckCircleIcon className='w-4 h-4 fill-emerald-500' />
                : props.success === 2
                    ? <XCircleIcon className='w-4 h-4 fill-red-500' />
                    : <InformationCircleIcon className='w-4 h-4 fill-amber-400' />
            }
            <span className='text-xs'>{props.message}</span>
        </div>
    )
}

export { Notification };