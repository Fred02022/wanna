import { useLayoutEffect, useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from "styled-components";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper'

// css
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// css


function Slider({ titles, descs, images, height }) {
    const prevRef = useRef(null)
    const nextRef = useRef(null)

    const SlideArea = styled.div`
        width: 100%;
        height: ${height};
    `

    const SlideList = styled.div`
        width: 100%;
        height: 100%;
        position: relative;
        cursor: pointer;
    `

    const SlideMock = styled.div`
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(rgba(0,0,0,0) 0%,rgba(0,0,0,0.1) 30%, rgba(0,0,0,0.8) 100%);
        z-index: 1;
    `

    const SlideContent = styled.div`
        width: 100%;
        max-width: 1280px;
        padding: 0 80px;
        height: 100%;
        display: flex;
        flex-direction: column-reverse;
        color: white;
    `

    const SlideTitle = styled.span`
        font-size: 36px;
        margin-bottom: 12px;
        font-weight: 600;
    `

    const SlideDesc = styled.span`
        font-size: 20px;
        margin-bottom: 48px;
        line-height: 36px;
        white-space: pre-wrap;
    `

    const SlideImageBox = styled.div`
        position: absoulte;
        top:0;
        left:0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow:hidden;
    `

    return (
        <SlideArea>
            <Swiper
                modules={[Autoplay, Pagination, Navigation]}
                autoplay={{
                    disableOnInteraction: false
                }}
                slidesPerView={1}
                onInit={(swiper) => {
                    swiper.params.navigation.prevEl = prevRef.current;
                    swiper.params.navigation.nextEl = nextRef.current;
                    swiper.navigation.init();
                    swiper.navigation.update();
                }}
                pagination={{ clickable: true }}
            >
                {
                    titles.map((x, i) => {
                        return (
                            <SwiperSlide key={i}>
                                <SlideList>
                                    {/* <SlideMock>
                                        <SlideContent>
                                            <SlideDesc>
                                                {descs[i]}
                                            </SlideDesc>
                                            <SlideTitle>
                                                {titles[i]}
                                            </SlideTitle>
                                        </SlideContent>
                                    </SlideMock> */}
                                    <SlideImageBox>
                                        <img src={images[i]} alt={titles[i]} />
                                    </SlideImageBox>
                                </SlideList>
                            </SwiperSlide>
                        )
                    })
                }
                <div className='slide_buttons'>
                    <button className='slide_button' ref={prevRef}>&lt;</button>
                    <button className='slide_button' ref={nextRef}>&gt;</button>
                </div>
            </Swiper>
        </SlideArea>
    );
}

export default Slider;