import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./style.sass"

const ImageCarousel = ({ images } : {images: string[]}) => {
    return(
        <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={10}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000 }}
            className="swiperMain"
        >
        {images.map((image, index) => (
            <SwiperSlide key={index}>
                <img
                    src={image}
                    alt={`Slide ${index + 1}`}
                    className="carousel-image"
                />
            </SwiperSlide>
        ))}
        </Swiper>
    )
}

export default ImageCarousel