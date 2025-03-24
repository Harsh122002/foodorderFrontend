import React from 'react'
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BiFoodTag } from "react-icons/bi";

export default function ImageSlider() {
     const images = [
          { src: "/Group.png", alt: "Group 1" },
          { src: "/Group-1.png", alt: "Group 2" },
     ];

     const settings = {
          dots: true,
          infinite: true,
          speed: 800,
          slidesToShow: 1,
          slidesToScroll: 1,
          autoplay: true,
          autoplaySpeed: 3000,
          pauseOnHover: true,
          arrows: false,
     };

     return (
          <div className=' h-[32rem]  mt-10  lg:ml-7 lg:mt-6 overflow-hidden cursor-pointer'>
               <Slider {...settings}>
                    {images.map((image, index) => (
                         <div key={index} className="relative w-full text-white">
                              <img
                                   src={image.src}
                                   alt={image.alt}
                                   className="w-full rounded-lg  h-[32rem] "
                              />
                              <p className="absolute top-10 left-0 lg:left-10 capitalize z-10 w-72 lg:w-96  font-bold bg-black/80 px-4 py-2 text-2xl lg:text-3xl rounded-md">
                                   Quality food delivery by HR Food
                              </p>
                              <BiFoodTag className='text-green-700 absolute top-10 right-2 text-2xl lg:right-10' />

                              <p className="absolute bottom-24 lg:bottom-10 left-10 capitalize z-10 max-w-96 font-bold bg-black/80 px-4 py-2 text-lg rounded-md">
                                   - Since-2016
                              </p>
                              <p className="absolute bottom-10 right-10 capitalize z-10 max-w-96  font-bold bg-black/80 px-4 py-2 text-xl rounded-md">
                                   - Manage by: HR GROUP
                              </p>
                         </div>
                    ))}
               </Slider>
          </div>
     );

}
