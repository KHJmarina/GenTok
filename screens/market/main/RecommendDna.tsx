import { Box, Typography, useTheme } from '@mui/material';
import { observer } from 'mobx-react-lite';

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { SwipeDirection } from 'react-slick';
import Carousel from 'src/components/carousel';
import Image from 'src/components/image';
import { useWidth } from 'src/hooks/useResponsive';
import { useStores } from 'src/models';
import { IGoodsModel } from 'src/models/market-store/Goods';
import { pxToRem } from 'src/theme/typography';
import { ReactComponent as IconThumbUp } from '../assets/icons/ico-thumb-up.svg';
import { ReactComponent as IconCandy1 } from './glassesAndCandy.svg';
import { ReactComponent as IconCandy2 } from './pigTailAndCandy.svg';

export interface IRecommendDnaProps {}

export const RecommendDna = observer(({}: IRecommendDnaProps) => {
  const { marketStore } = useStores();
  const theme = useTheme();
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const width = useWidth();
  const carouselSettings = {
    autoplay: true,
    dots: false,
    arrows: false,
    draggable: true,
    slidesToShow:
      width === 'xs'
        ? 2
        : width === 'sm'
        ? 3
        : width === 'md'
        ? 3
        : width === 'lg'
        ? 3
        : width === 'xl'
        ? 3
        : 3,
    initialSlide: 0,
    speed: 700,
    infinite: true,
    // centerMode: true,
    swipeToSlide: true,
  };

  return (
    <Box
      id="market-main--recommend"
      sx={{ display: 'flex', flexDirection: 'column', position: 'relative', width: '100%' }}
    >
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <IconThumbUp width={24} height={24} />
        <Typography variant="Kor_22_b" sx={{ textAlign: 'left' }}>
          딱 맞는 DNA <span style={{ color: theme.palette.primary.main }}>#추천</span>
        </Typography>
      </Box>

      <Box
        sx={{
          mt: pxToRem(20),
          ml: pxToRem(-20),
          mr: pxToRem(-20),
          pr: pxToRem(26),
          position: 'relative',
          height: pxToRem(220),
        }}
      >
        <Box
          sx={{
            width: 'calc(100% + 0px)',
            height: pxToRem(220),
            overflow: 'hidden',
            justifyContent: 'flex-end',
            ml: pxToRem(-12),
          }}
        >
          <Box ref={carouselRef}>
            <Carousel {...carouselSettings}>
              {marketStore.mainDNAGoodsFirstClass.map((item, index) => (
                <RecommendDnaItem key={`dnaGoods1-${index}`} data={item} />
              ))}
            </Carousel>
          </Box>
        </Box>
        <IconCandy1 style={{ position: 'absolute', right: pxToRem(0), top: pxToRem(40) }} />
      </Box>

      <Box
        sx={{
          mt: pxToRem(20),
          ml: pxToRem(-40),
          mr: pxToRem(-40),
          pl: pxToRem(50),
          position: 'relative',
        }}
      >
        <Box
          sx={{
            width: 'calc(100% + 0px)',
            height: pxToRem(220),
            overflow: 'hidden',
          }}
        >
          <Box>
            <Carousel {...carouselSettings} rtl>
              {marketStore.mainDNAGoodsSecondClass.map((item, index) => (
                <RecommendDnaItem key={`dnaGoods2-${index}`} data={item} />
              ))}
            </Carousel>
          </Box>
        </Box>
        <IconCandy2 style={{ position: 'absolute', left: pxToRem(18), bottom: pxToRem(22) }} />
      </Box>
    </Box>
  );
});

interface IRecommendDnaItemProps {
  data: IGoodsModel;
}
const RecommendDnaItem = ({ data }: IRecommendDnaItemProps) => {
  const theme = useTheme();
  const category = data.ctegryList[0]?.ctegryNm;
  let backgroundColor = theme.palette.dna.nutrient.pastel;

  // prettier-ignore
  switch(category) {
    case '영양소': backgroundColor = theme.palette.dna.nutrient.pastel; break;
    case '피부/모발': backgroundColor = theme.palette.dna.skinHair.pastel; break;
    case '건강관리': backgroundColor = theme.palette.dna.healthcare.pastel; break;
    case '운동': backgroundColor = theme.palette.dna.workOut.pastel; break;
    case '식습관': backgroundColor = theme.palette.dna.eatingHabits.pastel; break;
    case '개인특성': backgroundColor = theme.palette.dna.personalCharacteristics.pastel; break;
    default: backgroundColor = theme.palette.dna.nutrient.pastel; break;
  }

  const navigate = useNavigate();
  const handleOnClick = () => {
    navigate(`/market/goods/${data.goodsSid}`);
  };

  return (
    <Box id="market-main--recommend-item" sx={{ width: '100%', pl: 1 }}>
      <Box
        sx={{
          p: 2.5,
          pb: 1,
          textAlign: 'left',
          backgroundColor,
          borderRadius: 1.25,
          width: '100%',
          height: pxToRem(220),
          position: 'relative',
        }}
        onClick={handleOnClick}
      >
        <Typography variant="Kor_14_r" component={'p'} sx={{ lineHeight: '20px', width: '100%', zIndex: 10 }}>
          {data.goodsSummary}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            bottom: pxToRem(8),
            left: 0,
            right: 0,
            zIndex:0,
          }}
        >
          <Image
            src={`${process.env.REACT_APP_IMAGE_STORAGE}${data.img1Path}`}
            alt={`${data.goodsNm}`}
            sx={{ width: pxToRem(120), height: pxToRem(120) }}
            onError={(e: any) => {
              e.target.src = '/assets/default-goods.svg';
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};
