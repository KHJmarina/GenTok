import { Box, useTheme } from '@mui/material';
import { useMemo, useState } from 'react';
import { IGoodsModel } from 'src/models/market-store/Goods';
import { GoodsImages } from '../components/GoodsImages';

export interface IHeroProps {
  goods?: IGoodsModel;
}

export const Hero = ({ goods }: IHeroProps) => {
  const theme = useTheme();
  const dnaColors = useMemo(() => {
    if (goods?.packageYn) {
      return {
        primary: '#FFF7F3', //theme.palette.dna.package,
        secondary: '#FFF7F3', //theme.palette.dna.package,
        pastel: '#FFF7F3', // theme.palette.dna.package,
        base: '#FFF7F3', // theme.palette.dna.package,
      };
    }
    switch (goods?.ctegryList[0]?.ctegrySid) {
      case 1: // 영양소
        return theme.palette.dna.nutrient;
      case 2: // 운동
        return theme.palette.dna.workOut;
      case 3: // 피부/모발
        return theme.palette.dna.skinHair;
      case 4: // 식습관
        return theme.palette.dna.eatingHabits;
      case 5:
        // 개인특성
        return theme.palette.dna.personalCharacteristics;
      case 6:
        // 건강관리
        return theme.palette.dna.healthcare;
      default:
        return {
          primary: 'transparent',
          secondary: 'transparent',
          pastel: 'transparent',
          base: 'transparent',
        };
    }
  }, [
    goods?.ctegryList,
    goods?.packageYn,
    theme.palette.dna.eatingHabits,
    theme.palette.dna.healthcare,
    theme.palette.dna.nutrient,
    theme.palette.dna.personalCharacteristics,
    theme.palette.dna.skinHair,
    theme.palette.dna.workOut,
  ]);

  const [heroHeight, setHeroHeight] = useState(270);

  const handleReInit = (state: any) => {
    setHeroHeight(state.listHeight);
  };

  return (
    <Box
      id="goods-detail-hero"
      sx={{
        height: `${heroHeight + 32 + 28 * 2}px`,
        background: dnaColors.pastel,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        p: '28px 28px 32px 28px',
      }}
    >
      <GoodsImages goods={goods} sx={{ width: '100%' }} swipe onReInit={handleReInit} />
    </Box>
  );
};
