import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion"
import { useQuery, useMutation } from '@apollo/client';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';
import { EffectCoverflow, Autoplay, Mousewheel, Pagination } from 'swiper/modules';

const Carousel = ({ orgs }) => {

  console.log(orgs)

  const organizationData = orgs.map((org) => ({
    id: org._id,
    image: org.image,
    title: org.name,
  })).reverse()

  return (
    <>
      <div className='w-full pb-8 mx-auto'>
        <Swiper
          effect={'coverflow'}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={"auto"}
          spaceBetween={60}
          coverflowEffect={{
            rotate: 10,
            stretch: 60,
            depth: 200,
            modifier: 1,
            slideShadows: true,
          }}
          mousewheel={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          modules={[EffectCoverflow, Autoplay, Mousewheel, Pagination]}
          className="mySwiper py-12 w-full"
          style={{
            '--swiper-pagination-color': '#FF7067',
          }}
        >
          {/* bg-black object-scale-down */}
          {organizationData.map((project) => (
            <SwiperSlide key={project.id} style={{ width: '400px', height: '300px' }}>
              <div className="w-full h-full">
                <Link to={`/organization/${project.id}`}>
                  <div className="block w-full h-full">
                    <img className="absolute top-0 left-0 w-full h-full z-[-1] bg-black object-scale-down md:rounded-xl" src={project.image} alt={project.title} />
                  </div>
                </Link>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  )
};

export default Carousel;
