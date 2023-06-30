import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from 'react';
import { useStores } from "src/models/root-store/root-store-context"
import { Stack, useTheme } from '@mui/material';
import Carousel, { CarouselArrowIndex } from 'src/components/carousel';
import Image from '../../../components/image/Image';
import { useNavigate } from 'react-router-dom';
import bannerImage from 'src/assets/images/main.svg'
import { IBannerSnapshot } from "src/models";
import { pxToRem } from "src/theme/typography";

/**
 * ## BannerMain 설명
 *
 */
export const BannerMain = observer(() => {

  const rootStore = useStores();
  const { loadingStore, homeStore } = rootStore;
  const theme = useTheme();
  const { REACT_APP_IMAGE_STORAGE } = process.env;

  const navigate = useNavigate();

  const carouselRef = useRef<Carousel | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselSettings = {
    dots: false,
    arrows: false,
    autoplay: true,
    slidesToShow: 1,
    rtl: false,
    speed: 600,
    infinite: true,
    ease: 'easeOut',
    centerMode: false,
    swipeToSlide: true,
    adaptiveHeight: true,
    beforeChange: (current: number, next: number) => setCurrentIndex(next),
  };

  const handlePrev = () => {
    carouselRef.current?.slickPrev();
  };

  const [isPlay, setIsPlay] = useState(true);
  const handlePlay = () => {
    isPlay ? carouselRef.current?.slickPause() : carouselRef.current?.slickPlay()
    setIsPlay(!isPlay);
  };

  const image = [bannerImage, bannerImage, bannerImage]

  const move = (url: string) => {
    console.log('🌈 ~ move ~ url:', url)
    if (url && url !== '') {
      url.endsWith('intro.html') ?
        window.location.href = '/intro/intro.html'
        :
        url.substr(0, 4) === 'http' ?
          window.open(url, '')
          :
          navigate(url || '')
    }
  }

  return (
    <>
      <Stack sx={{ position: 'relative', mt: '1px', mb: pxToRem(20) }}>
        <Carousel ref={carouselRef} {...carouselSettings}>
          {
            homeStore.home.bannerList && homeStore.home.bannerList.map((banner: IBannerSnapshot, i: number) => {
              return (
                <Image key={`banner-${i}`} src={`${REACT_APP_IMAGE_STORAGE}${banner.thumbnlPath}`} effect={'opacity'}
                  onClick={() => {
                    move(banner.contsLink || '');
                  }}
                  sx={{ cursor: 'pointer' }}
                />
              )
            })
          }
        </Carousel>
        {homeStore.home.bannerList && homeStore.home.bannerList?.length > 0 ? <CarouselArrowIndex
          index={currentIndex}
          total={homeStore.home?.bannerList?.length || 0}
          onNext={handlePlay}
          onPrevious={handlePrev}
          usePrevious={false}
          play={isPlay}
          sx={{
            position: 'absolute',
            right: '20px',
            bottom: '15px',
            borderRadius: 4,
            padding: '0px 5px',
            height: '24px',
            fontSize: theme.typography.pxToRem(12),
            '& button svg ': {
              width: '16px', height: '16px'
            }
          }}
        /> : null}
      </Stack>
    </>
  );
});

export default BannerMain;