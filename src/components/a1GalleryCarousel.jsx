

import React, { useState, useRef, useEffect } from 'react';
import Slider from 'react-slick';
import './a1Home.css';

const GalleryShowcase = () => {
  const sliderRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Gallery images data
  const galleryImages = [
    {
      id: 1,
      src: '/images/GalleryImg1.png',
      alt: 'Gallery Image 1'
    },
    {
      id: 2,
      src: '/images/AvailVehImg1.png',
      alt: 'Gallery Image 2'
    },
    {
      id: 3,
      src: '/images/FootSocIcon1.png',
      alt: 'Gallery Image 3'
    },
    {
      id: 4,
      src: '/images/FootSocIcon2.png',
      alt: 'Gallery Image 4'
    },
    {
      id: 5,
      src: '/images/FootSocIcon3.png',
      alt: 'Gallery Image 5'
    }
  ];

  // Smooth carousel settings
  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: false,
    cssEase: 'cubic-bezier(0.645, 0.045, 0.355, 1)', // Smooth ease-in-out
    rtl: false, // Changed to false for proper left-to-right
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    swipe: true,
    touchMove: true,
    waitForAnimate: true,
    beforeChange: (current, next) => setCurrentSlide(next),
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
        //   dots: true,
          speed: 1000
        }
      }
    ]
  };

  const nextSlide = () => {
    sliderRef.current.slickNext();
  };

  const prevSlide = () => {
    sliderRef.current.slickPrev();
  };

  const goToSlide = (index) => {
    sliderRef.current.slickGoTo(index);
  };

  return (
    <>
      {/* GALLERY SHOWCASE */}
      <div className='container my-5'>
        <div className='RdShowHomeSideHeading mb-4'>
          Gallery / Showcase
        </div>
        
        <div className='GalleryMain'>
          <div className='gallery-slider'>
            <Slider ref={sliderRef} {...settings}>
              {galleryImages.map((image) => (
                <div key={image.id} className='gallery-slide'>
                  <img 
                    src={image.src} 
                    className='GalleryImg'
                    alt={image.alt}
                    loading="lazy"
                  />
                </div>
              ))}
            </Slider>

            {/* Custom Navigation Arrows */}
            <button 
              className='GalleryArrow prev' 
              onClick={prevSlide}
              aria-label="Previous image"
            >
              <img 
                src='/images/GalleryLeftArrow.png' 
                className='GalleryArrowImg' 
                alt="Previous"
              />
            </button>
            
            <button 
              className='GalleryArrow next' 
              onClick={nextSlide}
              aria-label="Next image"
            >
              <img 
                src='/images/GalleryRightArrow.png' 
                className='GalleryArrowImg' 
                alt="Next"
              />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default GalleryShowcase;