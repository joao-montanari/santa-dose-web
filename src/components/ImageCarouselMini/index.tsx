import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./style.sass"

const ImageCarouselMini = ({images, nameOwner, numeroFoto} : {images : string[], nameOwner: string, numeroFoto : string}) => { 
    return(
        <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={10}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000 }}
            className="swiperMainMini"

        >
        {images.map((image, index) => (
            <SwiperSlide key={index}>
                <img
                    src={image}
                    alt={`Slide ${index + 1}`}
                    className="carousel-imageMini"
                />
                <h3>Nome: {nameOwner}</h3>
                <h3>Número: {numeroFoto}</h3>

            </SwiperSlide>
            
        ))}
        
        </Swiper>


    )
}

export default ImageCarouselMini