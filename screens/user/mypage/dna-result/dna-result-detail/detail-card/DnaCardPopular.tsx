import { Box, Typography, useTheme, Paper } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { DnaCardDetail, useStores } from 'src/models';
import { pxToRem } from 'src/theme/typography';
// import { Card } from '../components/Card';
// import { ContentBox } from './ContentBox';
import Image from 'src/components/image';
import { ReactComponent as ImageVs } from 'src/screens/market/assets/images/vs.svg';
import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, Variants } from 'framer-motion';
import { convertCtegryToValue } from 'src/screens/user/mypage/Mypage';
import { ITestResult } from 'src/models/test-result/TestResult';

interface Props {
  ctegryNm : any
}

export interface ICardPopularProps {}

export const DnaCardPopular = observer(({}: ICardPopularProps , ctegryNm : Props) => {
  const rootStore = useStores();
  const { dnaCardDetailStore, loadingStore } = rootStore;
  const theme = useTheme();

  const ref = useRef<HTMLDivElement>(null);

  const [cardWidth, setCardWidth] = useState('11.38rem');

  const myTestResultNm = dnaCardDetailStore.dnaCardDetail?.testResultNm;
  const leftTestResultNm = dnaCardDetailStore.dnaCardDetail.resultPair?.testResult1.testResultNm;
  const rightTestResultNm = dnaCardDetailStore.dnaCardDetail.resultPair?.testResult2.testResultNm;
  const levelPosition = dnaCardDetailStore.dnaCardDetail?.level?.myLevelPosition;

  useEffect(() => {
    if (ref.current) {
      const { current } = ref;
      const { width } = current.getBoundingClientRect();
      setCardWidth(width / 2 + 'px');
    }
  }, [ref]);

  const getTestResultRate = () => {
    let testResult = {} as ITestResult;

    if (myTestResultNm === leftTestResultNm) {
      testResult = dnaCardDetailStore.dnaCardDetail.resultPair?.testResult1 as ITestResult;
    } else if (myTestResultNm === rightTestResultNm) {
      testResult = dnaCardDetailStore.dnaCardDetail.resultPair?.testResult2 as ITestResult;
    } else {
      if(levelPosition === 'left') {
        testResult = dnaCardDetailStore.dnaCardDetail.resultPair?.testResult1 as ITestResult;
      } else if(levelPosition === 'right') {
        testResult = dnaCardDetailStore.dnaCardDetail.resultPair?.testResult2 as ITestResult;
      }
    }
    return testResult.testResultRate;
  }

  const getTestResultSelected = (testResultIndex: number) => {
    let isSelected = false;

    if (testResultIndex === 1) {
      if (myTestResultNm === leftTestResultNm) {
        isSelected = true;
      } else if (levelPosition === 'left') { 
        isSelected = true;
      }
    } else if (testResultIndex === 2) {
      if (myTestResultNm === rightTestResultNm) {
        isSelected = true;
      } else if (levelPosition === 'right') { 
        isSelected = true;
      }
    }

    return isSelected;
  }

  return (
    <Paper
      sx={{
        borderRadius: 0,
        background: '#ffffff',
        py: '2.5rem ',
      }}
      elevation={0}
    >
      <Typography
        variant="Kor_22_b"
        component={'p'}
        sx={{
          textAlign: 'left',
          wordBreak: 'keep-all',
          px : '1.25rem'
        }}
      >
        <span style={{ fontWeight: 400 }}> 나와 같은 카드를 받은 사람은 </span> <br /> 
          <Typography variant="Kor_22_b">
            한국인 100명 중&nbsp;
            <span style={{ color : theme.palette.primary.main}}>
            {getTestResultRate()}
            명</span>
          </Typography>
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          pt: 2.5,
          position: 'relative',
          px : '1.25rem'
        }}
      >
        <Box ref={ref} sx={{ display: 'flex'}}>
          <CardPopularItem
            className='1'
            width={'12rem'}
            value={dnaCardDetailStore.dnaCardDetail.resultPair?.testResult1.testResultRate}
            title={dnaCardDetailStore.dnaCardDetail.resultPair?.testResult1?.testResultNm}
            // categoryName={dnaCardDetailStore.dnaCardDetail?.ctegryList[0]?.ctegryNm}
            goodsName={dnaCardDetailStore.dnaCardDetail?.resultPair?.testResult1.goodsNm}
            color={theme.palette.dna.eatingHabits}
            testResultImg={dnaCardDetailStore.dnaCardDetail.resultPair?.testResult1?.testResultImgPath}
            testResultImg2={dnaCardDetailStore.dnaCardDetail.resultPair?.testResult2?.testResultImgPath}
            backgroundColor2={`${theme.palette.dna[convertCtegryToValue(Number(dnaCardDetailStore.dnaCardDetail?.ctegryList[0]?.ctegrySid!))].pastel}`}
            textColor={`${theme.palette.dna[convertCtegryToValue(Number(dnaCardDetailStore.dnaCardDetail?.ctegryList[0]?.ctegrySid!))].primary}`}
            selected = { getTestResultSelected(1) }
            src={dnaCardDetailStore.dnaCardDetail.resultPair?.testResult1.testResultImgPath}
          />
          <CardPopularItem
            className='2'
            width={'12rem'}
            value={dnaCardDetailStore.dnaCardDetail.resultPair?.testResult2?.testResultRate}
            title={dnaCardDetailStore.dnaCardDetail.resultPair?.testResult2?.testResultNm}
            // categoryName={dnaCardDetailStore.dnaCardDetail?.ctegryList[0]?.ctegryNm!}
            goodsName={dnaCardDetailStore.dnaCardDetail?.resultPair?.testResult2.goodsNm}
            testResultImg={dnaCardDetailStore.dnaCardDetail.resultPair?.testResult1?.testResultImgPath}
            testResultImg2={dnaCardDetailStore.dnaCardDetail.resultPair?.testResult2?.testResultImgPath}
            color={theme.palette.dna.eatingHabits}
            backgroundColor2={`${theme.palette.dna[convertCtegryToValue(Number(dnaCardDetailStore.dnaCardDetail?.ctegryList[0]?.ctegrySid!))].pastel}`}
            textColor={`${theme.palette.dna[convertCtegryToValue(Number(dnaCardDetailStore.dnaCardDetail?.ctegryList[0]?.ctegrySid!))].primary}`}
            selected = { getTestResultSelected(2) }
            src={dnaCardDetailStore.dnaCardDetail.resultPair?.testResult2.testResultImgPath}
          />
        </Box>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            // zIndex: 10,
            transform: 'translate(-50%, calc(-50% + 10px))',
            // width: pxToRem(40),
            // height: pxToRem(36),
          }}
        >
          <ImageVs width={40} height={36} />
        </Box>
      </Box>
    </Paper>
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
  value?: number;
  // categoryName?: any;
  goodsName?: any;
  title?: string;
  selected?: boolean;
  width: string;
  className: string;
  testResultImg : any
  testResultImg2 : any
  backgroundColor2 :any
  textColor :any
  src: any
}
const CardPopularItem = ({
  value = 100,
  color = { primary: '#FCC800', secondary: '#FCC800', pastel: '#FFF4C9', base: '#fff9e5' },
  // categoryName,
  goodsName,
  testResultImg,
  testResultImg2,
  backgroundColor2,
  textColor,
  title,
  selected,
  width,
  className,
  src,
}: ICardPopularItemProps) => {
  const theme = useTheme();

  const cardVariants: Variants = {
    offscreen: {
      backgroundColor: '#f9f9f9',
      opacity: 0.3,
    },
    onscreen: {
      backgroundColor: selected ? backgroundColor2 : '#f9f9f9',
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
      color: selected ? textColor: '#9DA0A5',
      // color: textColor,
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
      // color: '#202123',
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
        flex: 1 ,
        flexDirection: 'column',
        width,
        backgroundColor: '#F5F5F5',
        borderRadius: pxToRem(10),
        // padding: 'calc(3/2 * 1em)',
        // padding: pxToRem(20),
        paddingTop: pxToRem(20),
        paddingBottom: pxToRem(20),
        // paddingLeft: 'calc(2.5/2 * 1em)',
        paddingLeft: pxToRem(12),
        paddingRight: pxToRem(12),
        // paddingRight: 'calc(2.5/2 * 1em)',
        height: '100%',
        alignItems: 'center',
        marginLeft: className === '2' ? pxToRem(8) : pxToRem(0),
      }}
    >
      <Typography
        variant="Kor_14_b"
        component={'p'}
        sx={{
          alignSelf: 'center',
          textAlign: 'center',
          width: '100%',
          color: theme.palette.dna.eatingHabits.primary,
          
        }}
      >
        <motion.span
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 'all' }}
          variants={categoryTextVariants}
          
        >
          {goodsName}
        </motion.span>
      </Typography>
      <Box sx={{ width:'90%', height:'90%' }} >
        <Image
          src={process.env.REACT_APP_IMAGE_STORAGE + src}
          alt=""
          onError={(e: any) => {
            e.target.src = '/assets/default-goods.svg';
          }}
          style={{
            filter: !selected ? 'grayscale(100%)' : 'none',
            opacity: !selected ? 0.35 : 1,
            // width: pxToRem(100),
            // height: pxToRem(100)
          }}
        />
      </Box>
      <Typography
        variant="Kor_14_b"
        // component={'p'}
        sx={{ alignSelf: 'center', textAlign: 'center', width: '180%' }}
      >
        <motion.span
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 'all' }}
          variants={textVariants}
        >
          {title}
        </motion.span>
      </Typography>
      <Typography
        variant="Eng_34_b"
        // component={'p'}
        sx={{ alignSelf: 'center', textAlign: 'center', width: '100%' }}
      >
        {/* <Counter from={0} to={value} color={selected ? '#202123' : '#9DA0A5'} /> */}
        <Counter from={0} to={value} color={selected ? '#202123' : '#9DA0A5'} />
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
