import { FC, useState } from 'react';
import { Header, Footer, Carousel } from '../../containers';


interface MainPageProps {

}

const MainPage: FC<MainPageProps> = () => {

    const [isMenuToggled, setIsMenuToggled] = useState<boolean>(false);

    const handleMenuToggle = () => {
        setIsMenuToggled(!isMenuToggled)
    }

    return (
        <div className='flex flex-col gap-12'>
            <Header handleMenuToggle={handleMenuToggle} />
            {!isMenuToggled &&
                <>
                    <Carousel content='movies' />
                    <Carousel content='series' />
                    <Carousel content='whatToWatch' />
                    <Carousel content='watchList' />
                    <Footer />
                </>
            }
        </div>
    )
}

export { MainPage };