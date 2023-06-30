import { Box, Typography, useTheme } from '@mui/material';
import { Variants, animate, motion, useInView } from 'framer-motion';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'src/components/image';
import { IGoodsModel } from 'src/models/market-store/Goods';
import { IResultPairListModel } from 'src/models/market-store/ResultPairList';
import { pxToRem } from 'src/theme/typography';
import { getIOSVersion } from 'src/utils/common';
import uuidv4 from 'src/utils/uuidv4';
import { ReactComponent as ImageVs } from '../assets/images/vs.svg';
import { Card } from '../components/Card';
import { ContentBox } from './ContentBox';

const isBeforeSupportFlexLayoutIOS = parseFloat(getIOSVersion() || '9999') <= 14.2;

export interface ICardPopularProps {
  goods?: IGoodsModel;
}

export const CardPopular = observer(({ goods }: ICardPopularProps) => {
  const theme = useTheme();
  const data: Array<IResultPairListModel> | null = goods?.resultPairList || null;

  const ref = useRef<HTMLDivElement>(null);

  const [cardWidth, setCardWidth] = useState('220px');

  useEffect(() => {
    if (ref.current) {
      const { current } = ref;
      const { width } = current.getBoundingClientRect();
      setCardWidth(width / 2 + 'px');
    }
  }, [ref]);

  const dnaColors = useMemo(() => {
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
        return theme.palette.dna.nutrient;
    }
  }, [
    goods?.ctegryList,
    theme.palette.dna.eatingHabits,
    theme.palette.dna.healthcare,
    theme.palette.dna.nutrient,
    theme.palette.dna.personalCharacteristics,
    theme.palette.dna.skinHair,
    theme.palette.dna.workOut,
  ]);

  return (
    <Card>
      <Typography
        variant="Kor_22_b"
        component={'p'}
        sx={{
          textAlign: 'left',
          wordBreak: 'keep-all',
        }}
      >
        나는 어떤 카드를 받게 될까?
      </Typography>
      <Typography
        variant="Kor_16_r"
        component={'p'}
        sx={{
          mt: 0.5,
          color: '#9DA0A5',
          textAlign: 'left',
          wordBreak: 'keep-all',
        }}
      >
        다른 사람들이 많이 받은 카드는
      </Typography>
      {data?.map((item, index) => (
        <ContentBox key={`popular-dna-card-${uuidv4()}`} sx={{ position: 'relative' }}>
          <Box
            ref={ref}
            sx={{
              display: 'flex',
              gap: 1,
            }}
          >
            <CardPopularItem
              width={cardWidth}
              {...item.testResult1}
              color={dnaColors}
              style={{ marginRight: isBeforeSupportFlexLayoutIOS ? '4px' : 0 }}
              selected={item.testResult1.testResultRate > item.testResult2.testResultRate}
            />
            <CardPopularItem
              width={cardWidth}
              {...item.testResult2}
              color={dnaColors}
              style={{ marginLeft: isBeforeSupportFlexLayoutIOS ? '4px' : 0 }}
              selected={item.testResult1.testResultRate < item.testResult2.testResultRate}
            />
          </Box>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              zIndex: 10,
              transform: 'translate(-50%, calc(-50% + 10px))',
              // width: pxToRem(40),
              // height: pxToRem(36),
            }}
          >
            <ImageVs width={40} height={36} />
          </Box>
        </ContentBox>
      ))}
    </Card>
  );
});

interface ICounterProps {
  from: number;
  to: number;
  color: string;
}
function Counter({ from, to, color = '#9DA0A5' }: ICounterProps) {
  const nodeRef = useRef<any>();
  const inView = useInView(nodeRef, { margin: '10%', amount: 'all', once: true });
  useEffect(() => {
    if (!nodeRef.current) return;
    const node = nodeRef.current;
    let controls: any;
    if (inView) {
      controls?.stop();
      controls = animate(from, to, {
        delay: 1,
        duration: 1,
        onUpdate(value) {
          node.textContent = Math.round(value);
        },
      });
    } else {
      node.textContent = 0;
    }
    return () => controls?.stop();
  }, [from, to, inView]);
  return <motion.span ref={nodeRef} style={{ color }}></motion.span>;
}

interface DnaColors {
  primary: string;
  secondary: string;
  pastel: string;
  base: string;
}

interface ICardPopularItemProps {
  color?: DnaColors;
  goodsNm?: string;
  testResultRate?: number;
  testResultNm?: string;
  testResultSummary?: string;
  testResultImgPath?: string;
  selected?: boolean;
  width: string;
  style: React.CSSProperties;
}
const CardPopularItem = ({
  testResultRate = 100,
  color = { primary: '#FCC800', secondary: '#FCC800', pastel: '#FFF4C9', base: '#fff9e5' },
  goodsNm,
  testResultNm,
  testResultSummary,
  testResultImgPath,
  selected,
  width,
  style,
}: ICardPopularItemProps) => {
  const theme = useTheme();

  const cardVariants: Variants = {
    offscreen: {
      backgroundColor: '#f9f9f9',
      opacity: 0.3,
    },
    onscreen: {
      backgroundColor: selected ? color.pastel : '#f9f9f9',
      opacity: 1,
      transition: {
        type: 'spring',
        bounce: 0.1,
        duration: 3,
      },
    },
  };

  const categoryTextVariants: Variants = {
    offscreen: {
      color: '#9DA0A5',
    },
    onscreen: {
      color: selected ? color.primary : '#9DA0A5',
      transition: {
        type: 'spring',
        bounce: 0.1,
        duration: 3,
      },
    },
  };
  const textVariants: Variants = {
    offscreen: {
      color: '#9DA0A5',
    },
    onscreen: {
      color: selected ? '#202123' : '#9DA0A5',
      transition: {
        type: 'spring',
        bounce: 0.1,
        duration: 3,
      },
    },
  };

  return (
    <motion.div
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ once: true, amount: 'all' }}
      variants={cardVariants}
      style={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        width,
        backgroundColor: '#F5F5F5',
        borderRadius: pxToRem(10),
        padding: 'calc(3/2 * 1em)',
        paddingLeft: 'calc(2.5/2 * 1em)',
        paddingRight: 'calc(2.5/2 * 1em)',
        gap: 'calc(0.5/2 * 1em)',
        ...style,
      }}
    >
      <Typography
        variant="Kor_14_b"
        component={'p'}
        sx={{
          alignSelf: 'center',
          textAlign: 'center',
          width: '100%',
          color: color.primary,
        }}
      >
        <motion.span
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 'all' }}
          variants={categoryTextVariants}
        >
          {goodsNm}
        </motion.span>
      </Typography>

      <Image
        src={`${process.env.REACT_APP_IMAGE_STORAGE}${testResultImgPath}`}
        alt=""
        onError={() => '/assets/images/no-candy.svg'}
        width={80}
        height={80}
        style={{
          filter: !selected ? 'grayscale(100%)' : 'none',
          opacity: !selected ? 0.35 : 1,
        }}
      />

      <Typography
        variant="Kor_14_b"
        // component={'p'}
        sx={{ alignSelf: 'center', textAlign: 'center', width: '100%' }}
      >
        <motion.span
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 'all' }}
          variants={textVariants}
        >
          {testResultNm}
        </motion.span>
      </Typography>
      <Typography
        variant="Eng_34_b"
        // component={'p'}
        sx={{ alignSelf: 'center', textAlign: 'center', width: '100%' }}
      >
        <Counter from={0} to={testResultRate} color={selected ? '#202123' : '#9DA0A5'} />
        <Typography
          variant="Eng_20_b"
          sx={{ alignSelf: 'center', textAlign: 'center', width: '100%' }}
        >
          <motion.span
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 'all' }}
            variants={textVariants}
          >
            %
          </motion.span>
        </Typography>
      </Typography>
    </motion.div>
  );
};
