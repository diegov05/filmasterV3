import { FC } from 'react'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import { AiFillGithub } from 'react-icons/ai'
import images from "../../assets"

interface FooterProps {

}

const Footer: FC<FooterProps> = () => {
    return (
        <div className='relative px-10 py-20 flex flex-col md:max-4xl:flex-row justify-between'>
            <div className='flex flex-col gap-4'>
                <h1 className='font-bold text-2xl xs:max-sm:text-3xl sm:max-4xl:text-5xl pb-4'>Your Gateway to <br />
                    Cinematic Excellence<br />
                    Filmaster
                </h1>
                <a className='w-min' href="https://github.com/diegov05/filmasterV2" target='__blank'>
                    <button className='flex flex-row justify-start items-center gap-2 bg-gradient cursor-pointer transition-all duration-300 hover:opacity-80 py-2 px-8 md:max-4xl:py-4 w-max md:max-4xl:px-16 rounded-2xl font-bold text-sm md:max-4xl:text-xl text-bg-color'>
                        Learn More
                        <ArrowTopRightOnSquareIcon className='w-6 h-6' />
                    </button>
                </a>
                <a className='w-min' href="https://github.com/diegov05" target='__blank'>
                    <button className='flex flex-row justify-start items-center gap-2.5 bg-[#0d1017] cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-zinc-300 py-2 px-8 md:max-4xl:py-4 w-max md:max-4xl:px-16 rounded-2xl font-bold text-sm md:max-4xl:text-xl text-bg-color'>
                        diegov05
                        <AiFillGithub className='w-6 h-6' />
                    </button>
                </a>
            </div>
            <img className='-z-10 absolute right-0 -bottom-32 xs:max-lg:-bottom-32 xs:w-[20rem] s:max-lg:w-[30rem] lg:max-xl:w-[50rem] xl:max-4xl:w-[60rem]' src={images.footerImage} alt="" />
        </div>
    )
}

export { Footer };