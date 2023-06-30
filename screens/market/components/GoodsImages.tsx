import { Box, BoxProps } from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';
import Carousel from 'src/components/carousel';
import Image from 'src/components/image';
import { ICartModel } from 'src/models/market-store/Cart';
import { IGoodsModel } from 'src/models/market-store/Goods';
import { ReactComponent as DefaultImg } from 'src/assets/images/default-goods.svg';
import { InnerSlider } from 'react-slick';
import { toJS } from 'mobx';

export interface IGoodsImagesProps extends BoxProps {
  goods?: IGoodsModel | ICartModel;
  swipe?: boolean;
  onReInit?: (state: any) => void;
}

export const GoodsImages = ({ goods, swipe = false, onReInit, sx }: IGoodsImagesProps) => {
  const { REACT_APP_IMAGE_STORAGE } = process.env;

  const carouselRef = useRef<Carousel | null>(null);
  // const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const play = () => {
      timeoutId && clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        carouselRef.current?.slickNext();
        play();
      }, 3000);
    };
    setTimeout(play, Math.random() * 3000);
    return () => {
      timeoutId && clearTimeout(timeoutId);
    };
  }, [carouselRef]);

  const handleOnInit = useCallback(() => {
    // @ts-ignore
    onReInit?.(carouselRef.current?.innerSlider?.state);
  }, [onReInit]);

  const carouselSettings = {
    dots: false,
    arrows: false,
    slidesToShow: 1,
    initialSlide: 0,
    rtl: false,
    speed: 700,
    infinite: true,
    // centerMode: true,
    swipeToSlide: swipe,
    swipe: swipe,
    touchMove: swipe,
    draggable: swipe,
  };

  const images: string[] = [
    goods?.img1Path ? REACT_APP_IMAGE_STORAGE + goods.img1Path : '/assets/default-goods.svg',
    goods?.img2Path ? REACT_APP_IMAGE_STORAGE + goods.img2Path : '/assets/default-goods.svg',
  ];

  return (
    <Box sx={{ ...sx, zIndex: 0 }}>
      <Carousel ref={carouselRef} {...carouselSettings} onReInit={handleOnInit}>
        {images.map((src: string, i: number) => (
          <Image
            key={`goods-image-carousel-${i}`}
            src={src}
            effect={'opacity'}
            onError={(e: any) => {
              e.target.src = '/assets/default-goods.svg';
            }}
            sx={{ width: '100%', height: '100%' }}
          // width="100%" height="100%"
          />
        ))}
      </Carousel>
    </Box>
  );
};
